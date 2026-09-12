"use client";

import { useState } from 'react';
import RecipeRequestForm from "@/components/generate/RecipeRequestForm";
import { Recipe } from '@/lib/recipe-schema';
import type { GenerationRequest } from '@/lib/validation/generationRequestSchema';



export default function GeneratePage() {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGenerate(request: GenerationRequest) {
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("/api/recipes/generate-full", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });
    
            const data = await response.json();

            if (!response.ok) {
                setError(typeof data.error === "string" ? data.error : "Invalid request");
              } else {
                setRecipe(data);
              }
        } catch (err) {
            setError("Network error, please try again.");
        } finally {
            setIsLoading(false);
        }

        
    }

    return (
        <div>
            <RecipeRequestForm onSubmitRequest={handleGenerate} />
            {isLoading && <p>Generating...</p>}
            {error && <p>{error}</p>}
            {recipe && <pre>{JSON.stringify(recipe, null, 2)}</pre>}
        </div>
    );
}