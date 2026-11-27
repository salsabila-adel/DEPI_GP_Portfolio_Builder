// =========================================================
// api.js — كل الكلام مع السيرفر في مكان واحد
//
// دلوقتي USE_SAMPLE_DATA = true يعني بنرجّع بيانات تجريبية عشان تشوف الشكل.
// لما الـ backend يجهز: غيّرها لـ false وعدّل الروابط (/api/...) لو مختلفة.
// جرّب كمان تخلّي samplePortfolios = [] عشان تشوف حالة "مفيش بورتفوليوهات".
// =========================================================

const USE_SAMPLE_DATA = true;

const sampleProfile = {
  name: "Nour Hassan",
  jobTitle: "Frontend developer",
  location: "Cairo",
  bio: "Building fast, accessible interfaces.",
  githubUrl: "https://github.com/nour-hassan",
  photoUrl: "", // فاضية = بيظهر الدايرة المتدرجة
  publicUrl: "", // لينك البورتفوليو العام (بيتنسخ بزرار Share)
  views: 1248,
  githubStars: 608,
};

const samplePortfolios = [
  { id: 1, title: "Developer Portfolio", template: "Terminal", status: "live", updated: "2 days ago", projects: 3 },
  { id: 2, title: "Freelance Showcase", template: "Case study", status: "live", updated: "last week", projects: 5 },
  { id: 3, title: "Job Search 2026", template: "Journal", status: "draft", updated: "", projects: 2 },
];

// بتأخّر الرد شوية عشان تحاكي السيرفر
function wait(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProfile() {
  if (USE_SAMPLE_DATA) {
    await wait();
    return sampleProfile;
  }
  const response = await fetch("/api/me");
  if (!response.ok) throw new Error("Could not load your profile.");
  return response.json();
}

export async function getPortfolios() {
  if (USE_SAMPLE_DATA) {
    await wait();
    return samplePortfolios;
  }
  const response = await fetch("/api/portfolios");
  if (!response.ok) throw new Error("Could not load your portfolios.");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function deletePortfolio(id) {
  if (USE_SAMPLE_DATA) {
    await wait(200);
    return;
  }
  const response = await fetch(`/api/portfolios/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Could not delete the portfolio.");
}

// رابط تحميل الـ PDF (السيرفر هو اللي هيعمله)
export function getPortfolioPdfUrl(id) {
  return `/api/portfolios/${id}/pdf`;
}