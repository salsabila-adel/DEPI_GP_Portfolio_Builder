import { Link } from "react-router-dom";
import styles from "./footer.module.css";


// الفوتر المشترك: بيظهر أسفل كل الصفحات (متركّب في App.jsx)
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} PortfolioGenie ·{" "}
        <Link to="/terms">Terms</Link> · <Link to="/privacy">Privacy</Link>
      </p>
    </footer>
  );
}