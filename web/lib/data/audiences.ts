// lib/data/audiences.ts
import { Audience } from "../types/content";

export const audiences: Audience[] = [
  {
    id: "churches",
    title: { ar: "الكنائس", en: "Churches" },
    icon: "Church",
    color: "teal",
    features: [
      "audience.churches.feature1",
      "audience.churches.feature2",
      "audience.churches.feature3",
    ]
  },
  {
    id: "servants",
    title: { ar: "الخدام", en: "Servants" },
    icon: "Users",
    color: "amber",
    features: [
      "audience.servants.feature1",
      "audience.servants.feature2",
      "audience.servants.feature3",
    ]
  },
  {
    id: "children",
    title: { ar: "المخدومون", en: "Children" },
    icon: "GraduationCap",
    color: "purple",
    features: [
      "audience.children.feature1",
      "audience.children.feature2",
      "audience.children.feature3",
    ]
  }
];
