export interface Recipe {
    id: string
    title: string
    description: string
    category: Category
    ingredients: string[]
    prepTime: number
    cookTime: number
    servings: number
    isAIGenerated: boolean
    createdAt: string
}
export type Category = "breakfast" | "lunch" | "dinner" | "dessert" | "snack"