import express from "express";
import dotenv from "dotenv";
import { supabase } from "./utils/supabase.js";

dotenv.config();

const { error } = await supabase
  .from("test")
  .select("*")
  .limit(1);

if (error) {
  console.log("❌ Database Not Connected");
} else {
  console.log("✅ Database Connected");
}


const app = express();
const PORT = process.env.PORT || 5000;