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
    rotating: ["Django back ends", "REST APIs", "automation", "web scraping", "data pipelines"],
  },

  // Terminal in the hero. t: "cmd" (typed after a $ prompt), "code" (a line of Python), "out" (program output).
  // Keep it to facts from your resume.
  terminal: [
    { t: "cmd", s: "cat about.py" },
    { t: "code", s: 'name = "Chakshit Gaur"' },
    { t: "code", s: 'role = "Python Developer (Django, APIs & Automation)"' },
    { t: "code", s: 'location = "New Delhi, India"' },
    { t: "code", s: 'stack = ["Python", "Django", "SQL", "Selenium", "OCR", "Scikit-learn"]' },
    { t: "code", s: 'experience = "AI/ML Engineer @ Isourse Technologies"' },
    { t: "code", s: "applicants_managed = 5000  # in the ATS I built" },
    { t: "code", s: 'print(f"{name} | {role} | {location}")' },
    { t: "cmd", s: "python about.py" },
    { t: "out", s: "Chakshit Gaur | Python Developer (Django, APIs & Automation) | New Delhi, India" },
  ],

  // Core stack: your headline skill groups, each with a tools line.
  // "match" words are compared with project tags: hovering a card highlights the projects that use it.
  // Short list of headline skills: feeds the hero API card and the marquee band.
  stack: ["Python", "Django", "SQL", "Selenium & scraping", "Machine learning & CV"],

  // Skills section: what I can build. "match" words are compared with project tags:
  // hovering a card highlights the projects that use it. "icon": code, bolt, chart, merge or spark.
  core: [
    { name: "Backends and APIs", icon: "code", tools: "Python · Django · REST framework · MySQL", match: ["python", "django", "sql"] },
    { name: "Automation and scraping", icon: "bolt", tools: "Selenium · Web scraping · Python scripts", match: ["selenium", "scraping"] },
    { name: "Data and ML models", icon: "chart", tools: "Pandas · NumPy · Scikit-learn · TensorFlow · PyTorch · OCR", match: ["machine learning", "svm", "logistic", "recommender", "computer vision", "ocr"] },
    { name: "Testing, CI/CD and Docker", icon: "merge", tools: "GitHub Actions · Automated tests · Docker · Git", match: ["django"] },
    { name: "Faster delivery with AI agents", icon: "spark", tools: "Claude Code · Codex · Cursor" },
  ],

  // Optional status shown in the hero, e.g. status: "Open to work". Leave it out to hide it.

  location: "New Delhi, India",

  links: {
    email: "chakshitgaur25@gmail.com",
    linkedin: "https://www.linkedin.com/in/chakshit-gaur",
    github: "https://github.com/ChakshitGaur", // taken from the GitHub account signed in on this PC; change it if you want another profile
  },

  resumeFile: "assets/ChakshitGaurResume.pdf",

  about: [
    "I'm a Python developer and Computer Science graduate (B.Tech) based in New Delhi, with experience in " +
      "**automation, web scraping, computer vision and video processing**. As an AI/ML Engineer I built an applicant tracking system for 5,000+ applicants, " +
      "a client video processing system and an employee monitoring tool, **end to end**, from data collection and storage to packaging and documentation.",
    "I also build **Django web apps**, such as a multi-user Expense Tracker with automated tests and CI. My core toolkit is " +
      "**Python, SQL (MySQL, Oracle SQL) and Git**, with Pandas and NumPy for data and Scikit-learn, TensorFlow and PyTorch for machine learning. " +
      "I enjoy turning **messy data and manual processes into reliable software**.",
  ],

  // Only facts taken from the resume. Add more numbers here once you have real ones.
  stats: [
    { value: "3+ yrs", label: "Professional experience" },
    { value: "3", label: "Projects built at Isourse" },
    { value: "3", label: "Personal projects" },
    { value: "5,000+", label: "Applicants managed by my ATS" },
  ],

  experience: [
    {
      title: "Freelancing",
      org: "Independent",
      location: "Remote",
      period: "Feb 2026 – Present",
      bullets: [
        "Worked as a remote Python backend engineer with several companies, including clients based outside India, taking on projects and working with each client directly.",
        "Built and maintained the APIs and the backend structure that run and support client dashboards, helping keep them up and running day to day.",
        "Delivered projects on time while staying in regular contact with each client and adapting to their needs across different time zones.",
      ],
      // Used only for the skill-card hover highlight; not shown on the page.
      tags: ["Python", "REST APIs"],
    },
    {
      title: "Career Break",
      org: "Self-directed learning",
      period: "Oct 2025 – Jan 2026",
      bullets: [
        "Took a planned career break to deepen my Python backend skills, studying backend development and the tools and practices around it.",
      ],
    },
    {
      title: "Python Developer",
      org: "Stealth Startup (Full-time)",
      period: "Jul 2024 – Sep 2025",
      bullets: [
        "Joined an early-stage startup in stealth mode as a full-time Python developer, working on the backend side of its dashboard product.",
        "Built backend features and APIs using Python, Django and Django REST Framework, with MySQL for data storage and Git for version control.",
        "Worked in a small, fast-moving team, helping turn early ideas into working features and adapting quickly as priorities changed.",
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
        "Built the FM Logistics client video system in Python, using OCR and computer vision to read timestamps and synchronise two live-stream videos, then stitch them into one combined video.",
        "Built an applicant tracking system with Selenium that pulls applicant details from LinkedIn into CSV for HR, with Python and SQL storage managing 5,000+ applicants, and trained HR staff to use it.",
        "Built an Employee Management System that measures productivity by tracking keyboard activity and idle time, delivered as a standalone executable with documentation and user support.",
      ],
      // Used only for the skill-card hover highlight; not shown on the page.
      tags: ["Python", "OCR", "Computer Vision", "Video processing", "Selenium", "Web Scraping", "SQL", "CSV export", "Activity tracking"],
    },
  ],

  projects: [
    {
      name: "Expense Tracker",
      category: "Web app · Django",
      visual: "donut", // card artwork: "scatter", "graph", "bars" or "donut"
      problem: "Keeping track of everyday spending and staying within a monthly budget.",
      approach:
        "A multi-user Django web app to log expenses by category, set monthly budgets with threshold warnings and track spending on a dashboard; each user sees only their own data. " +
        "Includes CSV import/export with per-row error reports.",
      stack: ["Python", "Django", "SQLite"],
      metric: "43 automated tests running on GitHub Actions CI",
      github: "https://github.com/ChakshitGaur/expense-tracker",
    },
    {
      name: "Multiple Disease Prediction System",
      category: "Machine Learning",
      visual: "scatter",
      problem: "Early detection of Parkinson's disease, heart disease and diabetes from patient data.",
      approach:
        "Built classification models for each condition using logistic regression and support vector machines.",
      stack: ["Python", "Machine Learning", "Logistic Regression", "SVM"],
      github: "https://github.com/ChakshitGaur/Multiple-Disease-Prediction-System",
    },
    {
      name: "Book Recommendation System",
      category: "Recommender System",
      visual: "graph",
      problem: "Suggesting books readers are likely to enjoy, based on their ratings and similar readers.",
      approach:
        "A Flask-based machine learning recommender: preprocessed book-rating datasets, then used collaborative filtering and cosine similarity to recommend similar books.",
      stack: ["Python", "Flask", "NumPy", "Pandas", "Scikit-learn", "Cosine similarity"],
      github: "https://github.com/ChakshitGaur/BookPilot",
    },
  ],

  skills: [
    { group: "Programming languages", items: ["Python", "SQL", "Core Java"] },
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
