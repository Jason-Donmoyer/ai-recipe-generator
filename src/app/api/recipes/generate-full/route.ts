import { openai } from "@/lib/openai/client";
import { zodTextFormat } from "openai/helpers/zod";
import { RecipeSchema } from "@/lib/recipe-schema";
import { GenerationRequestSchema } from "@/lib/validation/generationRequestSchema";
import { RECIPE_INSTRUCTIONS, buildRecipeInput } from "@/lib/openai/recipePrompt";

export async function POST(request: Request) {
    let body: unknown;

    try {
        body = await request.json();
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    
    const result = GenerationRequestSchema.safeParse(body);
    if (!result.success) {
        return Response.json({ error: result.error.issues }, { status: 400 });
    }

    let response: Awaited<ReturnType<typeof openai.responses.parse>>;
    try {
        response = await openai.responses.parse({
            model: "gpt-5.6-terra",
            instructions: RECIPE_INSTRUCTIONS,
            input: buildRecipeInput(result.data),
            text: { format: zodTextFormat(RecipeSchema, "recipe") },
          });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Recipe generation failed" }, { status: 502 });
    }

    const fullResult = RecipeSchema.safeParse(response.output_parsed);
    if (!fullResult.success) {
        return Response.json({ error: "Recipe generation failed" }, { status: 502 });
    }

    return Response.json(fullResult.data);
    
}