// lib/data/curricula.ts
import { Curriculum } from "../types/content";

export const curricula: Curriculum[] = [
  {
    slug: "bible-characters",
    number: "01",
    title: { ar: "شخصيات الكتاب المقدس", en: "Bible Characters" },
    duration: { ar: "سنتان", en: "2 years" },
    audience: { ar: "حضانة وأولى ابتدائي", en: "Nursery & 1st grade" },
    description: { 
      ar: "مدخل مناسب لبناء معرفة أولية بشخصيات الكتاب المقدس وأحداثه الأساسية.", 
      en: "A suitable introduction to building primary knowledge of Bible characters and key events." 
    },
    ageRange: { ar: "٤ – ٦ سنوات", en: "4–6 years" },
    badge: "Level 1",
  },
  {
    slug: "biblical-concepts",
    number: "02",
    title: { ar: "مفاهيم كتابية للأطفال", en: "Biblical Concepts for Children" },
    duration: { ar: "سنتان", en: "2 years" },
    audience: { ar: "ثانية وثالثة ابتدائي", en: "2nd & 3rd grade" },
    description: { 
      ar: "منهج يساعد الأطفال على فهم المفاهيم الكتابية الأساسية بطريقة مناسبة لأعمارهم.", 
      en: "A curriculum that helps children understand basic biblical concepts in an age-appropriate way." 
    },
    ageRange: { ar: "٧ – ٩ سنوات", en: "7–9 years" },
    badge: "Level 2",
  },
  {
    slug: "extended-study",
    number: "03",
    title: { ar: "دراسة موسعة في الكتاب المقدس", en: "Extended Bible Study" },
    duration: { ar: "أربع سنوات", en: "4 years" },
    audience: { ar: "من رابعة ابتدائي حتى أولى إعدادي", en: "4th grade to 7th grade" },
    description: { 
      ar: "رحلة أعمق في دراسة الكتاب المقدس بشكل منظم ومتدرج.", 
      en: "A deeper journey in organized and progressive Bible study." 
    },
    ageRange: { ar: "١٠ – ١٣ سنة", en: "10–13 years" },
    badge: "Level 3",
  },
  {
    slug: "servant-prep",
    number: "04",
    title: { ar: "إعداد خدام مدرسة كتاب مقدس", en: "Bible School Servant Preparation" },
    duration: { ar: "ثلاث سنوات", en: "3 years" },
    audience: { ar: "من ثانية إعدادي حتى أولى ثانوي", en: "8th grade to 10th grade" },
    description: { 
      ar: "منهج يهدف إلى إعداد جيل متدرج نحو الخدمة والفهم الأعمق والمسؤولية.", 
      en: "A curriculum aimed at preparing a generation towards service, deeper understanding, and responsibility." 
    },
    ageRange: { ar: "١٤ – ١٦ سنة", en: "14–16 years" },
    badge: "Mastery",
  },
];

export function getCurriculumBySlug(slug: string) {
  return curricula.find(c => c.slug === slug);
}

export function getAllCurriculaSlugs() {
  return curricula.map(c => c.slug);
}
