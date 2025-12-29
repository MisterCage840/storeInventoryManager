const { Router } = require("express")
const ingredientsRouter = Router()
const ingredientsController = require("../controllers/ingredientsController")
const requireDeletePassword = require("../middleware/requireDeletePassword")

ingredientsRouter.get("/new", ingredientsController.ingredientCreateGet)
ingredientsRouter.post("/", ingredientsController.ingredientCreatePost)

ingredientsRouter.get("/", ingredientsController.ingredientsListGet)

ingredientsRouter.get("/:id/edit", ingredientsController.ingredientUpdateGet)
ingredientsRouter.post("/:id/edit", ingredientsController.ingredientUpdatePost)

ingredientsRouter.post(
  "/:id/delete",
  requireDeletePassword,
  ingredientsController.ingredientDeletePost
)

ingredientsRouter.get("/:id", ingredientsController.ingredientByIdGet)

module.exports = ingredientsRouter
