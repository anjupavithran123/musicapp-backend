import express from "express";
import { getTracks } from "../controllers/tracks.controller.js";

const router = express.Router();

router.get("/", getTracks);

export default router;
