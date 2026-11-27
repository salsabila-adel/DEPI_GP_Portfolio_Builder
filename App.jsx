import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar/navbar.jsx";
import LandingPage from "./Component/Landing_Page/landing_page.jsx";
import ProfilePage from "./Component/Profile_Page/profile_page.jsx";
import Footer from "./Component/Footer/footer.jsx";
import Terms from "./Component/Terms/terms.jsx"
import Privacy from "./Component/Privacy/privacy.jsx"

export default function App() {
  // الثيم محفوظ هنا (في أعلى التطبيق) عشان أي صفحة تقدر تتأثر بيه
  // "dark" هو الافتراضي، ولو المستخدم اختار light قبل كده بنرجّعه
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  // كل ما الثيم يتغير: نكتبه على <html> (CSS بيقرأه) ونحفظه في المتصفح
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        </Routes>
      <Footer />
    </>
  );
}