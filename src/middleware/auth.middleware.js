import { supabase } from "../services/supabase.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const { data: userData, error } = await supabase.auth.getUser(token);

    if (error || !userData?.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = userData.user.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (!profile?.is_admin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.userId = userId;
    next();
  } catch (err) {
    res.status(500).json({ message: "Auth error" });
  }
};
