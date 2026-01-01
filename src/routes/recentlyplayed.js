import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

// Update recently played (upsert)
router.post("/", async (req, res) => {
  const { user_id, track_id, last_position } = req.body;
  const { data, error } = await supabase
    .from("recently_played")
    .upsert(
      { user_id, track_id, last_position, last_played_at: new Date() },
      { onConflict: ["user_id", "track_id"] }
    );
  if (error) return res.status(400).json(error);
  res.json(data[0]);
});

// Get recently played
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from("recently_played")
    .select("track_id,last_position")
    .eq("user_id", user_id)
    .order("last_played_at", { ascending: false });
  if (error) return res.status(400).json(error);
  res.json(data);
});

export default router;
