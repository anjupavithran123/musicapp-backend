import express from "express";
import {
  getPodcasts,
  getEpisodesByPodcast,
} from "../controllers/podcasts.controller.js";

const router = express.Router();

router.get("/", getPodcasts);
router.get("/:podcastId/episodes", getEpisodesByPodcast);

export default router;
