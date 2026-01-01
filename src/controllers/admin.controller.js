import { supabase } from "../services/supabase.js";

export const uploadTrack = async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ message: "Audio file required" });
    }

    const fileName = `${Date.now()}-${audioFile.originalname}`;

    // Upload audio
    const { error: uploadError } = await supabase.storage
      .from("audio-files")
      .upload(fileName, audioFile.buffer, {
        contentType: audioFile.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage
      .from("audio-files")
      .getPublicUrl(fileName);

    // Insert metadata
    const { error: dbError } = await supabase.from("tracks").insert({
      title,
      artist,
      album,
      genre,
      duration,
      audio_url: publicUrl.publicUrl,
      created_by: req.userId,
    });

    if (dbError) throw dbError;

    res.json({ message: "Track uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
