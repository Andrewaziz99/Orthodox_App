// lib/data/features.ts
import { Feature } from "../types/content";

export const appFeatures: Feature[] = [
  { id: "lessons", label: { ar: "دروس أسبوعية منظمة", en: "Organized weekly lessons" }, icon: "BookOpen" },
  { id: "assignments", label: { ar: "واجبات وامتحانات", en: "Assignments & exams" }, icon: "ClipboardCheck" },
  { id: "badges", label: { ar: "نقاط وشارات تشجيعية", en: "Encouraging points & badges" }, icon: "Award" },
  { id: "marathons", label: { ar: "ماراثونات كتابية", en: "Biblical marathons" }, icon: "Trophy" },
  { id: "reports", label: { ar: "تقارير ومتابعة", en: "Reports & tracking" }, icon: "BarChart3" },
  { id: "bible", label: { ar: "كتاب مقدس داخل التطبيق", en: "Bible within the app" }, icon: "Book" },
  { id: "notifications", label: { ar: "تواصل وإشعارات", en: "Communication & notifications" }, icon: "Bell" },
  { id: "store", label: { ar: "متجر للمكافآت بالنقاط", en: "Rewards store with points" }, icon: "ShoppingBag" },
];
