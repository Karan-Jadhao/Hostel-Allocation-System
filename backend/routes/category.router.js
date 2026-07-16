import express from "express"
import { supabase } from "../utils/supabase.js";

const categoryRouter = express.Router();

categoryRouter.get("/category", async (req, res) => {
    try {
        const { data, error } = await supabase
                                      .from("categories")
                                      .select("*")
        if(error) {
            return res.status(500).json({
                error : error.message
            })
        }
        return res.status(200).json(data);
    } catch (error) {
         return res.status(500).json({
      error: err.message,
    });
    }
});

export default categoryRouter;