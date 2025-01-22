import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Image
          src="/images/IMG_4804.jpeg"
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          quality={90}
          priority
        />
      </div>
      <div className={styles.center}>
        <h1>We're getting married!</h1>
        <Link href="/rsvp">
          <h3>RSVP</h3>
        </Link>
      </div>
      <main className={styles.main}></main>
    </div>
  );
}
