import express from "express"
import { getCatalog, addCategorie, getIdCatalog, putCategorie, deleteCategorie } from "../Controllers/catalogController.js"

const router = express.Router()
router.get('/:id', getIdCatalog)
router.delete('/:id', deleteCategorie)
router.put('/:id', putCategorie)
router.get('/', getCatalog)
router.post('/', addCategorie)

export default router;