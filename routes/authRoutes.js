const express = require('express');
const passport = require('../config/passport');
const supabaseAdmin = require('../config/supabase'); // adjust path

const router = express.Router();

const isProd = process.env.NODE_ENV === 'production';

const cookieOption = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: '/',
  // Add domain if needed for subdomains, e.g., domain: '.ms-logistic.in'
};

// Signup routes >>>
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    // Removed invalid getUser({email})—Supabase signUp handles duplicates
    const { data, error } = await supabaseAdmin.auth.signUp({ email, password });

    if (error) {
      // Check for duplicate user error specifically
      if (error.message.includes('already registered')) {
        return res.status(400).json({ message: "User already exists" });
      }
      return res.status(400).json({ error: error.message });
    }

    // Handle response
    if (data.session) {
      const accessToken = data.session.access_token;
      const refreshToken = data.session.refresh_token;
      const expiresIn = data.session.expires_in ?? 900;

      res.cookie("sb_access_token", accessToken, {
        ...cookieOption,
        maxAge: expiresIn * 1000,
      });
      res.cookie("sb_refresh_token", refreshToken, {
        ...cookieOption,
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });

      return res.json({ message: "Signup successful", user: data.user });
    }

    return res.status(200).json({
      status: "ok",
      message: "Signup successful — check your email for confirmation.",
      data,
    });
  } catch (err) {
    console.error("Unexpected error during signup:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login Routes >>>>>
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  const accessToken = data.session?.access_token;
  const refreshToken = data.session?.refresh_token;
  const expiresIn = data.session?.expires_in ?? 900;

  if (!accessToken || !refreshToken) return res.status(500).json({ error: "No tokens returned" });

  res.cookie("sb_access_token", accessToken, { ...cookieOption, maxAge: expiresIn * 1000 });
  res.cookie("sb_refresh_token", refreshToken, { ...cookieOption, maxAge: 15 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Login successful", user: data.user });
});

// Refresh Token Routes >>>
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.sb_refresh_token;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token: refreshToken });
  if (error) return res.status(401).json({ error: error.message });

  const newAccessToken = data.session?.access_token;
  const newRefreshToken = data.session?.refresh_token;
  const expiresIn = data.session?.expires_in ?? 900;

  if (!newAccessToken) return res.status(500).json({ error: "No access token returned" });

  res.cookie("sb_access_token", newAccessToken, { ...cookieOption, maxAge: expiresIn * 1000 });
  if (newRefreshToken) {
    res.cookie("sb_refresh_token", newRefreshToken, { ...cookieOption, maxAge: 15 * 24 * 60 * 60 * 1000 });
  }
  res.json({ message: "Token refreshed", user: data.user });
});

// Profile Routes >>>
router.get("/profile", require('../middleware/auth'), (req, res) => {
  res.json({ user: req.user });
});

// Login With Google Routes >>>
router.get("/auth/google", passport.authenticate("google", {
  scope: ["openid", "profile", "email"],
  accessType: "offline",
  prompt: "consent"
}));

router.get("/auth/google/callback", passport.authenticate("google", { 
  failureRedirect: `${process.env.FRONTEND_URL || 'https://ms-logistic.in'}/login?error=auth_failed` 
}), async (req, res) => {
  try {
    if (!req.user?.idToken) {
      console.error("No idToken from Google");
      return res.redirect(`${process.env.FRONTEND_URL || 'https://ms-logistic.in'}/login?error=no_token`);
    }

    const { data, error } = await supabaseAdmin.auth.signInWithIdToken({
      provider: "google",
      token: req.user.idToken,
    });

    if (error) {
      console.error("Supabase Google signin error:", error);
      return res.redirect(`${process.env.FRONTEND_URL || 'https://ms-logistic.in'}/login?error=auth_failed`);
    }

    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;
    const expiresIn = data.session?.expires_in ?? 900;

    if (!accessToken || !refreshToken) {
      console.error("No tokens from Supabase");
      return res.redirect(`${process.env.FRONTEND_URL || 'https://ms-logistic.in'}/login?error=no_tokens`);
    }

    res.cookie("sb_access_token", accessToken, { ...cookieOption, maxAge: expiresIn * 1000 });
    res.cookie("sb_refresh_token", refreshToken, { ...cookieOption, maxAge: 15 * 24 * 60 * 60 * 1000 });

    const redirectTo = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/callback` : 'https://ms-logistic.in/callback';
    res.redirect(redirectTo);
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect(`${process.env.FRONTEND_URL || 'https://ms-logistic.in'}/login?error=server_error`);
  }
});

// Logout Routes >>>
router.post("/logout", (req, res) => {
  res.clearCookie("sb_access_token", cookieOption);
  res.clearCookie("sb_refresh_token", cookieOption);
  res.json({ message: "Logged out" });
});

// Home Routes >>>
router.get("/", (req, res) => {
  res.send("Welcome user");
});

module.exports = router;