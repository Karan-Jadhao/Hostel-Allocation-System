import express from "express"
import { uploadSeatMatrix, displaySeatMatrix, removeSeatMatrix } from "../controllers/seatMatrix.controller.js"

const seatMatrixRouter = express.Router()

seatMatrixRouter.post("/", uploadSeatMatrix)
seatMatrixRouter.get("/", displaySeatMatrix)
seatMatrixRouter.delete("/", removeSeatMatrix)

export default seatMatrixRouter