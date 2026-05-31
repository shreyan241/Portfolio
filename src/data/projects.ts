import { asset } from "../lib/asset";

export type Project = {
  title: string;
  href: string;
  image: string;
  tags: string[];
  bullets: string[];
  demo?: string;
};

export const projects: Project[] = [
  {
    title: "Rubik's Cube 3D Visualizer & Deep RL Solver",
    href: "https://github.com/shreyan241/RL_rubiks_visualizer",
    image: asset("images/rubiks.webp"),
    tags: ["Reinforcement Learning", "Deep Learning"],
    demo: asset("demos/rubiks.webp"),
    bullets: [
      "Combined MCTS with custom ResNet policy/value networks trained via self-play on 10M+ game states.",
      "Achieved a 71% solve rate on 9-move scrambles with <1s inference through efficient search-space pruning.",
      "Built a 3D cube visualizer using quaternions for smooth rotation.",
    ],
  },
  {
    title: "MediLoRA: Medical Q&A LLM with QLoRA",
    href: "https://huggingface.co/Medilora/Medilora-Mistral-7B/tree/main",
    image: asset("images/fine-tune-loss.webp"),
    tags: ["Natural Language Processing", "Generative AI", "Deep Learning"],
    bullets: [
      "Fine-tuned a 7B medical LLM with QLoRA on 300M tokens (PubMed, medical textbooks).",
      "Achieved 20+ point accuracy gains on PubMedQA and MedQA.",
      "Matched 70B SOTA on MMLU-Medical using 0.05% of the training compute.",
    ],
  },
  {
    title: "Unfooling LIME and SHAP with Superior Sampling",
    href: "https://github.com/shreyan241/DSC-261-FINAL",
    image: asset("images/foolinglimeshap.webp"),
    tags: ["Interpretable AI", "Machine Learning"],
    bullets: [
      "Counteracted adversarial attacks on explainability techniques.",
      "Superior sampling using Tree Ensembles and RBF Generators.",
      "Robust sampling using Variational Auto Encoders and CT-GANs.",
    ],
  },
];
