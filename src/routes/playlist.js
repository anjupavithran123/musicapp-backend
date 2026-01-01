import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

/**
 * ✅ CREATE PLAYLIST
 */
router.post("/playlists", async (req, res) => {
  const { name, user_id } = req.body;

  if (!name || !user_id) {
    return res.status(400).json({ error: "name & user_id required" });
  }

  const { data, error } = await supabase
    .from("playlists")
    .insert([{ name, user_id }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  res.status(201).json(data);
});

/**
 * ✅ ADD TRACK TO PLAYLIST
 */
router.post("/playlists/:playlistId/tracks", async (req, res) => {
  const { playlistId } = req.params;
  const { track_id } = req.body;

  if (!track_id) {
    return res.status(400).json({ error: "track_id required" });
  }

  const { data, error } = await supabase
    .from("playlist_tracks")
    .insert([
      {
        playlist_id: playlistId,
        track_id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  res.status(201).json(data);
});

/**
 * ✅ GET ALL PLAYLISTS FOR USER  (THIS FIXES 404)
 * GET /api/playlists?user_id=xxx
 */
router.get("/playlists", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id required" });
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("id, name")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  res.json(data || []);
});
/*delete laylist*/
// routes/playlists.js
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json(error);
  }

  res.json({ success: true });
});


/**
 * ✅ GET SINGLE PLAYLIST WITH TRACKS
 * GET /api/playlists/:id
 */
router.get("/playlists/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("playlists")
    .select(`
      id,
      name,
      playlist_tracks (
        tracks (
          id,
          title,
          artist,
          duration
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  const playlist = {
    id: data.id,
    name: data.name,
    tracks: data.playlist_tracks.map(pt => pt.tracks),
  };

  res.json(playlist);
});

export default router;
