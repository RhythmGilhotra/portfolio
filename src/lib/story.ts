// All narrative content, sourced from Rhythm Gilhotra's resumes.
// Rewritten as story beats — never copied resume prose.

export const CHAPTERS = [
  "Arrival",
  "Origins",
  "The Ascent",
  "The Command Center",
  "Artifacts",
  "Constellation",
  "Monuments",
  "Transmission",
] as const;

export type ChapterName = (typeof CHAPTERS)[number];

export const identity = {
  name: "Rhythm Gilhotra",
  role: "Software & Data Engineer",
  tagline: "I build the invisible systems money moves through.",
  location: "Gurugram, India",
  email: "rhythm.gilhotra@gmail.com",
  linkedin: "https://www.linkedin.com/in/rhythmgilhotra",
  years: "4+ years engineering real-time financial infrastructure",
};

export const origins = {
  kicker: "Chapter 01 · Origins",
  title: "Every system begins as a question.",
  body: "Thapar Institute of Engineering & Technology, 2017–2021. Computer Engineering. Four years spent taking apart distributed systems, operating systems, networks and databases — and learning that elegance is a property of constraints, not decoration.",
  facts: [
    { label: "Degree", value: "B.E. Computer Engineering" },
    { label: "Institute", value: "Thapar University, Patiala" },
    { label: "Years", value: "2017 — 2021" },
    { label: "Obsessions", value: "Distributed systems · Networks · Databases" },
  ],
  leadership:
    "Student leader — ran workshops on backend engineering and data systems, pulling peers into building distributed projects together.",
};

export const ascent = {
  kicker: "Chapter 02 · The Ascent",
  title: "One company. Three altitudes.",
  intro:
    "Five years inside American Express, climbing the same mountain from different faces — intern to engineer to the person others rope up with.",
  peaks: [
    {
      role: "Engineering Intern",
      period: "Jan — Jun 2021",
      alt: "Base camp",
      story:
        "Took legacy reporting and made it breathe in real time. Streaming risk dashboards, 60% fresher data, query runtimes cut in half, and validation that removed humans from the QA loop.",
    },
    {
      role: "Engineer I",
      period: "Aug 2021 — May 2023",
      alt: "The climb",
      story:
        "Distributed ETL at scale: a 6-hour compute grind compressed to 90 minutes, quarter-close accelerated by 2+ days. Credit-risk APIs wired into underwriting — early delinquencies down 12%. Pipelines that watch themselves: SLAs, retries, failover, 99.9% uptime.",
    },
    {
      role: "Engineer II",
      period: "May 2023 — Present",
      alt: "The summit ridge",
      story:
        "Architect of a real-time transaction system on GCP — 30M+ events a day, latency collapsed from 15 seconds to under 5. A/B infrastructure with telemetry, feature flags, automated rollback. Release velocity tripled with zero Sev-1s at 99.99% uptime. Mentor to 4+ engineers.",
    },
  ],
};

export const commandCenter = {
  kicker: "Chapter 03 · The Command Center",
  title: "30,000,000 events a day pass through this room.",
  body: "The real-time transaction processing system: Pub/Sub feeds Dataflow, Dataflow feeds microservices, decisions leave the building in under five seconds. Around it — the fraud and credit-risk platform: signal freshness up 70%, approval accuracy up 15%, false positives down 17%, fraud investigations answered 40% faster.",
  stats: [
    { value: "30M+", label: "events processed daily" },
    { value: "15s → <5s", label: "decision latency, collapsed" },
    { value: "99.99%", label: "uptime, zero Sev-1 incidents" },
    { value: "3×", label: "release velocity via CI/CD" },
    { value: "40%", label: "faster incident detection" },
    { value: "70%", label: "fresher model signals" },
  ],
  pipeline: ["Pub/Sub", "Dataflow", "Microservices", "BigQuery", "Decision"],
};

export const artifacts = {
  kicker: "Chapter 04 · Artifacts",
  title: "Things built with intent.",
  projects: [
    {
      name: "Distributed Network Intrusion Detection",
      place: "Thapar Institute · 2020",
      story:
        "A distributed sentinel reading 10,000+ packets every second, TensorFlow models hunting anomalies in live traffic. Modular ingestion and alerting APIs cut false positives by 20%. Shipped in Docker, watched through Grafana.",
      tech: ["Python", "TensorFlow", "Docker", "Grafana"],
    },
    {
      name: "Scalable Transaction Data Pipeline",
      place: "American Express collaboration · 2020",
      story:
        "Millions of transaction records a day flowing through Hadoop, Spark and Kafka. Fault-tolerant ingestion with SLA monitoring and retries pushed data freshness up 40% — real-time insight for fraud-risk operations.",
      tech: ["Hadoop", "Spark", "Kafka", "SLA monitoring"],
    },
  ],
};

export const constellation = {
  kicker: "Chapter 05 · Constellation",
  title: "A sky of tools, held together by systems thinking.",
  clusters: [
    { name: "Languages", stars: ["Python", "Java", "Kotlin", "SQL", "Bash"] },
    {
      name: "Cloud & Infra",
      stars: ["GCP", "Kubernetes", "Docker", "Terraform", "Cloud Build"],
    },
    {
      name: "Data in Motion",
      stars: ["Kafka", "Pub/Sub", "Dataflow", "Spark", "Airflow", "BigQuery", "Hive"],
    },
    {
      name: "Frameworks",
      stars: ["Spring Boot", "FastAPI", "Flask", "gRPC"],
    },
    {
      name: "Observability",
      stars: ["Prometheus", "Grafana", "ELF Logging", "Looker"],
    },
  ],
};

export const monuments = {
  kicker: "Chapter 06 · Monuments",
  title: "Marks left on the landscape.",
  awards: [
    {
      name: "Star Award",
      org: "American Express",
      when: "Q1 2025",
      story:
        "For leading real-time fraud detection platform deployments — reliability and scale across global markets.",
    },
    {
      name: "Analyst of the Quarter",
      org: "American Express",
      when: "Q1 2024",
      story:
        "For high-impact enhancements to risk infrastructure and backend systems.",
    },
    {
      name: "Analyst of the Quarter",
      org: "American Express",
      when: "Q3 2022",
      story:
        "For mission-critical pipeline optimization and measurable operational efficiency.",
    },
  ],
  mentorship:
    "Tech Lead & Mentor — guiding 4+ engineers through scalable design, observability, distributed tracing and the quiet craft of on-call ownership.",
};

export const transmission = {
  kicker: "Chapter 07 · Transmission",
  title: "The journey continues elsewhere.",
  body: "If you build systems that matter — and want someone who treats reliability as a craft — the channel is open.",
};

export const terminalLines = [
  "$ whoami",
  "rhythm.gilhotra — software & data engineer, gurugram",
  "$ uptime",
  "4+ years · 99.99% availability · zero sev-1 incidents",
  "$ tail -f /var/log/career.log",
  "[2021-01] amex: intern — streaming risk dashboards, latency -60%",
  "[2021-08] amex: engineer I — etl 6h→90m, quarter-close -2 days",
  "[2023-05] amex: engineer II — 30M+ events/day, 15s→<5s",
  "[2025-Q1] award: star award — global fraud platform deployments",
  "$ echo $STACK",
  "python java kotlin sql · gcp k8s docker · kafka spark dataflow bigquery",
  "$ contact --open-channel",
  "rhythm.gilhotra@gmail.com · linkedin.com/in/rhythmgilhotra",
  "$ _",
];
