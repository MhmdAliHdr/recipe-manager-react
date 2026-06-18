import { useState, useEffect } from "react"
import type { Recipe, Category } from "./types/recipe"
import RecipeCard from "./components/RecipeCard"
import { loadRecipes, saveRecipes } from "./utils/localStorage"
import { generateRecipe } from "./utils/generateRecipe"

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadRecipes())
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Category>("dinner")
  const [ingredients, setIngredients] = useState("")
  const [prepTime, setPrepTime] = useState(10)
  const [cookTime, setCookTime] = useState(20)
  const [servings, setServings] = useState(2)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all")

  useEffect(() => {
    saveRecipes(recipes)
  }, [recipes])

  async function handleGenerate(){
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiError(null)
    try {
      const data = await generateRecipe(aiPrompt)
      setTitle(data.title)
      setDescription(data.description)
      setCategory(data.category as Category)
      setIngredients(data.ingredients.join(", "))
      setPrepTime(data.prepTime)
      setCookTime(data.cookTime)
      setServings(data.servings)
      setAiPrompt("")
    } catch(e) {
      setAiError(e instanceof Error ? e.message : "Failed to generate recipe")
    }
    finally {
      setAiLoading(false)
    }
  }
  function handleAdd(){
    if(!title.trim()) return
    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      ingredients: ingredients.split(",").map(i =>
        i.trim()).filter(Boolean),
        prepTime,
        cookTime,
        servings,
        isAIGenerated: false,
        createdAt: new Date().toISOString(),
      }
    setRecipes([...recipes, newRecipe])
    setTitle("")
    setDescription("")
    setCategory("dinner")
    setIngredients("")
    setPrepTime(10)
    setCookTime(20)
    setServings(2)
  }
  function handleDelete(id: string){
    setRecipes(recipes.filter(recipe => recipe.id !== id))
  }
  const displayed = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === "all" || recipe.category === filterCategory
    return matchesSearch && matchesCategory
  })
  return (
    <div className="text-center grid grid-cols-4 w-100000">
    <div>
      <h1 className="text-regal-blue">Recipe Manager</h1>
      <div className="w-50 col-span-2">
      <div className="w-20 col-span-1">
        <input
        value = {aiPrompt}
        onChange = {e => setAiPrompt(e.target.value)}
        placeholder = "Describe a recipe to generate with AI"
        />
        <button onClick={handleGenerate} disabled={aiLoading}>
          {aiLoading ? "Generating...": "Generate with AI"}
        </button>
        {aiError && <p style = {{color: "red"}}>{aiError}</p>}
      </div>
      <div className="w-20">
      <input
      value = {search}
      onChange = {e => setSearch(e.target.value)}
      placeholder = "Search recipes..."
      />
      <select value = {filterCategory} onChange = {e => setFilterCategory(e.target.value as Category | "all")}>
        <option value="all">All Categories</option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="dessert">Dessert</option>
        <option value="snack">Snack</option>
      </select>
    </div>
    </div>
      <div>
        <input
          className = "font-medium"
          value = {title}
          onChange={e => setTitle(e.target.value)}
          placeholder = "Title"
          />
        <input
          value = {description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          />
          <select value={category} onChange={e =>
            setCategory(e.target.value as Category)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
            <option value="snack">Snack</option>
          </select>
          <input className="mt-2" value = {ingredients} onChange={e => setIngredients(e.target.value)} placeholder = "Ingredients (comma separated)"/>
          <input type = "number" value = {prepTime} onChange={e => setPrepTime(Number(e.target.value))} placeholder= "Prep time (min)"/>
          <input type = "number" value = {cookTime} onChange={e => setCookTime(Number(e.target.value))} placeholder="Cook time (min)"/>
          <input type = "number" value = {servings} onChange={e => setServings(Number(e.target.value))} placeholder = "Servings" />
          <button onClick={handleAdd}>Add recipe</button>
      </div>
      {displayed.map(recipe => (
        <RecipeCard key = {recipe.id} recipe = {recipe} onDelete = {handleDelete}/>
      ))}
    </div>
    </div>
  )
}

export default App