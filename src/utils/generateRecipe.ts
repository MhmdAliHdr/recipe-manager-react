import type {Recipe, Category} from "../types/recipe"

type RecipeData = Omit<Recipe, "id" | "createdAt" | "isAIGenerated">

export async function generateRecipe(prompt: string): Promise<RecipeData> {
    const res = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3.2",
            stream: false,
            messages: [
                {
                    role: "user",
                    content: `Generate a recipe for: ${prompt}

                Respond with ONLY valid JSON, no explanation:
                {
                    "title": "string",
                    "description": "string",
                    "category": "breakfast" | "lunch" | "dinner" | "dessert" | "snack",
                    "ingredients": ["string"],
                    "prepTime": number,
                    "cookTime": number,
                    "servings": number
                }`,
                }
            ]
        })
    })
    if (!res.ok) {
        throw new Error(`Ollama error ${res.status} - is Ollama running?`)
    }
    const data = await res.json()
    const text = data.message.content
    return JSON.parse(text)
}