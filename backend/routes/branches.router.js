import express from "express";
import { supabase } from "../utils/supabase.js";

const branchRouter = express.Router();

branchRouter.get("/:course", async (req, res) => {
  try {
    const { course } = req.params;

    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("Course", course);

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

export default branchRouter;