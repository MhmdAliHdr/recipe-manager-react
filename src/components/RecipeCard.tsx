import type { Recipe } from "../types/recipe"
interface RecipeCardProps{
    recipe: Recipe
    onDelete: (id: string) => void
}

function RecipeCard({recipe, onDelete}: RecipeCardProps) {
    return (
        <div>
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>
            <p>Category: {recipe.category}</p>
            <p>Prep: {recipe.prepTime} min | Cook: {recipe.cookTime} min | Serves: {recipe.servings}</p>
            <ul>
                {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                ))}
            </ul>
            <button onClick={() => onDelete(recipe.id)}>Delete</button>
        </div>
    )
}
export default RecipeCard