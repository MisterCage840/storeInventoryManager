const pool = require("./pool")

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories")
  return rows
}

async function getCategoryById(categoryId) {
  const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [
    categoryId,
  ])
  return rows[0]
}

async function getAllIngredients() {
  const { rows } = await pool.query(
    "SELECT i.id,i.name,i.qty,i.unit,i.min_stock,i.category_id,c.name AS category_name FROM public.ingredients i JOIN public.categories c ON c.id = i.category_id ORDER BY i.name;"
  )
  return rows
}

async function getIngredientById(ingredientId) {
  const { rows } = await pool.query("SELECT * FROM ingredients WHERE id = $1", [
    ingredientId,
  ])
  return rows[0]
}

async function deleteIngredient(ingredientId) {
  await pool.query("DELETE FROM ingredients WHERE id = $1", [ingredientId])
}

async function updateIngredient(
  ingredientId,
  name,
  qty,
  unit,
  minStock,
  categoryId
) {
  const { rows } = await pool.query(
    `
    UPDATE ingredients
    SET
      name = $1,
      qty = $2,
      unit = $3,
      min_stock = $4,
      category_id = $5
    WHERE id = $6
    RETURNING *
    `,
    [name, qty, unit, minStock, categoryId, ingredientId]
  )

  return rows[0]
}

async function addIngredient(name, qty, unit, min_stock, category_id) {
  await pool.query(
    "INSERT INTO messages (name, qty, unit, min_stock, category_id) VALUES ($1,$2,$3,$4,$5)",
    [name, qty, unit, min_stock, category_id]
  )
}

async function getIngredientsByCategoryId(categoryId) {
  const { rows } = await pool.query(
    `SELECT id, name, qty, unit, min_stock, category_id
     FROM ingredients
     WHERE category_id = $1
     ORDER BY name`,
    [categoryId]
  )
  return rows
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getAllIngredients,
  getIngredientById,
  deleteIngredient,
  updateIngredient,
  addIngredient,
  getIngredientsByCategoryId,
}
