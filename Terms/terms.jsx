import styles from "./terms.module.css";

export default function Terms() {
  return (
    <main className={styles.page}>
      <h1>Terms of Service</h1>
      <p className={styles.updated}>Last updated: November 2026</p>

      <h2>1. Using PortfolioGenie</h2>
      <p>
        PortfolioGenie helps you build and publish a portfolio. By using the
        site you agree to these terms. If you don't agree, please don't use it.
      </p>

      <h2>2. Your account</h2>
      <p>
        You are responsible for your account and for keeping your login
        details safe. Please give us accurate information when you sign up.
      </p>

      <h2>3. Your content</h2>
      <p>
        You own the work you add to your portfolio. You allow us to store and
        display it so we can run the service, including showing your published
        portfolio to visitors and recruiters.
      </p>

      <h2>4. Acceptable use</h2>
      <ul>
        <li>Don't upload content that is illegal or that you don't have the right to share.</li>
        <li>Don't try to break, overload or misuse the service.</li>
        <li>Don't pretend to be someone else.</li>
      </ul>

      <h2>5. Changes</h2>
      <p>
        We may update these terms from time to time. When we do, we will change
        the date at the top of this page.
      </p>
    </main>
  );
}