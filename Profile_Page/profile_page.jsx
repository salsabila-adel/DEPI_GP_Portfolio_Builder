import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  getProfile,
  getPortfolios,
  deletePortfolio,
  getPortfolioPdfUrl,
} from "../../api.js";
import styles from "./profile_page.module.css";

function PortfolioCard({ portfolio, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // اقفل القايمة لو دوست بره الكارت أو ضغطت Escape
  useEffect(() => {
    if (!menuOpen) return undefined;

    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    }
    function handleEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  function handleDeleteClick() {
    setMenuOpen(false);
    if (window.confirm(`Delete "${portfolio.title}"? This can't be undone.`)) {
      onDelete(portfolio.id);
    }
  }

  const isDraft = portfolio.status === "draft";
  const meta = `${portfolio.template} template · ${
    isDraft ? "Draft" : `Updated ${portfolio.updated}`
  }`;

  return (
    <article className={styles.card}>
      <div className={styles.thumb}>
        <div className={styles.menuWrap} ref={menuRef}>
          <button
            type="button"
            className={styles.dots}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={`Options for ${portfolio.title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <i className="bi bi-three-dots" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div className={styles.menu} role="menu">
              <Link
                to={`/portfolios/${portfolio.id}/edit`}
                className={styles.menuItem}
                role="menuitem"
              >
                <i className="bi bi-pencil" aria-hidden="true" /> Edit
              </Link>
              <a
                href={getPortfolioPdfUrl(portfolio.id)}
                download
                className={styles.menuItem}
                role="menuitem"
              >
                <i className="bi bi-download" aria-hidden="true" /> Download as PDF
              </a>
              <button
                type="button"
                className={`${styles.menuItem} ${styles.danger}`}
                role="menuitem"
                onClick={handleDeleteClick}
              >
                <i className="bi bi-trash" aria-hidden="true" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3>{portfolio.title}</h3>
      <p className={styles.meta}>{meta}</p>
      <ul className={styles.tags}>
        <li>{isDraft ? "Draft" : "Live"}</li>
        <li>{portfolio.projects} projects</li>
      </ul>
    </article>
  );
}

/* =========================================================
   صفحة البروفايل
   ========================================================= */
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // 1) تحميل البيانات مرة واحدة أول ما الصفحة تفتح
  useEffect(() => {
    let ignore = false; // لو المستخدم سابَ الصفحة قبل ما البيانات توصل

    async function loadData() {
      try {
        const [profileData, portfoliosData] = await Promise.all([
          getProfile(),
          getPortfolios(),
        ]);
        if (ignore) return;
        setProfile(profileData);
        setPortfolios(portfoliosData);
      } catch (err) {
        if (!ignore) setError(err.message || "Something went wrong.");
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  // 2) تنضيف رابط معاينة الصورة من الذاكرة
  useEffect(() => {
    if (!photoPreview) return undefined;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  // 3) رجّع نص زرار Share لأصله بعد ثانيتين
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoPreview(URL.createObjectURL(file));
    // TODO: ارفع الصورة للسيرفر هنا لما الـ API يجهز
  }

  async function handleShare() {
    const link = profile.publicUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      alert("Could not copy the link. Copy it from the address bar instead.");
    }
  }

  async function handleDelete(id) {
    try {
      await deletePortfolio(id);
      setPortfolios((current) => current.filter((item) => item.id !== id));
    } catch {
      alert("Could not delete the portfolio. Please try again.");
    }
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.error} role="alert">{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className={styles.page}>
        <p className={styles.loading} role="status">Loading your profile...</p>
      </main>
    );
  }

  const photo = photoPreview || profile.photoUrl;
  const subtitle = [profile.jobTitle, profile.location].filter(Boolean).join(" · ");
  const githubText = profile.githubUrl?.replace(/^https?:\/\//, "");

  return (
    <main className={styles.page}>
      {/* ---------- الهيدر: الصورة + البيانات + الأزرار + الإحصائيات ---------- */}
      <section className={styles.profileHeader}>
        {/* الصورة نفسها زرار: دوس عليها واختار صورة جديدة */}
        <label className={styles.avatar} title="Change photo">
          {photo ? (
            <img src={photo} alt={`${profile.name}'s profile photo`} />
          ) : (
            <span className={styles.avatarFallback} />
          )}
          <span className={styles.avatarOverlay} aria-hidden="true">
            <i className="bi bi-camera-fill" />
          </span>
          <span className={styles.visuallyHidden}>Change profile photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className={styles.visuallyHidden}
          />
        </label>

        <div className={styles.about}>
          <h1>{profile.name}</h1>
          {subtitle && <p>{subtitle}</p>}
          {profile.bio && <p>{profile.bio}</p>}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
              {githubText}
            </a>
          )}
        </div>

        <div className={styles.editPart}>
          <Link to="/profile/edit" className={styles.btn}>Edit profile</Link>
          <Link to="/companies" className={`${styles.btn} ${styles.btnPrimary}`}>
            Reach companies
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className={styles.btn}
            aria-live="polite"
          >
            {copied ? "Link copied!" : "Share"}
          </button>
        </div>

        <div className={styles.statistics}>
          <div>
            <span className={styles.statValue}>{portfolios.length}</span>
            <span className={styles.statLabel}>portfolios</span>
          </div>
          <div>
            <span className={styles.statValue}>
              {(profile.views ?? 0).toLocaleString("en-US")}
            </span>
            <span className={styles.statLabel}>views</span>
          </div>
          <div>
            <span className={styles.statValue}>
              {(profile.githubStars ?? 0).toLocaleString("en-US")}
            </span>
            <span className={styles.statLabel}>GitHub stars</span>
          </div>
        </div>
      </section>

      <hr />

      {/* ---------- My portfolios ---------- */}
      <section className={styles.myPortfolios}>
        <div className={styles.titleOfPortfolios}>
          <h2>My portfolios</h2>
          <Link to="/portfolios/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            + New portfolio
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className={styles.empty}>
            <p>No portfolios yet.</p>
            <p>Connect GitHub or add a new portfolio and it will show up here.</p>
          </div>
        ) : (
          <div className={styles.portfolioList}>
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}