/**
 * Auto-Migration & Schema Synchronizer for Paraksh Technologies
 *
 * Capabilities:
 * 1. Database Provisioning: Ensures MySQL database exists (CREATE DATABASE IF NOT EXISTS).
 * 2. Schema Auto-Create: Automatically creates all missing tables as defined by Sequelize models.
 * 3. Schema Auto-Alter: Automatically modifies/adds any newly declared columns to existing tables (ALTER TABLE).
 * 4. Column Verification: Verifies table structures against INFORMATION_SCHEMA.
 * 5. Default Seeding: Seeds admin user, portfolio projects, services, jobs, team, and site content.
 * 6. Dual-Mode Execution: Run via CLI (`npm run migrate`) or programmatically on server boot.
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mysql = require("mysql2/promise");
const {
  sequelize,
  User,
  Portfolio,
  Service,
  Job,
  Team,
  ContactInquiry,
  SiteContent,
  Testimonial,
  Home,
} = require("../models");

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "parakshtech_db",
  port: Number(process.env.DB_PORT) || 3306,
};

/**
 * Step 1: Ensure database exists in MySQL
 */
async function ensureDatabaseExists() {
  console.log(`[AutoMigrate] Checking MySQL database: "${DB_CONFIG.database}" on ${DB_CONFIG.host}...`);
  try {
    const connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      port: DB_CONFIG.port,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();
    console.log(`[AutoMigrate] Database "${DB_CONFIG.database}" is ready.`);
  } catch (err) {
    console.warn(`[AutoMigrate] Note on database pre-check: ${err.message}`);
  }
}

/**
 * Step 2: Auto-Create and Auto-Alter all tables
 */
async function syncAndAlterTables() {
  console.log("[AutoMigrate] Running sequelize.sync({ alter: true })...");
  await sequelize.authenticate();
  console.log("[AutoMigrate] Database connection verified successfully.");

  // sync({ alter: true }) automatically checks all tables, creates missing tables,
  // and executes ALTER TABLE for any new or modified model columns.
  await sequelize.sync({ alter: true });
  console.log("[AutoMigrate] All tables successfully synchronized and altered as required!");
}

/**
 * Step 3: Get detailed summary of existing tables and column counts
 */
async function getTableDiagnostics() {
  const [tables] = await sequelize.query("SHOW TABLES;");
  const tableKey = `Tables_in_${DB_CONFIG.database}`;
  const report = [];

  for (const row of tables) {
    const tableName = row[tableKey] || Object.values(row)[0];
    const [columns] = await sequelize.query(`SHOW COLUMNS FROM \`${tableName}\`;`);
    report.push({
      table: tableName,
      columnsCount: columns.length,
      columns: columns.map((c) => ({
        field: c.Field,
        type: c.Type,
        null: c.Null,
        key: c.Key,
        default: c.Default,
      })),
    });
  }

  return report;
}

/**
 * Step 4: Seed default baseline data if tables are empty
 */
async function seedBaselineData() {
  console.log("[AutoMigrate] Checking and seeding baseline records...");

  // 1. Admin User
  const adminCount = await User.count({ where: { role: "admin" } });
  if (adminCount === 0) {
    await User.create({
      name: "ParakshTech Administrator",
      email: "admin@parakshtech.com",
      password: "Admin@123",
      role: "admin",
    });
    console.log("  ✓ Admin account created: admin@parakshtech.com / Admin@123");
  } else {
    console.log(`  ✓ Admin accounts verified (${adminCount} existing)`);
  }

  // 2. Site Content (Hero, About, Contact Coordinates)
  const heroContent = await SiteContent.findOne({ where: { section: "hero" } });
  if (!heroContent) {
    await SiteContent.create({
      section: "hero",
      title: "Architecting Intelligent Digital Systems That Scale.",
      sub_heading: "Next-Gen IT & Digital Engineering Solutions",
      heading:
        "We engineer enterprise software, cloud-native architectures, high-impact web applications, and AI integrations engineered for velocity, resilience, and exponential growth.",
      metadata: {
        ctaPrimaryText: "Explore Solutions",
        ctaPrimaryLink: "/services",
        ctaSecondaryText: "Schedule a Call",
        ctaSecondaryLink: "/contact",
        metric1: "5+ Projects Delivered",
        metric2: "99.9% Uptime Guarantee",
        metric3: "24/7 Expert Support",
      },
    });
    console.log("  ✓ Default Hero section content seeded");
  }

  const aboutContent = await SiteContent.findOne({ where: { section: "about" } });
  if (!aboutContent) {
    await SiteContent.create({
      section: "about",
      title: "About Paraksh Technologies",
      sub_heading: "Driving Digital Innovation & Scalable Engineering",
      contents:
        "Paraksh Technologies is a premier IT consulting and product engineering company. We partner with fast-growing startups and global enterprises to craft scalable software systems, cloud migrations, high-concurrency web applications, and modern mobile solutions.",
      metadata: {
        experienceYears: "5+",
        projectsCompleted: "50+",
        clientSatisfaction: "99.8%",
        activeClients: "25+",
      },
    });
    console.log("  ✓ Default About Us content seeded");
  }

  const contactContent = await SiteContent.findOne({ where: { section: "contact_info" } });
  if (!contactContent) {
    await SiteContent.create({
      section: "contact_info",
      title: "Company Contact & Coordinates",
      contents: "Pustakalaya Road, Buxar, Bihar, India",
      metadata: {
        phone: "+91 9296454675",
        email: "contact@parakshtech.com",
        address: "Pustakalaya Road, Buxar, Bihar, India",
        workingHours: "Mon - Sat: 9:00 AM - 7:00 PM IST",
        linkedin: "https://www.linkedin.com/company/parakshtech",
        facebook: "https://www.facebook.com/profile.php?id=61579256180141",
        instagram: "https://www.instagram.com/parakshtech/",
        twitter: "https://twitter.com/parakshtech",
      },
    });
    console.log("  ✓ Default Contact coordinates seeded");
  }

  // 3. Services
  const servicesCount = await Service.count();
  if (servicesCount === 0) {
    const defaultServices = [
      {
        title: "Web Development",
        slug: "web-development",
        sub_heading: "High-Performance Full-Stack Web Applications",
        category: "Web Development",
        icon: "fas fa-code",
        short_desc:
          "Modern web applications built with React, Next.js, Node.js, and cloud backends engineered for lightning-fast speeds and high conversion.",
        contents:
          "We engineer mission-critical web platforms utilizing modern reactive architectures. Every project features optimized asset delivery, clean component boundaries, and resilient backend APIs designed to scale seamlessly under traffic spikes.",
        features: [
          "Single-Page Application (SPA) & Server-Side Rendering (SSR)",
          "Responsive, fluid layouts with mobile-first design systems",
          "Automated CI/CD pipelines with zero-downtime deployment",
          "Secure authentication, rate-limiting, and REST/GraphQL APIs",
        ],
        tech: ["React.js", "Node.js", "Express", "MySQL", "Tailwind CSS", "AWS"],
        order: 1,
      },
      {
        title: "Software Development",
        slug: "software-development",
        sub_heading: "Custom Enterprise Systems & Cloud Backends",
        category: "Software Development",
        icon: "fas fa-laptop-code",
        short_desc:
          "Robust enterprise software solutions, ERP suites, automated microservices, and bespoke software tailored precisely to business operations.",
        contents:
          "From internal operations management to multi-tenant SaaS platforms, we architect resilient software systems with clean domain modeling, robust relational databases, and enterprise security compliance.",
        features: [
          "Microservice architectures with distributed message queues",
          "High-performance relational and NoSQL database modeling",
          "Comprehensive role-based access control (RBAC)",
          "Automated integration testing and performance benchmarking",
        ],
        tech: ["Node.js", "Python", "Sequelize", "Docker", "PostgreSQL", "Redis"],
        order: 2,
      },
      {
        title: "Mobile App Development",
        slug: "mobile-app-development",
        sub_heading: "Cross-Platform iOS & Android Native Experiences",
        category: "Mobile Applications",
        icon: "fas fa-mobile-alt",
        short_desc:
          "Native performance mobile apps crafted with Flutter and React Native, featuring smooth 60fps animations and offline-first capabilities.",
        contents:
          "We design and build intuitive mobile applications that captivate users. Our solutions leverage hardware sensors, push notifications, background sync, and biometric authentication for world-class mobile experiences.",
        features: [
          "Cross-platform codebase delivering native iOS and Android apps",
          "Offline data synchronization with local SQLite/Realm storage",
          "Smooth micro-interactions and gesture-driven UX",
          "Integrated payment gateways, biometrics, and push notifications",
        ],
        tech: ["Flutter", "Dart", "React Native", "Firebase", "App Store Connect"],
        order: 3,
      },
      {
        title: "Cloud & DevOps Engineering",
        slug: "cloud-devops",
        sub_heading: "Scalable Infrastructure, Containerization & CI/CD",
        category: "Cloud Solutions",
        icon: "fas fa-cloud",
        short_desc:
          "Cloud architecture design, Kubernetes container orchestration, infrastructure as code, and automated deployment pipelines.",
        contents:
          "We modernize IT operations with cloud-native paradigms. Migrate legacy systems to AWS, Azure, or Google Cloud while establishing automated testing, monitoring, and automated autoscaling.",
        features: [
          "Docker containerization and Kubernetes orchestration",
          "Infrastructure as Code (IaC) with Terraform",
          "Proactive monitoring, alerting, and log aggregation",
          "Multi-region high availability and automated disaster recovery",
        ],
        tech: ["AWS", "Docker", "Kubernetes", "Nginx", "GitHub Actions", "Terraform"],
        order: 4,
      },
      {
        title: "AI & Machine Learning Integrations",
        slug: "ai-machine-learning",
        sub_heading: "Intelligent Workflows, LLMs & Predictive Analytics",
        category: "Artificial Intelligence",
        icon: "fas fa-brain",
        short_desc:
          "Custom LLM integrations, automated intelligent workflows, sentiment analysis, and predictive models that transform business data into action.",
        contents:
          "Empower your digital products with intelligence. We integrate state-of-the-art AI models, retrieval-augmented generation (RAG) knowledge bases, and automated inference pipelines.",
        features: [
          "Custom AI assistants and automated customer workflows",
          "Retrieval-Augmented Generation (RAG) on company documentation",
          "Predictive analytics and trend anomaly detection",
          "Secure on-premise and cloud inference API endpoints",
        ],
        tech: ["Python", "OpenAI / Gemini API", "LangChain", "Vector DBs", "FastAPI"],
        order: 5,
      },
    ];
    await Service.bulkCreate(defaultServices);
    console.log(`  ✓ Seeded ${defaultServices.length} default service offerings`);
  } else {
    console.log(`  ✓ Services verified (${servicesCount} existing)`);
  }

  // 4. Career Postings
  const jobsCount = await Job.count();
  if (jobsCount === 0) {
    const defaultJobs = [
      {
        title: "Full Stack React & Node.js Developer",
        department: "Engineering",
        location: "Remote / Hybrid (Noida, IN)",
        job_type: "Full-Time",
        experience: "2-4 Years",
        salary: "Competitive (₹6 - ₹12 LPA)",
        deadline: "Open until filled",
        description:
          "We are seeking an ambitious Full Stack Developer to engineer scalable web platforms, implement dynamic interactive UIs in React, and architect REST/WebSocket services in Node.js.",
        requirements: [
          "2+ years hands-on experience with modern React, JavaScript (ES6+), and CSS/Tailwind",
          "Solid proficiency in Node.js, Express, and Sequelize/MySQL ORMs",
          "Experience with RESTful API architecture, JWT authentication, and state management",
          "Familiarity with Git version control, Docker basics, and deployment workflows",
        ],
        responsibilities: [
          "Architect, develop, and maintain clean frontend components and backend endpoints",
          "Collaborate closely with UI/UX designers and product managers to deliver engaging experiences",
          "Write clean, documented, and testable code adhering to engineering best practices",
          "Participate in code reviews and optimize application speed and responsiveness",
        ],
        skills: ["React.js", "Node.js", "Express", "MySQL", "JavaScript", "REST APIs", "Git"],
        isActive: true,
      },
      {
        title: "Mobile App Engineer (Flutter / React Native)",
        department: "Mobile Development",
        location: "Remote",
        job_type: "Full-Time",
        experience: "2+ Years",
        salary: "Competitive (₹7 - ₹13 LPA)",
        deadline: "Open until filled",
        description:
          "Join our mobile engineering squad to build beautiful, responsive iOS and Android applications with smooth animations, offline persistence, and seamless cloud syncing.",
        requirements: [
          "2+ years experience building and releasing Flutter or React Native mobile applications",
          "Deep understanding of state management (Provider, Bloc, or Redux/Zustand)",
          "Experience integrating native device APIs, push notifications, and camera/GPS telemetry",
          "Published at least one production app on Google Play Store or Apple App Store",
        ],
        responsibilities: [
          "Develop new mobile features from design prototypes to production store releases",
          "Optimize rendering performance for consistent 60fps animations across diverse devices",
          "Implement robust offline caching and reliable background synchronization",
          "Diagnose and fix performance bottlenecks, crashes, and memory leaks",
        ],
        skills: ["Flutter", "Dart", "React Native", "REST APIs", "SQLite", "Firebase", "Git"],
        isActive: true,
      },
    ];
    await Job.bulkCreate(defaultJobs);
    console.log(`  ✓ Seeded ${defaultJobs.length} career openings`);
  } else {
    console.log(`  ✓ Careers verified (${jobsCount} existing)`);
  }

  // 5. Team Members
  const teamCount = await Team.count();
  if (teamCount === 0) {
    const defaultTeam = [
      {
        name: "Abhishek Kumar",
        designation: "Founder & Chief Executive Officer",
        bio: "Visionary technologist and software architect with over a decade of leadership in enterprise engineering and digital transformation.",
        social: {
          linkedin: "https://www.linkedin.com/company/parakshtech",
          github: "https://github.com",
          twitter: "https://twitter.com/parakshtech",
        },
        order: 1,
        isActive: true,
      },
      {
        name: "Vikram Sharma",
        designation: "Lead Systems Architect",
        bio: "Specialist in cloud-native microservices, distributed relational databases, and high-concurrency backend telemetry.",
        social: {
          linkedin: "https://www.linkedin.com/company/parakshtech",
          github: "https://github.com",
          twitter: "https://twitter.com/parakshtech",
        },
        order: 2,
        isActive: true,
      },
      {
        name: "Pooja Patel",
        designation: "Head of Product & UI/UX Design",
        bio: "Obsessed with creating frictionless human-centered digital experiences, interactive design systems, and modern visual branding.",
        social: {
          linkedin: "https://www.linkedin.com/company/parakshtech",
          github: "https://github.com",
          twitter: "https://twitter.com/parakshtech",
        },
        order: 3,
        isActive: true,
      },
    ];
    await Team.bulkCreate(defaultTeam);
    console.log(`  ✓ Seeded ${defaultTeam.length} leadership team members`);
  } else {
    console.log(`  ✓ Team members verified (${teamCount} existing)`);
  }

  // 6. Portfolio Projects
  const portfolioCount = await Portfolio.count();
  if (portfolioCount === 0) {
    const defaultProjects = [
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
        platform: "Web & Cloud Architecture",
        status: "Live & Active",
        tech: ["React.js", "Node.js", "Express", "MySQL", "Docker", "AWS ECS", "Redis"],
        features: [
          "Real-time ledger reconciliation with sub-second accuracy across multi-currency transactions",
          "Multi-role RBAC permissions system with fine-grained column-level access controls",
          "Automated purchase order workflows reducing procurement cycles by 64%",
          "Interactive analytics visualizer with real-time KPI dashboards",
        ],
        impact: "+48% Processing Velocity | $1.2M Saved Annually",
        link: "https://demo.parakshtech.com/erp",
        order: 1,
        isActive: true,
      },
      {
        title: "NextGen Telehealth & Clinical Portal",
        sub_heading: "HIPAA-Compliant Patient Telemetry System",
        category: "webapp",
        description:
          "End-to-end clinical consultations and tele-diagnostics application with real-time video, electronic health record (EHR) sync, and digital prescription workflows.",
        images: [
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
        ],
        client: "Apex Health Alliance",
        year: "2024",
        industry: "Healthcare & MedTech",
        platform: "WebRTC / Cloud SaaS",
        status: "Live",
        tech: ["React.js", "WebRTC", "Socket.io", "Node.js", "PostgreSQL", "HIPAA Vault"],
        features: [
          "Peer-to-peer encrypted HD video consultations with real-time audio ducking",
          "Automated appointment dispatch with calendar synchronizations and SMS reminders",
          "HL7 & FHIR compliant data layer integrating with legacy hospital EHR databases",
          "Cryptographically signed digital prescriptions verified via pharmacy QR codes",
        ],
        impact: "Over 80,000 Patient Consultations Hosted",
        link: "https://demo.parakshtech.com/telehealth",
        order: 2,
        isActive: true,
      },
      {
        title: "OmniChannel E-Commerce Architecture",
        sub_heading: "High-Concurrency Retail Engine",
        category: "website",
        description:
          "Headless e-commerce infrastructure supporting over 10,000 concurrent shopping carts, sub-50ms catalog lookups, and multi-warehouse order routing.",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
        ],
        client: "Vogue Collective Global",
        year: "2024",
        industry: "Luxury Fashion & Retail",
        platform: "Next.js / Cloudflare Edge",
        status: "Live",
        tech: ["Next.js", "React", "Node.js", "Stripe Connect", "Elasticsearch", "Cloudflare"],
        features: [
          "Sub-50ms instantaneous search across a catalog of 250,000+ SKUs",
          "Zero-friction 1-click checkout with automated regional currency conversion",
          "Inventory reservation queue handling Black Friday peak concurrent checkouts",
          "AI-driven visual recommendations increasing average order value by 28%",
        ],
        impact: "185% Increase in Mobile Conversion Rates",
        link: "https://demo.parakshtech.com/vogue",
        order: 3,
        isActive: true,
      },
      {
        title: "FinTech Wealth & Algorithmic Trading Desk",
        sub_heading: "Real-Time Market Telemetry & Portfolio Analytics",
        category: "webapp",
        description:
          "High-frequency algorithmic trading terminal with WebSocket market data streams, order book visualizations, and automated compliance auditing.",
        images: [
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
        ],
        client: "Starlight Capital Partners",
        year: "2023",
        industry: "Finance & Asset Management",
        platform: "Web & Microservices",
        status: "Live",
        tech: ["React.js", "TypeScript", "WebSockets", "Node.js", "TimescaleDB", "Redis"],
        features: [
          "Streaming WebSocket depth charts rendering at 60 frames per second",
          "Complex event processing (CEP) rule engine for automated order execution",
          "Zero-trust biometric session authentication with instant revocation",
          "Automated SEC & FINRA regulatory reporting exports",
        ],
        impact: "$420M+ in Daily Notional Trading Volume Processed",
        link: "https://demo.parakshtech.com/wealth",
        order: 4,
        isActive: true,
      },
    ];
    await Portfolio.bulkCreate(defaultProjects);
    console.log(`  ✓ Seeded ${defaultProjects.length} showcase portfolio projects`);
  } else {
    console.log(`  ✓ Portfolio items verified (${portfolioCount} existing)`);
  }
}

/**
 * Main Runner Function
 */
async function runAutoMigration(options = { verbose: true }) {
  const startTime = Date.now();
  console.log("======================================================");
  console.log("ParakshTech Auto-Migration & Table Provisioning Engine");
  console.log("======================================================");

  // 1. Ensure DB exists
  await ensureDatabaseExists();

  // 2. Sync models and alter tables
  await syncAndAlterTables();

  // 3. Seed baseline records
  await seedBaselineData();

  // 4. Inspect tables
  const diagnostics = await getTableDiagnostics();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("======================================================");
  console.log(`Migration completed successfully in ${elapsed}s!`);
  console.log(`Verified ${diagnostics.length} active database tables:`);
  diagnostics.forEach((t) => {
    console.log(`  • Table: \`${t.table}\` (${t.columnsCount} columns)`);
  });
  console.log("======================================================");

  return {
    success: true,
    elapsedSeconds: elapsed,
    database: DB_CONFIG.database,
    tablesCount: diagnostics.length,
    tables: diagnostics,
  };
}

// If executed directly from command line (e.g. node migrations/autoMigrate.js or npm run migrate)
if (require.main === module) {
  runAutoMigration()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("[AutoMigrate] Fatal migration error:", err);
      process.exit(1);
    });
}

module.exports = {
  runAutoMigration,
  ensureDatabaseExists,
  syncAndAlterTables,
  seedBaselineData,
  getTableDiagnostics,
};
