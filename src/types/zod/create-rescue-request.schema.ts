import { z } from "zod";
import { AnimalType } from "../enums";

export const createRescueRequestSchema = z.object({
    reporterId: z.string().uuid({ message: "reporterId must be a valid UUID" }),

    description: z
      .string()
      .max(1000, "description must be at most 1000 characters")
      .optional()
      .nullable(),
  
    animalType: z.enum(AnimalType, `animalType must be one of: ${Object.values(AnimalType).join(" | ")}`),
  
    pickupAddress: z
      .string()
      .min(5, "pickupAddress must be at least 5 characters")
      .max(255, "pickupAddress must be at most 255 characters"),
  
    photos: z.array(z.object({ photoUrl: z.string().url({ message: "photoUrl must be a valid URL" }) }))
  });