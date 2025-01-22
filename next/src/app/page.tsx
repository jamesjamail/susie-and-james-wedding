import styles from "./page.module.css";
import Header from "./components/Header/Header";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1>Susie and James Wedding</h1>
      </main>
    </div>
  );
}
