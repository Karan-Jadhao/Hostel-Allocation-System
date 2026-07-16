import express from "express";
import cors from "cors"
import branchRouter from "./routes/branches.router.js";
import categoryRouter from "./routes/category.router.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(express.json());
app.use("/api/branches", branchRouter);
app.use("/api", categoryRouter);

export default app;