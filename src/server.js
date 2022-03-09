import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import mustache from 'mustache-express'

import axios from 'axios'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())

//Set view engine
app.set("view engine", "mustache")
app.set("views", path.join(__dirname, "views"))
app.engine("mustache", mustache())

//Set public folder
app.use(express.static(path.join(__dirname, "../public")))

//Routes
app.get('/api', async (req, res) => {
  const response = await axios.get('https://system.solides.com/pt-BR/api/v1/profiler/19441', {
    headers: { Authorization: 'Token token=9e7545e473473c3274173cc77e39f2fe995d703a93d6d23539b8' }
  })
  console.log(response.data);
})

//404
app.use((req, res) => {
  res.render("pages/404")
})

//Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("\n" + "Server running" + "\n")
})
