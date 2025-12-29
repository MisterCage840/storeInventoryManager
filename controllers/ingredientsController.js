const db = require("../db/queries")

const links = [
  { href: "/", text: "Home" },
  { href: "/ingredients/new", text: "New Ingredient" },
  { href: "/categories", text: "View Categories" },
]

exports.ingredientsListGet = async (req, res) => {
  const ingredients = await db.getAllIngredients()
  res.render("index", { ingredients, links })
}

exports.ingredientByIdGet = async (req, res) => {
  const ingredient = await db.getIngredientById(req.params.id)
  if (!ingredient) return res.status(404).send("Ingredient not found")
  res.render("ingredientDetails", { ingredient, links })
}

exports.ingredientCreateGet = async (req, res) => {
  const categories = await db.getAllCategories()
  res.render("newIngredient", { links, categories })
}

exports.ingredientCreatePost = async (req, res) => {
  const { name, qty, unit, minStock, categoryId } = req.body

  if (!name || !qty || !unit || !minStock || !categoryId) {
    return res.redirect("/ingredients/new")
  }

  await db.addIngredient(name, qty, unit, minStock, categoryId)
  res.redirect("/ingredients")
}

exports.ingredientUpdateGet = async (req, res) => {
  const ingredient = await db.getIngredientById(req.params.id)
  if (!ingredient) return res.status(404).send("Ingredient not found")

  const categories = await db.getAllCategories()
  res.render("editIngredient", { ingredient, categories, links })
}

exports.ingredientUpdatePost = async (req, res) => {
  const ingredientId = req.params.id
  const { name, qty, unit, minStock, categoryId } = req.body

  if (!name || !qty || !unit || !minStock || !categoryId) {
    return res.redirect(`/ingredients/${ingredientId}/edit`)
  }

  await db.updateIngredient(ingredientId, name, qty, unit, minStock, categoryId)
  res.redirect(`/ingredients/${ingredientId}`)
}

exports.ingredientDeletePost = async (req, res) => {
  const ingredientId = req.params.id
  await db.deleteIngredient(ingredientId)
  res.redirect("/ingredients")
}
