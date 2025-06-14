import express from "express"
import { getCatalog, addCategorie, getIdCatalog, deleteCategorie } from "../Controllers/catalogController.js"

const router = express.Router()
router.get('/categories/:id', getIdCatalog)
router.delete('/categories/:id', deleteCategorie)
router.get('/categories', getCatalog)
router.post('/categories', addCategorie)

export default router;