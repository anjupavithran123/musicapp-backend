import { supabase } from "../services/supabase.js";

// GET /podcasts
export const getPodcasts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("podcasts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /podcasts/:podcastId/episodes
export const getEpisodesByPodcast = async (req, res) => {
  try {
    const { podcastId } = req.params;

    const { data, error } = await supabase
      .from("podcast_episodes")
      .select("*")
      .eq("podcast_id", podcastId)
      .order("published_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
