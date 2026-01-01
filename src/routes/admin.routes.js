import express from "express";
import multer from "multer";
import { uploadTrack } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer(); // memory storage

router.post("/upload-track", requireAdmin, upload.single("audio"), uploadTrack);

export default router;
