import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import Countdown from "@/components/Countdown/Countdown";

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
      <main className={styles.center}>
        <h1>
          The Wedding of <br />
          <strong>Susie & James</strong>
        </h1>
        <h2>October 25th 2025 - Austin, TX</h2>
        <h2>
          <Countdown targetDate="2025-10-25" />
        </h2>
        <p>
          James and Susie are officially off the market! The countdown is on,
          and we can’t wait to kick off our forever with YOU—one of our favorite
          people. Let’s celebrate!
        </p>
        <Link href="/our-story">
          <h2>read their story</h2>
        </Link>
      </main>
    </div>
  );
}
