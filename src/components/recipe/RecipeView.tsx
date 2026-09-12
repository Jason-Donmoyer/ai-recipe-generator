import { Recipe, IngredientQuantity } from '@/lib/recipe-schema';


function formatQuantity(quantity: IngredientQuantity): string {
    switch (quantity.type) {
        case "exact":
            return `${quantity.value}`;
        case "range":
            return `${quantity.min} - ${quantity.max}`;
        case "descriptive":
            return `${quantity.text}`;
    }
}

export default function RecipeView({ recipe }: { recipe: Recipe }) {
    return (
        <article>
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>

            <dl>
                <dt>Servings</dt>
                <dd>{recipe.servings}</dd>

                <dt>Prep Time</dt>
                <dd>{recipe.prepTimeMinutes} min</dd>

                <dt>Cook Time</dt>
                <dd>{recipe.cookTimeMinutes} min</dd>

                <dt>Total Time</dt>
                <dd>{recipe.totalTimeMinutes} min</dd>

                <dt>Difficulty</dt>
                <dd>{recipe.difficulty}</dd>
            </dl>

            <h2>Equipment</h2>
            <ul>
                {recipe.equipment.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>

            <h2>Ingredients</h2>
            <ul>
                {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.name}>
                        {formatQuantity(ingredient.quantity)}
                        {ingredient.unit && ` ${ingredient.unit}`}
                        {" "}{ingredient.name}
                        {ingredient.preparation && `, ${ingredient.preparation}`}
                    </li>
                ))}
            </ul>

            <h2>Instructions</h2>
            <ul>
                {recipe.instructions.map((step) => (
                    <li key={step.step}>
                        {step.step}. {step.text}
                        {step.durationMinutes && ` ${step.durationMinutes}`}
                    </li>
                ))}
            </ul>

            <h2>Substitutions</h2>
            <ul>
                {recipe.substitutions.map((sub, index) => (
                    <li key={index}>
                        {sub.originalIngredient} - {sub.substitute}. 
                        {sub.notes && ` ${sub.notes}`}
                    </li>
                ))}
            </ul>

            <h2>Notes</h2>
            <ul>
                {recipe.notes.map((note) => (
                    <li key={note}>{note}</li>
                ))}
            </ul>

            <h2>Tags</h2>
            <ul>
                {recipe.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                ))}
            </ul>
        </article>
    )
}