// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title FlowPayEscrow
 * @notice Programmable USDC escrow payment contract for Arc Testnet.
 */
contract FlowPayEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum PaymentStatus {
        Pending,
        Funded,
        Delivered,
        Completed,
        Disputed,
        Refunded,
        Cancelled
    }

    struct Payment {
        uint256 id;
        string title;
        string description;
        address buyer;
        address seller;
        address supplier;
        address platform;
        address arbiter;
        uint256 amount;
        uint256 sellerPercentage;
        uint256 supplierPercentage;
        uint256 platformPercentage;
        uint256 fundingDeadline;
        uint256 deliveryDeadline;
        uint256 autoReleaseTime;
        PaymentStatus status;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 completedAt;
    }

    IERC20 public immutable usdc;
    uint256 public nextPaymentId;
    mapping(uint256 => Payment) public payments;
    mapping(address => uint256[]) public paymentsByBuyer;
    mapping(address => uint256[]) public paymentsBySeller;

    event PaymentCreated(
        uint256 indexed paymentId,
        address indexed buyer,
        address indexed seller,
        uint256 amount
    );
    event PaymentFunded(uint256 indexed paymentId, address indexed buyer, uint256 amount);
    event PaymentDelivered(uint256 indexed paymentId, address indexed seller);
    event PaymentCompleted(uint256 indexed paymentId, uint256 sellerAmount, uint256 supplierAmount, uint256 platformAmount);
    event DisputeOpened(uint256 indexed paymentId, address indexed buyer);
    event DisputeResolved(uint256 indexed paymentId, PaymentStatus outcome);
    event PaymentRefunded(uint256 indexed paymentId, address indexed buyer, uint256 amount);
    event PaymentCancelled(uint256 indexed paymentId, address indexed buyer);
    event AutoReleaseExecuted(uint256 indexed paymentId, uint256 sellerAmount, uint256 supplierAmount, uint256 platformAmount);

    error ZeroAddress();
    error ZeroAmount();
    error InvalidDeadline();
    error InvalidSplit();
    error PaymentNotFound();
    error Unauthorized();
    error InvalidStatus();
    error DuplicateFunding();
    error DuplicateSettlement();
    error DuplicateRefund();
    error FundingDeadlineExpired();
    error DeliveryDeadlineNotReached();
    error DisputeActive();
    error TransferFailed();

    constructor(address _usdc) {
        if (_usdc == address(0)) revert ZeroAddress();
        usdc = IERC20(_usdc);
    }

    modifier onlyBuyer(uint256 paymentId) {
        if (payments[paymentId].buyer != msg.sender) revert Unauthorized();
        _;
    }

    modifier onlySeller(uint256 paymentId) {
        if (payments[paymentId].seller != msg.sender) revert Unauthorized();
        _;
    }

    modifier onlyArbiter(uint256 paymentId) {
        if (payments[paymentId].arbiter != msg.sender) revert Unauthorized();
        _;
    }

    modifier onlyBuyerOrSeller(uint256 paymentId) {
        if (payments[paymentId].buyer != msg.sender && payments[paymentId].seller != msg.sender) {
            revert Unauthorized();
        }
        _;
    }

    function createPayment(
        string calldata title,
        string calldata description,
        address seller,
        address supplier,
        address platform,
        address arbiter,
        uint256 amount,
        uint256 sellerPercentage,
        uint256 supplierPercentage,
        uint256 platformPercentage,
        uint256 fundingDeadline,
        uint256 deliveryDeadline,
        uint256 autoReleaseTime
    ) external returns (uint256 paymentId) {
        if (seller == address(0) || platform == address(0) || arbiter == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (block.timestamp >= fundingDeadline || fundingDeadline >= deliveryDeadline || deliveryDeadline >= autoReleaseTime) {
            revert InvalidDeadline();
        }
        if (sellerPercentage + supplierPercentage + platformPercentage != 100) revert InvalidSplit();

        paymentId = nextPaymentId++;
        Payment storage p = payments[paymentId];
        p.id = paymentId;
        p.title = title;
        p.description = description;
        p.buyer = msg.sender;
        p.seller = seller;
        p.supplier = supplier;
        p.platform = platform;
        p.arbiter = arbiter;
        p.amount = amount;
        p.sellerPercentage = sellerPercentage;
        p.supplierPercentage = supplierPercentage;
        p.platformPercentage = platformPercentage;
        p.fundingDeadline = fundingDeadline;
        p.deliveryDeadline = deliveryDeadline;
        p.autoReleaseTime = autoReleaseTime;
        p.status = PaymentStatus.Pending;
        p.createdAt = block.timestamp;

        paymentsByBuyer[msg.sender].push(paymentId);
        paymentsBySeller[seller].push(paymentId);

        emit PaymentCreated(paymentId, msg.sender, seller, amount);
    }

    function fundPayment(uint256 paymentId) external nonReentrant onlyBuyer(paymentId) {
        Payment storage p = payments[paymentId];
        if (p.status != PaymentStatus.Pending) revert InvalidStatus();
        if (block.timestamp > p.fundingDeadline) revert FundingDeadlineExpired();

        usdc.safeTransferFrom(msg.sender, address(this), p.amount);
        p.status = PaymentStatus.Funded;
        p.fundedAt = block.timestamp;

        emit PaymentFunded(paymentId, msg.sender, p.amount);
    }

    function cancelUnfundedPayment(uint256 paymentId) external onlyBuyer(paymentId) {
        Payment storage p = payments[paymentId];
        if (p.status != PaymentStatus.Pending) revert InvalidStatus();

        p.status = PaymentStatus.Cancelled;
        emit PaymentCancelled(paymentId, msg.sender);
    }

    function markDelivered(uint256 paymentId) external onlySeller(paymentId) {
        Payment storage p = payments[paymentId];
        if (p.status != PaymentStatus.Funded) revert InvalidStatus();
        if (block.timestamp > p.deliveryDeadline) revert DeliveryDeadlineNotReached();

        p.status = PaymentStatus.Delivered;
        emit PaymentDelivered(paymentId, msg.sender);
    }

    function confirmReceipt(uint256 paymentId) external nonReentrant onlyBuyer(paymentId) {
        Payment storage p = payments[paymentId];
        if (p.status != PaymentStatus.Delivered) revert InvalidStatus();

        _settle(paymentId);
    }

    function openDispute(uint256 paymentId) external onlyBuyer(paymentId) {
        Payment storage p = payments[paymentId];
        if (p.status != PaymentStatus.Funded && p.status != PaymentStatus.Delivered) {
            revert InvalidStatus();
        }
        if (block.timestamp > p.autoReleaseTime) revert DeliveryDeadlineNotReached();

        p.status = PaymentStatus.Disputed;
        emit DisputeOpened(paymentId, msg.sender);
    }

    function resolveDispute(
        uint256 paymentId,
        bool releaseToSeller,
        uint256 sellerAmount,
        uint256 supplierAmount,
        uint256 platformAmount
    ) external nonReentrant onlyArbiter(paymentId) {
        Payment storage p = payments[paymentId];
        if (p.status != PaymentStatus.Disputed) revert InvalidStatus();

        if (releaseToSeller) {
            if (sellerAmount + supplierAmount + platformAmount != p.amount) revert InvalidSplit();
            _distribute(paymentId, sellerAmount, supplierAmount, platformAmount);
            p.status = PaymentStatus.Completed;
            p.completedAt = block.timestamp;
            emit DisputeResolved(paymentId, PaymentStatus.Completed);
            emit PaymentCompleted(paymentId, sellerAmount, supplierAmount, platformAmount);
        } else {
            _refund(paymentId);
            emit DisputeResolved(paymentId, PaymentStatus.Refunded);
        }
    }

    function refundPayment(uint256 paymentId) external nonReentrant onlyBuyer(paymentId) {
        Payment storage p = payments[paymentId];
        if (p.status != PaymentStatus.Funded && p.status != PaymentStatus.Delivered) {
            revert InvalidStatus();
        }
        if (block.timestamp <= p.deliveryDeadline) revert DeliveryDeadlineNotReached();

        _refund(paymentId);
    }

    function executeAutoRelease(uint256 paymentId) external nonReentrant {
        Payment storage p = payments[paymentId];
        if (p.status != PaymentStatus.Delivered) revert InvalidStatus();
        if (block.timestamp <= p.autoReleaseTime) revert DeliveryDeadlineNotReached();

        _settle(paymentId);
        emit AutoReleaseExecuted(paymentId, p.amount, 0, 0);
    }

    function _settle(uint256 paymentId) internal {
        Payment storage p = payments[paymentId];
        if (p.status == PaymentStatus.Completed || p.status == PaymentStatus.Refunded) revert DuplicateSettlement();

        uint256 sellerAmount = (p.amount * p.sellerPercentage) / 100;
        uint256 supplierAmount = (p.amount * p.supplierPercentage) / 100;
        uint256 platformAmount = p.amount - sellerAmount - supplierAmount;

        _distribute(paymentId, sellerAmount, supplierAmount, platformAmount);
        p.status = PaymentStatus.Completed;
        p.completedAt = block.timestamp;

        emit PaymentCompleted(paymentId, sellerAmount, supplierAmount, platformAmount);
    }

    function _distribute(
        uint256 paymentId,
        uint256 sellerAmount,
        uint256 supplierAmount,
        uint256 platformAmount
    ) internal {
        Payment storage p = payments[paymentId];
        usdc.safeTransfer(p.seller, sellerAmount);
        if (p.supplier != address(0) && supplierAmount > 0) {
            usdc.safeTransfer(p.supplier, supplierAmount);
        }
        usdc.safeTransfer(p.platform, platformAmount);
    }

    function _refund(uint256 paymentId) internal {
        Payment storage p = payments[paymentId];
        if (p.status == PaymentStatus.Refunded) revert DuplicateRefund();

        p.status = PaymentStatus.Refunded;
        usdc.safeTransfer(p.buyer, p.amount);

        emit PaymentRefunded(paymentId, p.buyer, p.amount);
    }

    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    function getPaymentsByBuyer(address buyer) external view returns (Payment[] memory) {
        uint256[] storage ids = paymentsByBuyer[buyer];
        Payment[] memory result = new Payment[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = payments[ids[i]];
        }
        return result;
    }

    function getPaymentsBySeller(address seller) external view returns (Payment[] memory) {
        uint256[] storage ids = paymentsBySeller[seller];
        Payment[] memory result = new Payment[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = payments[ids[i]];
        }
        return result;
    }
}
