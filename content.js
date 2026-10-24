/* ==========================================================================
   content.js: the ONLY file you need to edit.

   PLACEHOLDER RULE
   Anything written like  "[[ ... ]]"  is a placeholder.
   - On the public page, placeholders are HIDDEN automatically.
   - Open index.html?preview to see them with dashed outlines.
   - There are no placeholders right now: the page shows only real content.
     Copy blocks from the TEMPLATES comment at the bottom of this file when you want to add more.
   Only write facts that are true; recruiters do check.
   ========================================================================== */

window.CONTENT = {
  name: "Chakshit Gaur",
  role: "Python Developer · Django, APIs & Automation",
  // Hero (top of the page).
  hero: {
    eyebrow: "Python developer · Django, APIs & automation",
    headline: "Python developer turning messy data into working software.",
    accent: "working software.", // the part of the headline shown in the accent colour
    // Line under the headline: the last words scramble from one phrase to the next.
    rotatingPrefix: "Currently into",
    rotating: ["Django back ends", "REST APIs", "automation tools", "ML with clear reasons", "AI coding agents", "tested Django apps"],
  },

  // "How I work" list beside the About text: a short title and one line each. Keep it to things the Experience bullets already say.
  howIWork: [
    { title: "Understand what is needed", text: "I work closely with the people who will use it, whether clients, founders or HR teams." },
    { title: "Build it end to end", text: "From data collection and storage to packaging, delivered as a complete, working system." },
    { title: "Adapt as priorities change", text: "Small teams and remote clients move fast, so I keep communication clear and adjust quickly." },
    { title: "Hand it over cleanly", text: "Documentation, training and support, and code others can build on and maintain." },
  ],

  // Core stack: your headline skill groups, each with a tools line.
  // "match" words are compared with project tags: hovering a card highlights the projects that use it.
  // Short list of headline skills: feeds the hero API card and the marquee band.
  stack: ["Python", "Django", "SQL", "Selenium & scraping", "Machine learning & CV"],

  // Skills section: what I can build. Cards show only a generic tagline; clicking one opens a popup listing every skill in "skills". "match" words are compared with project tags:
  // hovering a card highlights the projects that use it. "icon": code, bolt, chart, merge or spark.
  core: [
    {
      name: "Backends and APIs",
      icon: "code",
      tagline: "Web servers, APIs and databases",
      match: ["python", "django", "sql"],
      // Shown in the popup when the card is clicked.
      skills: [
        "Python", "Django", "Django REST Framework", "REST APIs",
        "Flask", "SQL", "MySQL", "Oracle SQL", "SQLite", "Database design",
        "Postman", "JWT authentication", "API Integration",
      ],
    },
    {
      name: "Automation and scraping",
      icon: "bolt",
      tagline: "Scripts, bots and data collection",
      match: ["selenium", "scraping"],
      // Shown in the popup when the card is clicked.
      skills: [
        "Selenium", "Web scraping", "Python scripts", "BeautifulSoup",
        "Requests", "Data Extraction", "Data parsing", "JSON processing",
        "API Automation", "Task automation", "ETL pipelines", "Data collection and storage",
        "CSV export", "PyInstaller", "Packaging as a standalone executable", "pynput",
      ],
    },
    {
      name: "Data and ML models",
      icon: "chart",
      tagline: "Analysis, modelling and dashboards",
      match: ["machine learning", "svm", "logistic", "recommender", "computer vision", "ocr"],
      // Shown in the popup when the card is clicked.
      skills: [
        "NumPy", "Pandas", "Matplotlib", "Seaborn",
        "Power BI", "Scikit-learn", "XGBoost", "SHAP",
        "TensorFlow", "PyTorch", "Logistic regression", "Regression",
        "Classification", "SVM", "Collaborative filtering", "Cosine similarity",
        "OCR", "Computer vision", "YOLO", "Streamlit",
        "Feature engineering", "Model evaluation and tuning", "Model Serialization", "EDA",
      ],
    },
    {
      name: "Testing, CI/CD and Docker",
      icon: "merge",
      tagline: "Quality, pipelines and delivery",
      match: ["django"],
      // Shown in the popup when the card is clicked.
      skills: [
        "GitHub Actions", "Continuous integration", "Continuous deployment", "pytest",
        "Automated tests", "Unit Testing", "Debugging", "Exception handling",
        "Docker", "Git", "GitHub", "Git pull requests",
        "Virtual environments", "VS Code", "PyCharm", "Jupyter Notebook",
      ],
    },
    {
      name: "Faster delivery with AI agents",
      icon: "spark",
      tagline: "Coding with AI assistants",
      // Shown in the popup when the card is clicked.
      skills: [
        "Claude Code", "Codex", "Cursor", "Claude",
        "ChatGPT", "LLM APIs", "Prompt engineering", "MCP",
        "Agentic workflows", "AI-assisted pull requests", "AI-assisted code review",
      ],
    },
  ],

  // Optional status shown in the hero, e.g. status: "Open to work". Leave it out to hide it.

  location: "New Delhi, India",

  // Shown in the footer as "Updated <month year>". Change it whenever you update the site.
  updated: "October 2026",

  links: {
    email: "chakshitgaur25@gmail.com",
    linkedin: "https://www.linkedin.com/in/chakshit-gaur",
    github: "https://github.com/ChakshitGaur", // taken from the GitHub account signed in on this PC; change it if you want another profile
  },

  resumeFile: "assets/ChakshitGaurResume.pdf",

  about: [
    "I'm a Python developer and Computer Science graduate (B.Tech) based in New Delhi, with experience in " +
      "**automation, web scraping, computer vision and video processing**. My first role was AI/ML Engineer, where I built " +
      "**an applicant tracking system for 5,000+ applicants, a client video processing system and an employee monitoring tool**, each one end to end, " +
      "from data collection and storage to packaging and documentation.",
    "Since then I've moved into **Python back ends**: Django and Django REST Framework APIs at an early-stage startup, and now freelance work for remote clients, " +
      "some of them outside India. On my own I build projects like **a multi-user Expense Tracker with 46 automated tests and CI** and " +
      "**a customer churn model with a Streamlit dashboard**. I enjoy **turning messy data and manual processes into reliable software**.",
  ],

  // Only facts taken from the resume. Add more numbers here once you have real ones.
  stats: [
    { value: "3+ yrs", label: "Professional experience" },
    { value: "3", label: "Projects built at Isourse" },
    { value: "4", label: "Personal projects" },
    { value: "5,000+", label: "Applicants managed by my ATS" },
  ],

  experience: [
    {
      title: "Freelancing",
      org: "Independent",
      location: "Remote",
      period: "Feb 2026 – Present",
      type: "Freelance",
      bullets: [
        "Worked as a remote Python backend engineer with several companies, including clients based outside India, taking on projects end to end and working with each client directly to understand what they needed and to keep the work on track.",
        "Built and maintained the APIs and the backend structure that run and support client dashboards, handling the day-to-day upkeep that keeps those dashboards running smoothly for the people who depend on them, from small fixes to features.",
        "Delivered projects on time while staying in regular contact with each client and adapting to their needs across different time zones, keeping communication clear and progress visible throughout each engagement and handing work over cleanly.",
      ],
      // Used only for the skill-card hover highlight; not shown on the page.
      tags: ["Python", "REST APIs"],
    },
    {
      title: "Career Break",
      org: "Self-directed learning",
      period: "Oct 2025 – Jan 2026",
      bullets: [
        "Took a planned career break to deepen my Python backend skills, studying backend development and the tools and practices around it, so I could return to building and shipping software with a stronger foundation in a fast-changing field.",
      ],
    },
    {
      title: "Python Developer",
      org: "Stealth Startup",
      type: "Full-time",
      period: "Jul 2024 – Sep 2025",
      bullets: [
        "Joined an early-stage startup in stealth mode as a full-time Python developer, working on the backend side of its dashboard product in a small team, working closely alongside the founders, while the product was still taking shape and moving fast.",
        "Built backend features and APIs using Python, Django and Django REST Framework, with MySQL for data storage and Git for version control, writing code that the rest of the team could build on and maintain, and keeping it easy to extend later.",
        "Worked in a small, fast-moving team, helping turn early ideas into working features and adapting quickly as priorities changed, which meant shipping steadily while the product direction kept evolving, and learning quickly along the way.",
      ],
      // Used only for the skill-card hover highlight; not shown on the page.
      tags: ["Python", "Django", "Django REST Framework", "MySQL", "Git"],
    },
    {
      title: "AI/ML Engineer",
      org: "Isourse Technologies Pvt. Ltd.",
      location: "Delhi",
      period: "May 2023 – Jun 2024",
      bullets: [
        "Built the FM Logistics client video system in Python, using OCR and computer vision to read timestamps and synchronise two live-stream videos, then stitch them into one combined video, delivered as a complete, working system for the client.",
        "Built an applicant tracking system with Selenium that extracts applicant details for open jobs from LinkedIn into CSV for HR, with Python and SQL storage integrated with the HR systems for 5,000+ applicants, and trained the HR staff to use it.",
        "Built an Employee Management System (EMS) that measures productivity by tracking keyboard activity and idle time, delivered as a standalone executable with documentation and user support so the team could run it without extra setup.",
      ],
      // Used only for the skill-card hover highlight; not shown on the page.
      tags: ["Python", "OCR", "Computer Vision", "Video processing", "Selenium", "Web Scraping", "SQL", "CSV export", "Activity tracking"],
    },
  ],

  // Each project: a screenshot ("shot", in assets/projects), a one-line problem, short highlights, tags and links.
  // "metric" is the highlighted result line. Add "demo": "https://..." only when there is a real live link.
  projects: [
    {
      name: "Expense Tracker",
      category: "Web app · Django",
      shot: "assets/projects/expense-tracker.jpg",
      shotAlt: "Expense Tracker dashboard with a spending-by-category chart and monthly budget bars",
      visual: "donut", // card artwork used when there is no screenshot: "scatter", "graph", "bars" or "donut"
      problem: "Keeping track of everyday spending and staying within a monthly budget.",
      highlights: [
        "Multi-user: each user sees only their own data",
        "Charts dashboard and monthly budgets with progress bars and threshold warnings",
        "CSV import and export with per-row error reports",
      ],
      stack: ["Python", "Django", "SQLite", "Chart.js"],
      metric: "46 automated tests running on GitHub Actions CI",
      github: "https://github.com/ChakshitGaur/expense-tracker",
    },
    {
      name: "Multiple Disease Prediction System",
      category: "Machine Learning",
      shot: "assets/projects/disease-prediction.jpg",
      shotAlt: "Diabetes prediction form in the Streamlit app, showing the result The person is not diabetic",
      visual: "scatter",
      problem: "Early detection of Parkinson's disease, heart disease and diabetes from patient data.",
      highlights: [
        "Streamlit app that predicts diabetes, heart disease and Parkinson's disease from medical inputs",
        "A separate scikit-learn model for each disease (logistic regression, SVM), loaded in the app",
      ],
      stack: ["Python", "Streamlit", "Scikit-learn", "Logistic Regression", "SVM"],
      github: "https://github.com/ChakshitGaur/Multiple-Disease-Prediction-System",
    },
    {
      name: "Book Recommendation System",
      category: "Recommender System",
      shot: "assets/projects/book-recommender.jpg",
      shotAlt: "BookPilot home page showing popular books with their covers",
      visual: "graph",
      problem: "Suggesting books readers are likely to enjoy, based on their ratings and similar readers.",
      highlights: [
        "Flask app that recommends similar books with collaborative filtering and cosine similarity",
        "Book-rating data prepared with NumPy, Pandas and Scikit-learn; HTML front end and a Procfile",
      ],
      stack: ["Python", "Flask", "NumPy", "Pandas", "Scikit-learn", "Cosine similarity"],
      github: "https://github.com/ChakshitGaur/BookPilot",
    },
    {
      name: "Customer Churn Prediction",
      category: "Machine Learning · Dashboard",
      shot: "assets/projects/customer-churn-prediction.jpg",
      shotAlt: "Churn risk dashboard showing test PR-AUC 0.671, risk tiers, targeting strategies and SHAP feature importance",
      visual: "bars",
      problem: "Finding which telecom customers are likely to leave, and which are worth a retention offer.",
      highlights: [
        "End-to-end pipeline on 7,043 telecom customers: 2.9x lift in the top risk decile, beating a logistic regression baseline",
        "SHAP explanations, calibrated risk tiers and a cost-based targeting plan",
        "Streamlit dashboard for single and batch scoring, with 80+ pytest tests",
      ],
      stack: ["Python", "XGBoost", "Scikit-learn", "SHAP", "Streamlit", "pytest"],
      metric: "PR-AUC 0.671; contacting 33% of customers reaches 73% of churners",
      github: "https://github.com/ChakshitGaur/customer-churn-prediction",
    },
  ],

  skills: [
    { group: "Programming languages", items: ["Python", "SQL"] },
    { group: "Web & backend", items: ["Django", "Django REST Framework", "REST APIs"] },
    { group: "Databases", items: ["MySQL", "Oracle SQL"] },
    { group: "Automation & data", items: ["Selenium", "Web Scraping", "Pandas", "NumPy", "Matplotlib", "Power BI"] },
    { group: "ML & computer vision", items: ["Computer Vision", "OCR", "Scikit-learn", "TensorFlow", "PyTorch", "YOLO"] },
    { group: "Tools & version control", items: ["Git", "GitHub", "GitHub Actions", "Docker", "VS Code", "PyCharm", "Jupyter Notebook"] },
  ],
};

/* ==========================================================================
   TEMPLATES (copy a block into the matching list above and fill it in)

   Experience entry:
     { title: "Role", org: "Organisation", location: "City / Remote", period: "Jun 2024 – Present",
       bullets: ["What you built or learned: lead with the result, then the tools used"] },

   Project:
     { name: "Name", category: "Category", visual: "scatter", problem: "One line: what problem does it solve?",
       approach: "How you built it, in 1-2 sentences", stack: ["tech"], metric: "optional, only if true",
       github: "https://github.com/ChakshitGaur/repo", demo: "https://..." },
   ========================================================================== */
