export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  href: string;
  summary: string;
};

export const publications: Publication[] = [
  {
    title: "Black-Scholes Option Pricing Using Machine Learning",
    authors: "S. Sood, T. Jain, N. Batra, H. C. Taneja",
    venue: "ICDSA",
    year: "2023",
    href: "https://link.springer.com/chapter/10.1007/978-981-19-6631-6_34",
    summary:
      "Outperformed the classical Black-Scholes model using MLP and LSTM networks, benchmarked against XGBoost and SVM.",
  },
  {
    title: "Selective Lossy Image Compression for Autonomous Systems",
    authors: "S. Sood, Y. Ahuja",
    venue: "STSIVA",
    year: "2021",
    href: "https://ieeexplore.ieee.org/document/9591673",
    summary:
      "Self-devised K-Means, Genetic Algorithm, and DCT pipelines integrated with CenterNet and Faster R-CNN for object-aware compression.",
  },
];
