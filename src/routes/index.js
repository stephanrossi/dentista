import { Router } from 'express'
import * as CpfController from '../controllers/cpfController.js'

const router = Router()

router.get('/', (req, res) => {
    res.render("pages/index")
})

router.post('/', CpfController.checkCpf)

export default router