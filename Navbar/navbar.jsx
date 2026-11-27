import { Link, NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./navbar.module.css";

const links = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "How it works", to: "/how-it-works" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contacts" },
  { label: "ProfilePage", to: "/ProfilePage" },
];

// الـ Navbar بيستلم الثيم والدالة اللي بتبدّله من App.jsx (props)
export default function Navbar({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo} aria-label="PortfolioGenie home">
        <span className={styles.logoBox}>P</span>
        <span className={styles.logoText}>
          Portfolio<span className={styles.logoAccent}>Genie</span>
        </span>
      </Link>

      <nav className={styles.nav}>
        {links.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.actions}>
        <Link to="/login" className={styles.loginButton}>
          Log in
        </Link>

        <Link to="/signup" className={styles.signupButton}>
          Sign up
        </Link>

        {/* زرار الشمس / القمر */}
        <button
          type="button"
          className={styles.themeButton}
          onClick={onToggleTheme}
          aria-label={isDark ? "Change to light mode" : "Change to dark mode"}
        >
          <i
            className={`bi ${isDark ? "bi-moon-fill" : "bi-sun-fill"}`}
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}