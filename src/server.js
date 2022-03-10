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

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf == '') return false;
  // Elimina CPFs invalidos conhecidos	
  if (cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999")
    return false;
  // Valida 1o digito	
  let add = 0;
  for (let i = 0; i < 9; i++)
    add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
    rev = 0;
  if (rev != parseInt(cpf.charAt(9)))
    return false;
  // Valida 2o digito	
  add = 0;
  for (let i = 0; i < 10; i++)
    add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
    rev = 0;
  if (rev != parseInt(cpf.charAt(10)))
    return false;
  return true;
}

app.post('/api', async (req, res) => {
  const rawCpf = req.body.cpf

  const cpf = String(rawCpf.replace(/\D/g, ''))

  const checkCpf = validarCPF(cpf)

  if (!checkCpf) {
    res.send('CPF inválido!')
  } else {
    try {
      const { data } = await axios.get(`https://system.solides.com/pt-BR/api/v1/colaboradores/existe/${cpf}`, {
        headers: { Authorization: 'Token token=9e7545e473473c3274173cc77e39f2fe995d703a93d6d23539b8' }
      })

      if (data.status === 1) {
        res.send('Funcionário ativo.')
      } else {
        res.send('Registro não encontrado.')
      }
    }
    catch (e) {
      res.send(e.response.data.messages);
    }
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
