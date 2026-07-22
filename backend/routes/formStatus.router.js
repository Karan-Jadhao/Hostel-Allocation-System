import express from "express";
import {
    getApplicationStatus,
    setApplicationStatus,
} from "../controllers/formStatus.controller.js";

const formStatusRouter = express.Router();

formStatusRouter.get("/", getApplicationStatus);
formStatusRouter.put("/", setApplicationStatus);

export default formStatusRouter;
