import express from "express";
import dotenv from "dotenv";
import { supabase } from "./utils/supabase.js";
import app from "./app.js";

dotenv.config();

const { error } = await supabase
  .from("test")
  .select("*")
  .limit(1);

if (error) {
  console.log("Database Not Connected");
} else {
  console.log("Database Connected");
}
app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});