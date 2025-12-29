const express = require("express")
const path = require("path")
const indexRouter = require("./routes/indexRouter")
const ingredientsRouter = require("./routes/ingredientsRouter")
const categoriesRouter = require("./routes/categoriesRouter")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use("/", indexRouter)

app.use("/ingredients", ingredientsRouter)

app.use("/categories", categoriesRouter)

// 404
app.use((req, res) => {
  res.status(404).send("404 Not Found")
})

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR STACK:")
  console.error(err)
  res.status(500).send(`<pre>${err.stack}</pre>`)
})

app.listen(PORT, (error) => {
  if (error) {
    throw error
  }
  console.log(`App is listening on port ${PORT}`)
})
