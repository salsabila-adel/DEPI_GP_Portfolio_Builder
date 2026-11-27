import styles from "./privacy.module.css";

export default function Privacy() {
  return (
    <main className={styles.page}>
      <h1>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: November 2026</p>

      <h2>What we collect</h2>
      <ul>
        <li>Your name, email and profile photo.</li>
        <li>The portfolios and projects you create.</li>
        <li>Basic usage data, such as how many times your portfolio is viewed.</li>
      </ul>

      <h2>GitHub data</h2>
      <p>
        If you connect GitHub, we read your public repositories and stars to
        build your portfolio. We don't change anything on your GitHub account.
      </p>

      <h2>How we use it</h2>
      <p>
        We use your data to run PortfolioGenie, show your published portfolio,
        and help recruiters find you when you choose to be discoverable.
      </p>

      <h2>Sharing</h2>
      <p>
        We don't sell your personal data. Your published portfolio is public,
        so only publish what you are happy for others to see.
      </p>

      <h2>Your choices</h2>
      <p>
        You can edit or delete your portfolios at any time, and you can ask us
        to delete your account and data.
      </p>
    </main>
  );
}