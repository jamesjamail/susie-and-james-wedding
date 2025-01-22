import styles from "../page.module.css";
import Header from "../components/Header/Header";

export default function About() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1>About</h1>
      </main>
    </div>
  );
}
