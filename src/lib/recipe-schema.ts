import { z } from "zod";

export const ExactQuantitySchema = z.object({
    type: z.literal("exact"),
    value: z.number().positive(),
});

export const RangeQuantitySchema = z.object({
    type: z.literal("range"),
    min: z.number().positive(),
    max: z.number().positive(),
});

export const DescriptiveQuantitySchema = z.object({
    type: z.literal("descriptive"),
    text: z.string().trim().min(1), // "to taste", "as needed"
});

export const IngredientQuantitySchema = z.discriminatedUnion("type", [
    ExactQuantitySchema,
    RangeQuantitySchema,
    DescriptiveQuantitySchema,
]);

export type IngredientQuantity = z.infer<typeof IngredientQuantitySchema>;

export const IngredientSchema = z.object({
    name: z.string().trim().min(1),
    quantity: IngredientQuantitySchema,
    unit: z.string().nullable(), // null for "2 eggs" - unitless count
    preparation: z.string().nullable() // "finely chopped"
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const InstructionStepSchema = z.object({
    step: z.number().int().positive(),
    text: z.string().trim().min(1),
    durationMinutes: z.number().int().nonnegative().nullable(),
});

export const SubstitutionSchema = z.object({
    originalIngredient: z.string().trim().min(1),
    substitute: z.string().trim().min(1),
    notes: z.string().nullable(),
});

export const RecipeSchema = z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    servings: z.number().int().positive(),
    prepTimeMinutes: z.number().int().nonnegative(),
    cookTimeMinutes: z.number().int().nonnegative(),
    totalTimeMinutes: z.number().int().nonnegative(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    equipment: z.array(z.string()),
    ingredients: z.array(IngredientSchema),
    instructions: z.array(InstructionStepSchema),
    substitutions: z.array(SubstitutionSchema),
    notes: z.array(z.string()),
    tags: z.array(z.string()),
});

export type Recipe = z.infer<typeof RecipeSchema>;