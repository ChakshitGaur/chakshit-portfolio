/* ==========================================================================
   content.js: the ONLY file you need to edit.

   PLACEHOLDER RULE
   Anything written like  "[[ ... ]]"  is a placeholder.
   - On the public page, placeholders are HIDDEN automatically.
   - Open index.html?preview to see them with dashed outlines.
   - To fill one in: replace the whole "[[ ... ]]" text with your real text
     (delete the brackets). It then appears on the page.
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

  // Core stack: your five headline skills, each with one line of proof.
  // "match" words are compared with project tags: hovering a card highlights the projects that use it.
  // A proof line left as a [[ placeholder ]] is shown dashed in preview mode and hidden otherwise.
  core: [
    { name: "Python", proof: "ATS, video sync system, employee monitoring", match: ["python"] },
    { name: "Django", proof: "Multi-user Expense Tracker, 43 tests + CI", match: ["django"] },
    { name: "SQL", proof: "ATS with 5,000+ applicants", match: ["sql"] },
    { name: "Selenium & scraping", proof: "LinkedIn applicant extraction for HR", match: ["selenium", "scraping"] },
    { name: "Machine learning & CV", proof: "Disease prediction, recommender, OCR video sync", match: ["machine learning", "svm", "logistic", "recommender", "computer vision", "ocr"] },
  ],

  // Optional status shown in the hero, e.g. "Open to work". Leave as placeholder to hide.
  status: "[[ e.g. Open to work ]]",

  location: "New Delhi, India",

  links: {
    email: "chakshitgaur25@gmail.com",
    linkedin: "https://www.linkedin.com/in/chakshit-gaur",
    github: "https://github.com/ChakshitGaur", // taken from the GitHub account signed in on this PC; change it if you want another profile
  },

  resumeFile: "assets/ChakshitGaur_resume.pdf",

  about: [
    "I'm a Python developer and Computer Science graduate (B.Tech, 2023) based in New Delhi, with experience in " +
      "**automation, web scraping and computer vision**. As an AI/ML Engineer I built an applicant tracking system for 5,000+ applicants, " +
      "a client video processing system and an employee monitoring tool, **end to end**, from data collection and storage to packaging and documentation.",
    "I also build **Django web apps**, such as a multi-user Expense Tracker with automated tests and CI. My core toolkit is " +
      "**Python, SQL (MySQL, Oracle SQL) and Git**, with Pandas and NumPy for data and Scikit-learn, TensorFlow and PyTorch for machine learning. " +
      "I enjoy turning **messy data and manual processes into reliable software**.",
  ],

  // Only facts taken from the resume. Add more numbers here once you have real ones.
  stats: [
    { value: "1+ yr", label: "Professional experience" },
    { value: "3", label: "Projects built at Isourse" },
    { value: "3", label: "Personal projects" },
    { value: "5,000+", label: "Applicants managed by my ATS" },
  ],

  experience: [
    // ---- FILL ME: what you have done since June 2024 (freelance, courses, open source, a new job...) ----
    {
      title: "[[ Your role or activity since June 2024 ]]",
      org: "[[ Organisation, or 'Independent' ]]",
      location: "[[ City / Remote ]]",
      period: "[[ Jun 2024 – Present ]]",
      bullets: [
        "[[ What you built or learned: lead with the result, then the tools used ]]",
        "[[ A second concrete achievement ]]",
        "[[ Optional third achievement ]]",
      ],
      tags: ["[[ tech ]]"],
    },

    {
      title: "AI/ML Engineer",
      org: "Isourse Technologies Pvt. Ltd.",
      location: "Delhi",
      period: "May 2023 – Jun 2024",
      bullets: [],
      projects: [
        {
          name: "Live-stream video sync for FM Logistics",
          text:
            "Built the FM Logistics client video system in Python, using OCR and computer vision to read timestamps and synchronise " +
            "two live-stream videos, then stitch them into one combined video.",
          tags: ["Python", "OCR", "Computer Vision", "Video processing"],
        },
        {
          name: "Applicant Tracking System (ATS)",
          text:
            "Built an ATS using Selenium automation to extract applicant details for open jobs from LinkedIn and export them to CSV for HR. " +
            "Designed the data storage in Python and SQL, integrated with HR systems, to manage 5,000+ applicants, " +
            "and trained HR staff to use it.",
          tags: ["Python", "Selenium", "Web Scraping", "SQL", "CSV export"],
        },
        {
          name: "Employee Management System",
          text:
            "Built an Employee Management System (EMS) that measures productivity by tracking keyboard activity and idle time. " +
            "Delivered it as a standalone executable with documentation and user support.",
          tags: ["Python", "Desktop executable", "Activity tracking"],
        },
      ],
      tags: [],
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
      demo: "[[ Live demo URL (optional) ]]",
    },
    {
      name: "Multiple Disease Prediction System",
      category: "Machine Learning",
      visual: "scatter",
      problem: "Early detection of Parkinson's disease, heart disease and diabetes from patient data.",
      approach:
        "Built classification models for each condition using logistic regression and support vector machines.",
      stack: ["Python", "Machine Learning", "Logistic Regression", "SVM"],
      metric: "[[ e.g. 'Reached 8x% accuracy on the heart-disease model': only if true ]]",
      github: "https://github.com/ChakshitGaur/Multiple-Disease-Prediction-System",
      demo: "[[ Live demo URL (optional) ]]",
    },
    {
      name: "Book Recommendation System",
      category: "Recommender System",
      visual: "graph",
      problem: "Suggesting books readers are likely to enjoy, based on their ratings and similar readers.",
      approach:
        "A collaborative filtering recommender: preprocessed book-rating datasets, then used user preferences and item similarity to generate personalised recommendations.",
      stack: ["Python", "NumPy", "Pandas", "Scikit-learn"],
      metric: "[[ optional: dataset size or an evaluation score ]]",
      github: "https://github.com/ChakshitGaur/BookPilot",
      demo: "[[ Live demo URL (optional) ]]",
    },
    // ---- Extra project slots: hidden until you fill the name ----
    {
      name: "[[ Project 4 name ]]",
      category: "[[ Category ]]",
      problem: "[[ One line: what problem does it solve? ]]",
      approach: "[[ How you built it, in 1-2 sentences ]]",
      stack: ["[[ tech ]]"],
      metric: "[[ optional ]]",
      github: "[[ GitHub repo URL ]]",
      demo: "[[ Live demo URL (optional) ]]",
    },
    {
      name: "[[ Project 5 name ]]",
      category: "[[ Category ]]",
      problem: "[[ One line: what problem does it solve? ]]",
      approach: "[[ How you built it, in 1-2 sentences ]]",
      stack: ["[[ tech ]]"],
      metric: "[[ optional ]]",
      github: "[[ GitHub repo URL ]]",
      demo: "[[ Live demo URL (optional) ]]",
    },
  ],

  skills: [
    { group: "Programming languages", items: ["Python", "SQL", "Core Java"] },
    { group: "Web & backend", items: ["Django", "Django REST Framework", "REST APIs"] },
    { group: "Databases", items: ["MySQL", "Oracle SQL"] },
    { group: "Automation & data", items: ["Selenium", "Web Scraping", "Pandas", "NumPy", "Matplotlib", "Power BI"] },
    { group: "ML & computer vision", items: ["Computer Vision", "OCR", "Scikit-learn", "TensorFlow", "PyTorch", "YOLO"] },
    { group: "Tools & version control", items: ["Git", "GitHub", "VS Code", "PyCharm", "Jupyter Notebook"] },
  ],

  // "score" is optional and shown under the school name.
  education: [
    {
      title: "B.Tech, Computer Science & Engineering",
      org: "D.P.G Institute of Technology and Management, Gurugram",
      score: "78%",
      period: "Jul 2019 – Jun 2023",
    },
    {
      title: "Class XII",
      org: "Shri Krishna Parnami Sr. Sec. School, Karnal",
      score: "89%",
      period: "2018",
    },
    {
      title: "Class X",
      org: "V.P International School, Karnal",
      score: "9.0/10 CGPA",
      period: "2016",
    },
  ],

  // Shown under Education. Hidden if the list is empty.
  achievements: [
    "Gold Prize, Annual CSSRI Sports-meet, in Football and 100-M race",
    "Silver Prize, Intra-college Kabaddi Competition",
  ],

  // Hidden until you fill in at least a name.
  certifications: [
    { name: "[[ Course or certification name ]]", issuer: "[[ Issuer ]]", year: "[[ Year ]]" },
    { name: "[[ Another one ]]", issuer: "[[ Issuer ]]", year: "[[ Year ]]" },
  ],
};
