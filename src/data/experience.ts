import { asset } from "../lib/asset";

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  year: string;
  logo: string;
  bullets: string[];
};

export const experiences: Experience[] = [
  {
    role: "Analytics Engineer",
    company: "Amazon",
    location: "Austin, Texas",
    period: "Jun 2025 - Present",
    year: "2025",
    logo: asset("images/amazon_logo2.webp"),
    bullets: [
      "Built causal ML models (Causal Forest, doubly-robust estimators) decomposing A/B effects into product-level impact across 10M+ products.",
      "Redesigned a large-scale experiment after finding the top 1% of products drove 75% of effect, saving $500K+ in costs.",
      "Developed an AI analytics agent (MCP architecture) fine-tuned on internal schemas for natural-language SQL/Python exploration.",
      "Architected distributed pipelines processing terabytes daily to power large-scale causal experimentation.",
    ],
  },
  {
    role: "Machine Learning Engineer",
    company: "Prompt Inversion AI",
    location: "Dover, Delaware",
    period: "Sep 2024 - Jun 2025",
    year: "2024",
    logo: asset("images/PI_logo.webp"),
    bullets: [
      "Built an agentic spam classifier benchmarking 6 frameworks (LangGraph, AutoGen, CrewAI) with RLHF, hitting 97% accuracy on 500K+ daily messages.",
      "Built an LLM red-teaming platform with 10+ jailbreak algorithms, stress-testing DeepSeek-R1/V3 across 5,000+ adversarial scenarios.",
      "Re-architected a FastAPI backend (async, Redis caching, pooling) to handle 100K+ requests/day, cutting response time 60%.",
      "Engineered multi-stage candidate ranking (vector retrieval + LLM scoring), improving accuracy 40% over baseline across 10K+ resumes.",
    ],
  },
  {
    role: "Analytical Scientist Intern",
    company: "FICO",
    location: "San Diego, California",
    period: "Jun - Dec 2023",
    year: "2023",
    logo: asset("images/FICO.webp"),
    bullets: [
      "Built an automated drift-monitoring system for production fraud models across 15 enterprise clients, cutting false positives 90%.",
      "Productionized an unsupervised clustering pipeline (t-SNE) to surface emerging fraud patterns and trigger proactive retraining.",
    ],
  },
  {
    role: "AI Engineer",
    company: "Collablens",
    location: "Haryana, India",
    period: "Feb - Aug 2022",
    year: "2022",
    logo: asset("images/Collablens.webp"),
    bullets: [
      "Engineered production CV systems for manufacturing QC, including an edge-cloud spillage detection pipeline with real-time streaming.",
      "Built a laser-engraving defect classifier reaching 95% accuracy at 2.5s inference for automated assembly-line QC.",
    ],
  },
];
