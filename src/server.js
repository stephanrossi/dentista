import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import mustache from 'mustache-express'
import bodyParser from 'body-parser'

import axios from 'axios'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))


//Set view engine
app.set("view engine", "mustache")
app.set("views", path.join(__dirname, "views"))
app.engine("mustache", mustache())

//Set public folder
app.use(express.static(path.join(__dirname, "../public")))

app.use(express.json())

//Routes
app.get('/', (req, res) => {
  res.render("pages/index")
})

app.post('/api', async (req, res) => {
  const cpf = req.body.cpf

  try {
    await axios.get(`https://system.solides.com/pt-BR/api/v1/colaboradores/existe/${cpf}`, {
      headers: { Authorization: 'Token token=9e7545e473473c3274173cc77e39f2fe995d703a93d6d23539b8' }
    })
    res.send('Funcionário ativo.')
  }
  catch (e) {
    res.send(e.response.data.messages);
  }
})

//404
app.use((req, res) => {
  res.render("pages/404")
})

//Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("\n" + "Server running" + "\n")
})
