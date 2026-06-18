import type { Recipe } from "../types/recipe"

const STORAGE_KEY = "recipe-manager-recipes"

export function loadRecipes(): Recipe[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function saveRecipes(recipes: Recipe[]): void {
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
    }
    catch(e) {
        console.error("Failed to save recipes:", e)
    }
}