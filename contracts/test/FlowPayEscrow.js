const { expect } = require("chai");
const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("ethers");

describe("FlowPayEscrow", function () {
  async function deployFixture() {
    const [owner, buyer, seller, supplier, platform, arbiter] = await hre.ethers.getSigners();

    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();

    const FlowPayEscrow = await hre.ethers.getContractFactory("FlowPayEscrow");
    const escrow = await FlowPayEscrow.deploy(await usdc.getAddress());

    await usdc.mint(buyer.address, ethers.parseUnits("100000", 6));
    await usdc.connect(buyer).approve(await escrow.getAddress(), ethers.MaxUint256);

    return { usdc, escrow, owner, buyer, seller, supplier, platform, arbiter };
  }

  async function createPayment(escrow, buyer, seller, supplier, platform, arbiter) {
    const now = BigInt(await time.latest());
    const amount = ethers.parseUnits("1000", 6);
    await escrow.connect(buyer).createPayment(
      "Test Payment",
      "Description",
      seller.address,
      supplier.address,
      platform.address,
      arbiter.address,
      amount,
      85,
      5,
      10,
      now + 3600n,
      now + 7200n,
      now + 10800n
    );
    return { amount, now };
  }

  it("should create a payment", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const { amount } = await createPayment(escrow, buyer, seller, supplier, platform, arbiter);

    const payment = await escrow.getPayment(0);
    expect(payment.buyer).to.equal(buyer.address);
    expect(payment.seller).to.equal(seller.address);
    expect(payment.amount).to.equal(amount);
    expect(payment.status).to.equal(0); // Pending
  });

  it("should reject zero addresses", async function () {
    const { escrow, buyer, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());
    await expect(
      escrow.connect(buyer).createPayment(
        "T", "D", hre.ethers.ZeroAddress, hre.ethers.ZeroAddress, platform.address, arbiter.address, 100, 90, 0, 10, now + 3600n, now + 7200n, now + 10800n
      )
    ).to.be.revertedWithCustomError(escrow, "ZeroAddress");
  });

  it("should reject zero amount", async function () {
    const { escrow, buyer, seller, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());
    await expect(
      escrow.connect(buyer).createPayment(
        "T", "D", seller.address, hre.ethers.ZeroAddress, platform.address, arbiter.address, 0, 90, 0, 10, now + 3600n, now + 7200n, now + 10800n
      )
    ).to.be.revertedWithCustomError(escrow, "ZeroAmount");
  });

  it("should reject invalid split", async function () {
    const { escrow, buyer, seller, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());
    await expect(
      escrow.connect(buyer).createPayment(
        "T", "D", seller.address, hre.ethers.ZeroAddress, platform.address, arbiter.address, 100, 80, 0, 10, now + 3600n, now + 7200n, now + 10800n
      )
    ).to.be.revertedWithCustomError(escrow, "InvalidSplit");
  });

  it("should reject invalid deadlines", async function () {
    const { escrow, buyer, seller, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());
    await expect(
      escrow.connect(buyer).createPayment(
        "T", "D", seller.address, hre.ethers.ZeroAddress, platform.address, arbiter.address, 100, 90, 0, 10, now, now + 7200n, now + 10800n
      )
    ).to.be.revertedWithCustomError(escrow, "InvalidDeadline");
  });

  it("should fund a payment", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const { amount } = await createPayment(escrow, buyer, seller, supplier, platform, arbiter);

    await expect(escrow.connect(buyer).fundPayment(0))
      .to.emit(escrow, "PaymentFunded")
      .withArgs(0, buyer.address, amount);

    const payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(1); // Funded
  });

  it("should reject duplicate funding", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).fundPayment(0);
    await expect(escrow.connect(buyer).fundPayment(0)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
  });

  it("should mark delivered and confirm receipt", async function () {
    const { escrow, usdc, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const { amount } = await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).fundPayment(0);

    await escrow.connect(seller).markDelivered(0);
    let payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(2); // Delivered

    const sellerBalanceBefore = await usdc.balanceOf(seller.address);
    await escrow.connect(buyer).confirmReceipt(0);
    const sellerBalanceAfter = await usdc.balanceOf(seller.address);

    payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(3); // Completed
    expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(amount * 85n / 100n);
  });

  it("should open dispute and refund", async function () {
    const { escrow, usdc, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const { amount } = await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).fundPayment(0);

    await escrow.connect(buyer).openDispute(0);
    let payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(4); // Disputed

    const buyerBalanceBefore = await usdc.balanceOf(buyer.address);
    await escrow.connect(arbiter).resolveDispute(0, false, 0n, 0n, 0n);
    const buyerBalanceAfter = await usdc.balanceOf(buyer.address);

    payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(5); // Refunded
    expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(amount);
  });

  it("should resolve dispute with partial settlement", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const { amount } = await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).fundPayment(0);
    await escrow.connect(buyer).openDispute(0);

    await escrow.connect(arbiter).resolveDispute(0, true, amount * 60n / 100n, amount * 30n / 100n, amount * 10n / 100n);
    const payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(3); // Completed
  });

  it("should execute auto release after deadline", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const { amount } = await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).fundPayment(0);
    await escrow.connect(seller).markDelivered(0);

    await time.increaseTo(await time.latest() + 11000);

    await expect(escrow.executeAutoRelease(0)).to.emit(escrow, "AutoReleaseExecuted");
    const payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(3); // Completed
  });

  it("should cancel unfunded payment", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).cancelUnfundedPayment(0);
    const payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(6); // Cancelled
  });

  it("should reject unauthorized actions", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await expect(escrow.connect(seller).fundPayment(0)).to.be.revertedWithCustomError(escrow, "Unauthorized");
  });

  it("should get payments by buyer and seller", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);

    const buyerPayments = await escrow.getPaymentsByBuyer(buyer.address);
    expect(buyerPayments.length).to.equal(2);

    const sellerPayments = await escrow.getPaymentsBySeller(seller.address);
    expect(sellerPayments.length).to.equal(2);
  });

  // ===== Split with active supplier =====

  it("should distribute split correctly with active supplier", async function () {
    const { escrow, usdc, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());
    const amount = ethers.parseUnits("1000", 6);

    // 70% seller, 20% supplier, 10% platform
    await escrow.connect(buyer).createPayment(
      "Split with supplier",
      "Active supplier split test",
      seller.address,
      supplier.address,
      platform.address,
      arbiter.address,
      amount,
      70,
      20,
      10,
      now + 3600n,
      now + 7200n,
      now + 10800n
    );

    await escrow.connect(buyer).fundPayment(0);
    await escrow.connect(seller).markDelivered(0);

    const sellerBefore = await usdc.balanceOf(seller.address);
    const supplierBefore = await usdc.balanceOf(supplier.address);
    const platformBefore = await usdc.balanceOf(platform.address);

    await escrow.connect(buyer).confirmReceipt(0);

    const sellerAfter = await usdc.balanceOf(seller.address);
    const supplierAfter = await usdc.balanceOf(supplier.address);
    const platformAfter = await usdc.balanceOf(platform.address);

    expect(sellerAfter - sellerBefore).to.equal(amount * 70n / 100n);
    expect(supplierAfter - supplierBefore).to.equal(amount * 20n / 100n);
    expect(platformAfter - platformBefore).to.equal(amount * 10n / 100n);
  });

  it("should allow zero supplier percentage with zero address supplier", async function () {
    const { escrow, buyer, seller, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());
    const amount = ethers.parseUnits("500", 6);

    // 95% seller, 0% supplier, 5% platform — supplier is zero address
    await escrow.connect(buyer).createPayment(
      "No supplier",
      "Zero supplier test",
      seller.address,
      hre.ethers.ZeroAddress,
      platform.address,
      arbiter.address,
      amount,
      95,
      0,
      5,
      now + 3600n,
      now + 7200n,
      now + 10800n
    );

    const payment = await escrow.getPayment(0);
    expect(payment.supplier).to.equal(hre.ethers.ZeroAddress);
    expect(payment.supplierPercentage).to.equal(0);
  });

  // ===== Concurrent payments =====

  it("should handle multiple concurrent payments independently", async function () {
    const { escrow, usdc, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());

    // Create 3 payments with different amounts
    const amounts = [
      ethers.parseUnits("100", 6),
      ethers.parseUnits("200", 6),
      ethers.parseUnits("300", 6),
    ];

    for (let i = 0; i < 3; i++) {
      await escrow.connect(buyer).createPayment(
        `Payment ${i + 1}`,
        `Concurrent payment ${i + 1}`,
        seller.address,
        supplier.address,
        platform.address,
        arbiter.address,
        amounts[i],
        90,
        0,
        10,
        now + 3600n,
        now + 7200n,
        now + 10800n
      );
    }

    // Fund only payment 0 and 2, leave 1 pending
    await escrow.connect(buyer).fundPayment(0);
    await escrow.connect(buyer).fundPayment(2);

    // Complete payment 0
    await escrow.connect(seller).markDelivered(0);
    await escrow.connect(buyer).confirmReceipt(0);

    // Cancel payment 1 (still pending)
    await escrow.connect(buyer).cancelUnfundedPayment(1);

    // Verify states are independent
    expect((await escrow.getPayment(0)).status).to.equal(3); // Completed
    expect((await escrow.getPayment(1)).status).to.equal(6); // Cancelled
    expect((await escrow.getPayment(2)).status).to.equal(1); // Funded

    // Verify buyer has 3 payments
    const buyerPayments = await escrow.getPaymentsByBuyer(buyer.address);
    expect(buyerPayments.length).to.equal(3);

    // Verify seller received correct amount from payment 0
    const sellerBalance = await usdc.balanceOf(seller.address);
    expect(sellerBalance).to.equal(amounts[0] * 90n / 100n);
  });

  it("should handle dispute on one payment while others continue normally", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();

    // Create and fund two payments
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).fundPayment(0);
    await escrow.connect(buyer).fundPayment(1);

    // Dispute payment 0, complete payment 1 normally
    await escrow.connect(buyer).openDispute(0);
    await escrow.connect(seller).markDelivered(1);
    await escrow.connect(buyer).confirmReceipt(1);

    expect((await escrow.getPayment(0)).status).to.equal(4); // Disputed
    expect((await escrow.getPayment(1)).status).to.equal(3); // Completed

    // Resolve dispute on payment 0
    await escrow.connect(arbiter).resolveDispute(0, false, 0n, 0n, 0n);
    expect((await escrow.getPayment(0)).status).to.equal(5); // Refunded
  });

  // ===== Deadline edge cases =====

  it("should reject funding after funding deadline expired", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());

    await escrow.connect(buyer).createPayment(
      "Expired funding",
      "Funding deadline test",
      seller.address,
      supplier.address,
      platform.address,
      arbiter.address,
      ethers.parseUnits("100", 6),
      90,
      0,
      10,
      now + 100n,
      now + 7200n,
      now + 10800n
    );

    // Advance time past funding deadline
    await time.increaseTo(now + 200n);

    await expect(
      escrow.connect(buyer).fundPayment(0)
    ).to.be.revertedWithCustomError(escrow, "FundingDeadlineExpired");
  });

  it("should not allow auto release before auto release deadline", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).fundPayment(0);
    await escrow.connect(seller).markDelivered(0);

    // Try auto release immediately (before deadline)
    await expect(
      escrow.executeAutoRelease(0)
    ).to.be.revertedWithCustomError(escrow, "DeliveryDeadlineNotReached");
  });

  it("should allow auto release exactly at deadline boundary", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());
    const autoReleaseTime = now + 5000n;

    await escrow.connect(buyer).createPayment(
      "Boundary test",
      "Auto release at deadline",
      seller.address,
      supplier.address,
      platform.address,
      arbiter.address,
      ethers.parseUnits("100", 6),
      90,
      0,
      10,
      now + 1000n,
      now + 3000n,
      autoReleaseTime
    );

    await escrow.connect(buyer).fundPayment(0);
    await escrow.connect(seller).markDelivered(0);

    // Advance to exactly the auto release time
    await time.increaseTo(Number(autoReleaseTime));

    await expect(escrow.executeAutoRelease(0)).to.emit(escrow, "AutoReleaseExecuted");
    const payment = await escrow.getPayment(0);
    expect(payment.status).to.equal(3); // Completed
  });

  it("should reject auto release on pending (unfunded) payment", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    const now = BigInt(await time.latest());

    await escrow.connect(buyer).createPayment(
      "Unfunded auto release",
      "Should fail",
      seller.address,
      supplier.address,
      platform.address,
      arbiter.address,
      ethers.parseUnits("100", 6),
      90,
      0,
      10,
      now + 1000n,
      now + 3000n,
      now + 5000n
    );

    // Don't fund it, advance time past auto release
    await time.increaseTo(now + 6000n);

    await expect(
      escrow.executeAutoRelease(0)
    ).to.be.revertedWithCustomError(escrow, "InvalidStatus");
  });

  it("should reject auto release on already completed payment", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);
    await escrow.connect(buyer).fundPayment(0);
    await escrow.connect(seller).markDelivered(0);
    await escrow.connect(buyer).confirmReceipt(0);

    // Payment is already completed
    await time.increaseTo((await time.latest()) + 11000);

    await expect(
      escrow.executeAutoRelease(0)
    ).to.be.revertedWithCustomError(escrow, "InvalidStatus");
  });

  it("should reject dispute on pending (unfunded) payment", async function () {
    const { escrow, buyer, seller, supplier, platform, arbiter } = await deployFixture();
    await createPayment(escrow, buyer, seller, supplier, platform, arbiter);

    // Payment is still pending (not funded)
    await expect(
      escrow.connect(buyer).openDispute(0)
    ).to.be.revertedWithCustomError(escrow, "InvalidStatus");
  });
});
