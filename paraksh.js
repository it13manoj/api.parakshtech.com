require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { PORT = 4800 } = process.env;

// Import Sequelize database and all models
const {
  sequelize,
  User,
  Portfolio,
  Service,
  Job,
  Team,
  SiteContent,
} = require("./models");

// Import route modules
const authRoute = require("./routes/authRoutes");
const parakshRoute = require("./routes/parakshtechRoute");
const contactRoute = require("./routes/contactRoutes");
const portfolioRoute = require("./routes/portfolioRoutes");
const serviceRoute = require("./routes/serviceRoutes");
const jobRoute = require("./routes/jobRoutes");
const teamRoute = require("./routes/teamRoutes");
const siteContentRoute = require("./routes/siteContentRoutes");

// Permissive CORS for production domains + local dev environments
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = [
        "https://parakshtech.com",
        "https://www.parakshtech.com",
        "http://parakshtech.com",
        "http://www.parakshtech.com",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ];
      if (
        allowed.includes(origin) ||
        origin.endsWith("parakshtech.com") ||
        origin.endsWith("parakshtach.com") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Static file hosting for uploaded files
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------------------- ROUTES ------------------------
app.use("/api/v1", authRoute);
app.use("/api/v1", portfolioRoute);
app.use("/api/v1", serviceRoute);
app.use("/api/v1", jobRoute);
app.use("/api/v1", teamRoute);
app.use("/api/v1", contactRoute);
app.use("/api/v1", siteContentRoute);

// Legacy routes for backward compatibility
app.use("/api/v1", parakshRoute);

// Root health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    status: "online",
    message: "ParakshTech API is operating normally",
    timestamp: new Date().toISOString(),
  });
});

// Seed initial essential data if missing
async function seedInitialData() {
  try {
    // 1. Seed default admin user
    const adminCount = await User.count({ where: { role: "admin" } });
    if (adminCount === 0) {
      await User.create({
        name: "ParakshTech Administrator",
        email: "admin@parakshtech.com",
        password: "Admin@123",
        role: "admin",
      });
      console.log("Default admin created: admin@parakshtech.com / Admin@123");
    }

    // 2. Seed initial portfolio data if table is empty
    const portfolioCount = await Portfolio.count();
    if (portfolioCount === 0) {
      const initialProjects = [
        {
          title: "Enterprise Resource Management (ERP Suite)",
          sub_heading: "Cloud-Native ERP & Telemetry System",
          category: "webapp",
          description:
            "A complete enterprise-grade ERP platform engineered for multi-tier procurement, real-time inventory telemetry, role-based governance, and unified ledger reconciliation.",
          images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
          ],
          client: "Acuity Logistics Corp",
          year: "2024",
          industry: "Enterprise Logistics",
          platform: "Web Application / Cloud",
          status: "Live",
          tech: ["React 19", "Node.js", "PostgreSQL", "Docker", "AWS", "Redis"],
          features: [
            "Executive KPI analytics with sub-second WebSocket updates",
            "Granular role-based access control (RBAC) with immutable audit trail",
            "Automated vendor procurement pipelines with multi-tier approval workflows",
            "High-throughput RESTful & GraphQL microservices architecture",
          ],
          impact: "42% reduction in supply chain turnaround time",
          link: "https://demo.parakshtech.com/erp",
          order: 1,
        },
        {
          title: "Corporate Brand & Investor Relations Portal",
          sub_heading: "Ultra-Fast Headless Web Ecosystem",
          category: "website",
          description:
            "A pixel-perfect, SEO-optimized digital presence crafted for international capital markets, featuring live financial metrics, interactive ESG timelines, and headless dynamic content publishing.",
          images: [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
          ],
          client: "Vanguard Global Capital",
          year: "2024",
          industry: "Financial Services",
          platform: "Modern Web / CMS",
          status: "Live",
          tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Strapi CMS", "Vercel"],
          features: [
            "100/100 Google Lighthouse Core Web Vitals score",
            "Headless CMS integration with multi-lingual internationalization",
            "Interactive investor relations timeline and stock ticker widgets",
            "WCAG 2.1 AA accessibility compliance across all page layouts",
          ],
          impact: "3.2x faster page load and +140% organic search traffic",
          link: "https://demo.parakshtech.com/corp",
          order: 2,
        },
        {
          title: "PulseHealth Telemedicine & Wearable IoT",
          sub_heading: "HIPAA-Compliant Android & BLE App",
          category: "android",
          description:
            "A cross-platform mobile health ecosystem with low-latency WebRTC video consultations, continuous Bluetooth vitals telemetry, encrypted e-prescriptions, and offline sync.",
          images: [
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
          ],
          client: "BioSyn Health Systems",
          year: "2024",
          industry: "Healthcare & MedTech",
          platform: "Android (Kotlin / Compose)",
          status: "Live",
          tech: ["Kotlin", "Jetpack Compose", "WebRTC", "BLE 5.2", "Firebase", "Node.js"],
          features: [
            "Encrypted HD video consultation with real-time in-call vitals display",
            "Seamless Bluetooth Low Energy (BLE) pairing with smart pulse oximeters",
            "End-to-end encrypted e-prescriptions with pharmacy fulfillment",
            "Offline-first sync engine ensuring accessibility in remote clinics",
          ],
          impact: "Over 85,000 active remote consultations successfully conducted",
          link: "https://demo.parakshtech.com/pulsehealth",
          order: 3,
        },
        {
          title: "FinFlow Multi-Currency Payment Gateway",
          sub_heading: "High-Frequency Transaction Platform",
          category: "webapp",
          description:
            "A financial gateway infrastructure supporting instant multi-currency settlement, AI fraud scoring, automated compliance ledgering, and bank-grade cryptographic protocols.",
          images: [
            "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          ],
          client: "PayApex International",
          year: "2024",
          industry: "FinTech & Banking",
          platform: "Web Application / API",
          status: "Live",
          tech: ["React", "Python FastAPI", "PostgreSQL", "Kafka", "Stripe API", "AWS"],
          features: [
            "Sub-200ms transaction execution with automated FX hedging",
            "Machine learning fraud detection scoring with zero false-positives",
            "PCI-DSS Level 1 compliant tokenization and vault architecture",
            "Real-time webhook dispatcher supporting 10,000+ events per second",
          ],
          impact: "$14M+ monthly transaction volume processed safely",
          link: "https://demo.parakshtech.com/finflow",
          order: 4,
        },
        {
          title: "LuxeCart Global Omnichannel Store",
          sub_heading: "Headless E-Commerce & Retail Experience",
          category: "website",
          description:
            "A high-conversion headless e-commerce platform with AI visual recommendations, instant multi-country checkout, dynamic inventory sync across 45 physical stores, and 0.8s load times.",
          images: [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
          ],
          client: "Maison & Style Retail",
          year: "2023",
          industry: "E-Commerce & Retail",
          platform: "Headless E-Commerce",
          status: "Live",
          tech: ["Shopify Plus", "React", "GraphQL", "Algolia Search", "Tailwind CSS"],
          features: [
            "AI-driven visual search and personalized recommendation carousels",
            "Instant checkout integration with Apple Pay and Google Pay",
            "Dynamic inventory synchronization across 45 physical retail outlets",
            "Optimized 0.8s time-to-interactive for peak promotional traffic",
          ],
          impact: "+68% increase in mobile checkout conversion rate",
          link: "https://demo.parakshtech.com/luxecart",
          order: 5,
        },
        {
          title: "LogiTrack Smart Fleet Dispatcher",
          sub_heading: "Live GPS & Autonomous Telematics App",
          category: "android",
          description:
            "An enterprise heavy-vehicle logistics app offering turn-by-turn routing, live millimeter GPS telemetry over satellite & cellular, geofenced proof of delivery, and fuel burn diagnostics.",
          images: [
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80",
          ],
          client: "TransCargo Express",
          year: "2023",
          industry: "Transport & Logistics",
          platform: "Android (Flutter / Native SDKs)",
          status: "Live",
          tech: ["Flutter", "Dart", "Google Maps SDK", "WebSockets", "GoLang", "PostGIS"],
          features: [
            "Turn-by-turn truck-specific route planning avoiding low bridges",
            "Live millisecond GPS tracking over low-bandwidth cellular networks",
            "Automated geofencing with electronic proof of delivery (e-POD)",
            "Engine diagnostics telemetry monitoring fuel burn and idle times",
          ],
          impact: "Saved over 18,000 gallons of fuel in 6 months",
          link: "https://demo.parakshtech.com/logitrack",
          order: 6,
        },
      ];
      await Portfolio.bulkCreate(initialProjects);
      console.log(`Seeded ${initialProjects.length} initial portfolio projects!`);
    }
  } catch (err) {
    console.error("Data seed error:", err.message);
  }
}

// -------------------- SYSTEM MIGRATION & DIAGNOSTIC ENDPOINTS --------------------
const { authMiddleware } = require("./middleware/auth");
const { runAutoMigration, getTableDiagnostics } = require("./migrations/autoMigrate");

app.post("/api/v1/admin/system/migrate", authMiddleware, async (req, res) => {
  try {
    const report = await runAutoMigration();
    res.json({
      success: true,
      message: "Database auto-migration & table alteration executed successfully",
      report,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Migration failed", error: err.message });
  }
});

app.get("/api/v1/admin/system/schema-status", authMiddleware, async (req, res) => {
  try {
    const tables = await getTableDiagnostics();
    res.json({
      success: true,
      database: process.env.DB_NAME,
      tablesCount: tables.length,
      tables,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Diagnostic failed", error: err.message });
  }
});

// -------------------- SERVER INITIALIZATION ----------------------------
async function startServer() {
  try {
    // Run auto-migration: creates database if missing, creates & alters tables, seeds baseline data
    await runAutoMigration();

    http.createServer(app).listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`ParakshTech Unified API running on port ${PORT}`);
      console.log(`URL: http://localhost:${PORT}/api/v1`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error("Database initialization / migration failed:", err);
  }
}

startServer();

