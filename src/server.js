import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import mustache from 'mustache-express'
import bodyParser from 'body-parser'
import routes from './routes/index.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

//Set view engine
app.set("view engine", "mst")
app.set("views", path.join(__dirname, "views"))
app.engine("mst", mustache())

//Set public folder
app.use(express.static(path.join(__dirname, "../public")))

//Routes
app.use(routes)

//404
app.use((req, res) => {
  res.render("pages/404")
})

//Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("\n" + "Server running" + "\n")
})
