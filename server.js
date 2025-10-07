const dotenv = require('dotenv');
const cors = require('cors');
const { app } = require('./app');
const passportConfig = require('./config/passport'); // This configures passport
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const PORT = process.env.PORT || 5000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in env");
  process.exit(1);
}

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize passport (configured in config/passport.js)
app.use(passportConfig.initialize());

// Routes
app.use(authRoutes); // Auth routes (no prefix)
app.use(orderRoutes); // Order routes (no prefix)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});