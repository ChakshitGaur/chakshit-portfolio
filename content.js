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
  role: "Python Developer · AI/ML Engineer",
  // Hero (top of the page).
  hero: {
    eyebrow: "Python developer · AI/ML engineer",
    headline: "Python developer turning messy data into working software.",
    accent: "working software.", // the part of the headline shown in the accent colour
    // Line under the headline: the last words scramble from one phrase to the next.
    rotatingPrefix: "Currently into",
    rotating: ["automation", "data pipelines", "machine learning", "Django back ends"],
  },

  // Terminal in the hero. t: "cmd" (typed after a $ prompt), "code" (a line of Python), "out" (program output).
  // Keep it to facts from your resume.
  terminal: [
    { t: "cmd", s: "cat about.py" },
    { t: "code", s: 'name = "Chakshit Gaur"' },
    { t: "code", s: 'role = "Python Developer & AI/ML Engineer"' },
    { t: "code", s: 'location = "New Delhi, India"' },
    { t: "code", s: 'stack = ["Python", "Django", "SQL", "Pandas", "TensorFlow"]' },
    { t: "code", s: 'experience = "AI/ML Engineer @ Isourse Technologies"' },
    { t: "code", s: "applicants_managed = 5000  # in the ATS I built" },
    { t: "code", s: 'print(f"{name} | {role} | {location}")' },
    { t: "cmd", s: "python about.py" },
    { t: "out", s: "Chakshit Gaur | Python Developer & AI/ML Engineer | New Delhi, India" },
  ],

  // Core stack: your five headline skills, each with one line of proof.
  // "match" words are compared with project tags: hovering a card highlights the projects that use it.
  // A proof line left as a [[ placeholder ]] is shown dashed in preview mode and hidden otherwise.
  core: [
    { name: "Python", proof: "Automation tool, ATS, video pipeline", match: ["python"] },
    { name: "Django", proof: "Expense tracker web app", match: ["django"] },
    { name: "SQL", proof: "ATS with 5,000+ applicants", match: ["sql"] },
    { name: "Pandas", proof: "Data cleaning, book recommender", match: ["pandas"] },
    { name: "Machine learning", proof: "Disease prediction, recommender", match: ["machine learning", "svm", "logistic", "recommender"] },
  ],

  // Optional status shown in the hero, e.g. "Open to work". Leave as placeholder to hide.
  status: "[[ e.g. Open to work ]]",

  location: "New Delhi, India",

  links: {
    email: "chakshitgaur25@gmail.com",
    linkedin: "[[ paste your LinkedIn profile URL ]]",
    github: "[[ paste your GitHub profile URL ]]",
  },

  resumeFile: "assets/ChakshitGaur_resume.pdf",

  about: [
    "I'm a Computer Science graduate (B.Tech, 2023) based in New Delhi. I started my career as an **AI/ML Engineer**, " +
      "where I built **internal tools and client systems end to end**, from data collection and storage to packaging and documentation.",
    "My core toolkit is **Python, Django and SQL**, with Pandas and NumPy for cleaning data and machine-learning frameworks such as " +
      "TensorFlow, PyTorch and YOLO. I'm comfortable with object-oriented design and enjoy turning **messy data and manual processes into reliable software**.",
  ],

  // Only facts taken from the resume. Add more numbers here once you have real ones.
  stats: [
    { value: "1+ yr", label: "Professional experience" },
    { value: "3", label: "Projects built at Isourse" },
    { value: "3", label: "Personal projects" },
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
          name: "Employee Management System",
          text:
            "Built a system that monitors workforce productivity through keyboard-activity tracking and idle-time detection. " +
            "Packaged it as a standalone executable for simple deployment across machines, with full documentation and user support.",
          tags: ["Python", "Desktop executable", "Activity tracking"],
        },
        {
          name: "Applicant Tracking System (ATS)",
          text:
            "Developed an ATS that uses Selenium to extract LinkedIn data, designed to meet GDPR and CCPA requirements. " +
            "Built the storage layer in Python and SQL and integrated it with HR systems to manage 5,000+ applicants, " +
            "then documented it and trained HR staff to use it.",
          tags: ["Python", "Selenium", "SQL", "GDPR / CCPA"],
        },
        {
          name: "Live-stream video sync for FM Logistics",
          text:
            "Built a pipeline for FM Logistics that collects live-stream data, captures two video feeds and synchronises them. " +
            "Videos are stitched by matching timestamps, so users receive one seamless combined video.",
          tags: ["Python", "Video processing", "Stream synchronisation"],
        },
      ],
      tags: [],
    },
  ],

  projects: [
    {
      name: "Multiple Disease Prediction System",
      category: "Machine Learning",
      visual: "scatter", // card artwork: "scatter", "graph" or "bars"
      problem: "Early detection of Parkinson's disease, heart disease and diabetes from patient data.",
      approach:
        "Trained machine-learning classifiers for each condition, using logistic regression and support vector machines for predictive modelling.",
      stack: ["Python", "Machine Learning", "Logistic Regression", "SVM"],
      metric: "[[ e.g. 'Reached 8x% accuracy on the heart-disease model': only if true ]]",
      github: "[[ GitHub repo URL ]]",
      demo: "[[ Live demo URL (optional) ]]",
    },
    {
      name: "Book Recommendation System",
      category: "Recommender System",
      visual: "graph",
      problem: "Suggesting books readers are likely to enjoy, based on their ratings and similar readers.",
      approach:
        "Collaborative filtering on a book-ratings dataset: preprocessed and analysed the data, then computed user and item similarities to produce personalised recommendations.",
      stack: ["Python", "NumPy", "Pandas", "Scikit-learn"],
      metric: "[[ optional: dataset size or an evaluation score ]]",
      github: "[[ GitHub repo URL ]]",
      demo: "[[ Live demo URL (optional) ]]",
    },
    {
      name: "Expense Tracker",
      category: "Web app · Django",
      visual: "donut",
      // Check these lines against what you actually built, and add real features (categories, charts, login...) below.
      problem: "Keeping track of everyday spending in one place.",
      approach: "A Django web app for recording and reviewing personal expenses, built with Django's models, views and templates.",
      stack: ["Python", "Django"],
      metric: "[[ optional: a real feature or number, e.g. 'Expenses grouped by category' ]]",
      github: "[[ GitHub repo URL ]]",
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
    { group: "Languages", items: ["Python", "SQL"] },
    { group: "Backend", items: ["Django", "Django REST Framework", "REST APIs"] },
    { group: "Data cleaning & analysis", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn"] },
    { group: "ML & automation", items: ["TensorFlow", "PyTorch", "YOLO", "Selenium"] },
    { group: "Databases", items: ["Oracle SQL", "MySQL", "SQL joins & query optimisation"] },
    { group: "Tools", items: ["Git & GitHub", "VS Code", "Jupyter Notebook", "Power BI"] },
  ],

  education: [
    {
      title: "B.Tech, Computer Science & Engineering",
      org: "D.P.G Institute of Technology and Management, Gurugram",
      period: "2019 – 2023",
    },
    {
      title: "Class XII",
      org: "Shri Krishna Parnami Sr. Sec. School, Karnal",
      period: "2018",
    },
    {
      title: "Class X",
      org: "V.P International School, Karnal",
      period: "2016",
    },
  ],

  // Hidden until you fill in at least a name.
  certifications: [
    { name: "[[ Course or certification name ]]", issuer: "[[ Issuer ]]", year: "[[ Year ]]" },
    { name: "[[ Another one ]]", issuer: "[[ Issuer ]]", year: "[[ Year ]]" },
  ],
};
