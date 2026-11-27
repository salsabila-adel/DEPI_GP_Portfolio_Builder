import { useLayoutEffect, useRef } from "react";
import styles from "./landing_page.module.css";

const orbiters = [
  "Build an interactive portfolio in under ten minutes.",
  "Get matched with real jobs across MENA & Europe.",
  "Stay quietly discoverable while recruiters come to you.",
];

const stats = [
  { value: "4000+", label: "portfolios published" },
  { value: "< 10 min.", label: "to first published portfolio" },
  { value: "AI", label: "Powered Portfolio" },
];

const LAP_SECONDS = 40; // وقت اللفة الكاملة (أقل = أسرع)

export default function LandingPage() {
  const stageRef = useRef(null);
  const sunRef = useRef(null);
  const pillRefs = useRef([]);
  const pausedRef = useRef(false);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const sun = sunRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let angle = Math.PI / 6;
    let last = performance.now();
    let frame;

    const draw = () => {
      const cx = stage.clientWidth / 2;
      const rx = sun.offsetWidth / 2 + 8; // المدار بره القوس بشوية
      const ry = sun.offsetHeight + 28;

      pillRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = angle + (i * Math.PI * 2) / orbiters.length;
        const x = cx + rx * Math.cos(a);
        const y = ry * Math.sin(a); // المركز عند حافة الـ Navbar
        const depth = Math.max(Math.sin(a), 0);
        const fade = Math.min(Math.max(y / 70, 0), 1);

        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.88 + 0.12 * depth})`;
        el.style.opacity = fade;
      });
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!pausedRef.current) {
        angle += ((Math.PI * 2) / LAP_SECONDS) * dt;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(stage);
    if (!reduceMotion) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  return (
    <main className={styles.hero}>
      <section className={styles.stage} ref={stageRef}>
        <div className={styles.sun} ref={sunRef} aria-hidden="true" />

        <h1 className={styles.headline}>
          <span className={styles.line1}>Your work, beautifully told.</span>
          <span className={styles.line2}>Your portfolio, ready to be found.</span>
        </h1>

        {orbiters.map((text, i) => (
          <p
            key={text}
            className={styles.pill}
            ref={(el) => (pillRefs.current[i] = el)}
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
          >
            {text}
          </p>
        ))}
      </section>

      <p className={styles.eyebrow}>✨ A little space for your best work</p>

      <button type="button" className={styles.cta}>
        Start Building Free
      </button>

      <ul className={styles.stats}>
        {stats.map(({ value, label }) => (
          <li key={label} className={styles.stat}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

