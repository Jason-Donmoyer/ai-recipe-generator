import { z } from "zod";

export const GenerationRequestSchema = z.object({
    ingredients: z.array(z.string().trim().min(1)).min(1),
    cuisineOrFoodType: z.string().trim().min(1).optional(),
    dietaryRestrictions: z.array(z.string().trim().min(1)).optional(), 
    servings: z.number().int().min(1).max(20),
    maxTimeMinutes: z.number().int().min(1).max(1440).optional(),
    equipment: z.array(z.string().trim().min(1)).optional(),
    additionalPreferences: z.string().trim().min(1).optional(), 
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;