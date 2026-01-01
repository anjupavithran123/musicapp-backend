import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

// GET /search?query=abc&type=track|podcast
router.get("/search", async (req, res) => {
  const { query, type } = req.query;

  if (!query) return res.json([]);

  try {
    let table = type === "podcast" ? "podcasts" : "tracks";

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .ilike("title", `%${query}%`);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
