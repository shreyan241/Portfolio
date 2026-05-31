import { asset } from "../lib/asset";

export const profile = {
  name: "Shreyan Sood",
  location: "Austin, TX",
  role: "ML Engineer & Data Scientist",
  photo: asset("images/shreyan_photo.webp"),
  resume: asset("Shreyan_Resume.pdf"),
  email: "shreyansood@gmail.com",
  // Phrases cycled by the hero typewriter
  typewriter: [
    "a Machine Learning Engineer.",
    "a Data Scientist.",
    "an Applied Scientist.",
    "an Agentic AI builder.",
  ],
  intro:
    "I build agentic AI systems, large-scale distributed data infrastructure, and causal models that measure real impact. Currently an Analytics Engineer at Amazon, with an MS in Data Science from UCSD and peer-reviewed research in machine learning.",
  socials: {
    github: "https://github.com/shreyan241",
    linkedin: "https://www.linkedin.com/in/shreyan-sood-68aa71127/",
    email: "mailto:shreyansood@gmail.com",
  },
} as const;

export const skills: { category: string; items: string[] }[] = [
  {
    category: "Languages",
    items: ["Python", "SQL", "JavaScript", "C++", "R", "MATLAB"],
  },
  {
    category: "ML & AI",
    items: [
      "Agentic AI / LLMs",
      "PyTorch",
      "TensorFlow",
      "Reinforcement Learning",
      "Causal Inference",
    ],
  },
  {
    category: "Data & Infra",
    items: [
      "Spark",
      "AWS",
      "PostgreSQL",
      "Docker",
      "Distributed Pipelines",
      "React / Next.js",
    ],
  },
];

export type Education = {
  school: string;
  degree: string;
  detail: string;
  period: string;
};

export const education: Education[] = [
  {
    school: "University of California, San Diego",
    degree: "M.S., Data Science",
    detail: "GPA 3.98 / 4.0",
    period: "2022 - 2024",
  },
  {
    school: "Delhi Technological University",
    degree: "B.Tech, Mathematics & Computing Engineering",
    detail: "CGPA 8.73 / 10",
    period: "2018 - 2022",
  },
];
