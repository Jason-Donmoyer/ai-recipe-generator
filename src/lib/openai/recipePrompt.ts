import type { GenerationRequest } from "@/lib/validation/generationRequestSchema";

// Stable, request-independent guidance for the model.
// This describes HOW to think about the schema, not what the user asked for.
export const RECIPE_INSTRUCTIONS = `
You are a recipe generation assistant. Given a set of ingredients and
preferences, generate one complete, realistic recipe.

- Use "exact" whenever a measurable numeric quantity applies, including count-based
  units such as eggs, cloves, cans, pieces, pinches, and dashes.
- Use "range" when a natural numeric range applies (e.g. 2-3 cloves garlic).
- Use "descriptive" only for genuinely non-numeric amounts such as "to taste",
  "as needed", "for garnish", or "for serving".

Difficulty levels:
- "easy": straightforward techniques, common equipment, minimal coordination,
  and suitable for a beginner home cook.
- "medium": multiple components or steps, moderate timing/coordination, or
  techniques requiring some cooking experience.
- "hard": advanced techniques, specialized equipment, precise timing,
  multiple coordinated components, or substantial hands-on work.

Ingredient count alone should not determine difficulty.

Treat the user's supplied ingredients as the primary ingredients available.
You may add reasonable common pantry staples when necessary to produce a
complete recipe. Do not assume the user has uncommon or specialty ingredients
unless they provided them. Do not add unnecessary ingredients merely to make
the recipe more elaborate.

If the user provides an ingredient without a quantity or weight, infer a reasonable
quantity based on the requested number of servings and the needs of the recipe.

The recipe must be realistic and internally consistent.

Cooking times, temperatures, quantities, equipment, and instructions should
agree with one another.

Instructions should be specific enough for a home cook to follow without
requiring information that is missing from the recipe.

Honor the user's requested servings, time limit, dietary restrictions,
available equipment, cuisine/food type, and additional preferences.
`.trim();

// Builds the request-specific input string from a validated GenerationRequest.
export function buildRecipeInput(request: GenerationRequest): string {
  const lines: string[] = [];

  // Required fields — always present.
  lines.push(`Ingredients available: ${request.ingredients.join(", ")}.`);
  lines.push(`Servings needed: ${request.servings}.`);

  if (request.cuisineOrFoodType) {
    lines.push(`Cuisine or food type: ${request.cuisineOrFoodType}.`);
  }

  if (request.dietaryRestrictions) {
    lines.push(`Dietary restrictions: ${request.dietaryRestrictions.join(", ")}.`);
  }

  if (request.maxTimeMinutes) {
    lines.push(`Recipe must be able to be completed in ${request.maxTimeMinutes} minutes or less.`);
  }
 
  if (request.equipment) {
    lines.push(`Equipment available: ${request.equipment.join(", ")}.`);
  }

  if (request.additionalPreferences) {
    lines.push(`Notes and further instructions: ${request.additionalPreferences}.`);
  }

  return lines.join("\n");
}