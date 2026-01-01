import 'dotenv/config';
import express from "express";
import cors from "cors";

import tracksRoutes from "./src/routes/tracks.routes.js";
import podcastsRoutes from "./src/routes/podcasts.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import playlistsRoutes from "./src/routes/playlist.js";
import recentlyPlayedRoutes from "./src/routes/recentlyplayed.js";
import searchRoutes from "./src/routes/search.js"
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/tracks", tracksRoutes);
app.use("/podcasts", podcastsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", playlistsRoutes);
app.use("/recently-played", recentlyPlayedRoutes); // Recently Played APIs
app.use("/api", searchRoutes);
// Test route
app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
