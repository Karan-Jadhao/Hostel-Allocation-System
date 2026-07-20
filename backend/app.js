import express from "express";
import cors from "cors"
import branchRouter from "./routes/branches.router.js";
import categoryRouter from "./routes/category.router.js";
import formRouter from "./routes/form.router.js";
import allocationRouter from "./routes/allocat.router.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}))

app.use(express.json());
app.use("/api/branches", branchRouter);
app.use("/api", categoryRouter);
app.use("/api/form", formRouter);
app.use("/api/allocation", allocationRouter);

export default app;
