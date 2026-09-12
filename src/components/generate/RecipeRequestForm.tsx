"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { 
    GenerationRequestSchema, 
    type GenerationRequest, 
} from "@/lib/validation/generationRequestSchema";

const RecipeRequestFormSchema = z.object({
    ingredientsRaw: z.string().trim().min(1, "Enter at least one ingredient"),
    cuisineOrFoodType: z.string().optional(),
    dietaryRestrictionsRaw: z.string().optional(),
    servings: z.number().int().min(1).max(20),
    maxTimeMinutes: z.number().int().positive().optional(),
    equipmentRaw: z.string().optional(),
    additionalPreferences: z.string().optional(),
});

type RecipeRequestFormValues = z.infer<typeof RecipeRequestFormSchema>;

type RecipeRequestFormProps = {
    onSubmitRequest: (request: GenerationRequest) => void;
};

// Helper function to split on comma
function splitCommaList(value: string): string[] {
    return value
        .split(",")
        .map((item) => item.replace(/\s+/g," ").trim())
        .filter(Boolean);
}

// Helper function to split on comma and return undefined when input is optional
function splitCommaListOrUndefined(
    value: string | undefined
): string[] | undefined {
    if (!value) return undefined;

    const items = splitCommaList(value);

    return items.length > 0 ? items : undefined;
}


// Helper function to convert empty strings to undefined
function emptyToUndefined(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
}

export default function RecipeRequestForm({ onSubmitRequest }: RecipeRequestFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RecipeRequestFormValues>({
        resolver: zodResolver(RecipeRequestFormSchema),
        defaultValues: {
            ingredientsRaw: "",
            cuisineOrFoodType: "",
            dietaryRestrictionsRaw: "",
            servings: 4,
            maxTimeMinutes: undefined,
            equipmentRaw: "",
            additionalPreferences: "",
        },
    });
    
    const onSubmit = (data: RecipeRequestFormValues) => {
        const request: GenerationRequest = {
            ingredients: splitCommaList(data.ingredientsRaw),
            cuisineOrFoodType: emptyToUndefined(data.cuisineOrFoodType ?? ""),
            dietaryRestrictions: splitCommaListOrUndefined(data.dietaryRestrictionsRaw),
            servings: data.servings,
            maxTimeMinutes: data.maxTimeMinutes,
            equipment: splitCommaListOrUndefined(data.equipmentRaw),
            additionalPreferences: emptyToUndefined(data.additionalPreferences ?? ""),
        };
    
        const result = GenerationRequestSchema.safeParse(request);
    
        if (!result.success) {
            console.error(result.error);
            return;
        }

        onSubmitRequest(result.data)
        // console.log(result.data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="ingredientsRaw">Ingredients (comma-separated)</label>
                <textarea
                    id="ingredientsRaw"
                    {...register("ingredientsRaw")}
                    placeholder="chicken, rice, broccoli"    
                />
                {errors.ingredientsRaw && (
                    <p role="alert">{errors.ingredientsRaw.message}</p>
                )}
            </div>
            <div>
                <label htmlFor="cuisineOrFoodType">Cuisine/Food Type</label>
                <input 
                    id="cuisineOrFoodType"
                    type="text"
                    {...register("cuisineOrFoodType")} 
                />
                {errors.cuisineOrFoodType && (
                    <p role="alert">{errors.cuisineOrFoodType.message}</p>
                )}
            </div>
            <div>
                <label htmlFor="dietaryRestrictionsRaw">Dietary Restrictions (comma-separated)</label>
                <input
                    id="dietaryRestrictionsRaw"
                    {...register("dietaryRestrictionsRaw")}
                    placeholder="gluten-free, lactose-intolerant"    
                />
                {errors.dietaryRestrictionsRaw && (
                    <p role="alert">{errors.dietaryRestrictionsRaw.message}</p>
                )}
            </div>
            <div>
                <label htmlFor="servings">Number of Servings</label>
                <input 
                    id="servings"
                    type="number" 
                    min={1}
                    max={20}
                    {...register("servings", { valueAsNumber: true })}
                />
                {errors.servings && (
                    <p role="alert">{errors.servings.message}</p>
                )}
            </div>
            <div>
                <label htmlFor="maxTimeMinutes">Maximum Total Time (minutes)</label>
                <input 
                    id="maxTimeMinutes"
                    type="number" 
                    min={1}
                    max={1440}
                    {...register("maxTimeMinutes", { 
                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                     })}
                />
                {errors.maxTimeMinutes && (
                    <p role="alert">{errors.maxTimeMinutes.message}</p>
                )}
            </div>
            <div>
                <label htmlFor="equipmentRaw">Equipment (comma-separated)</label>
                <input
                    id="equipmentRaw" 
                    {...register("equipmentRaw")}
                    placeholder="cast iron skillet, crock-pot"
                />
                {errors.equipmentRaw && (
                    <p role="alert">{errors.equipmentRaw.message}</p>
                )}
            </div>
            <div>
                <label htmlFor="additionalPreferences">Additional Notes</label>
                <textarea
                    id="additionalPreferences" 
                    {...register("additionalPreferences")}
                />
                {errors.additionalPreferences && (
                    <p role="alert">{errors.additionalPreferences.message}</p>
                )}
            </div>

            <button type="submit">Generate Recipe</button>
            
        </form>
    );
}





