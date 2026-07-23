import { z } from "zod";

export const paymentSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title too long"),
    description: z.string().max(2000, "Description too long").optional(),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    seller: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
    supplier: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .or(z.literal("").transform(() => "0x0000000000000000000000000000000000000000")),
    platform: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
    sellerPercentage: z.coerce.number().min(0).max(100),
    supplierPercentage: z.coerce.number().min(0).max(100),
    platformPercentage: z.coerce.number().min(0).max(100),
    fundingDeadline: z.string().optional(),
    deliveryDeadline: z.string().optional(),
    autoReleaseDeadline: z.string().optional(),
  })
  .refine(
    (data) => data.sellerPercentage + data.supplierPercentage + data.platformPercentage === 100,
    {
      message: "Split percentages must total 100%",
      path: ["platformPercentage"],
    },
  )
  .refine(
    (data) => {
      // Only validate deadlines if they are provided (scheduled mode)
      if (data.fundingDeadline && data.deliveryDeadline) {
        return new Date(data.deliveryDeadline) > new Date(data.fundingDeadline);
      }
      return true;
    },
    {
      message: "Delivery deadline must be after funding deadline",
      path: ["deliveryDeadline"],
    },
  )
  .refine(
    (data) => {
      if (data.deliveryDeadline && data.autoReleaseDeadline) {
        return new Date(data.autoReleaseDeadline) > new Date(data.deliveryDeadline);
      }
      return true;
    },
    {
      message: "Auto release must be after delivery deadline",
      path: ["autoReleaseDeadline"],
    },
  );

export type PaymentSchemaType = z.infer<typeof paymentSchema>;
