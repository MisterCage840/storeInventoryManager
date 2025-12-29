const db = require("../db/queries")

const links = [
  { href: "/ingredients", text: "Ingredients" },
  { href: "/ingredients/new", text: "New Ingredient" },
  { href: "/categories", text: "View Categories" },
]

exports.categoriesListGet = async (req, res) => {
  const categories = await db.getAllCategories()
  res.render("categories", { categories, links })
}

exports.categoryByIdGet = async (req, res) => {
  const category = await db.getCategoryById(req.params.id)
  if (!category) return res.status(404).send("Category not found")

  const ingredients = await db.getIngredientsByCategoryId(req.params.id)
  res.render("categoryDetails", { category, ingredients, links })
}
