import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import Countdown from "@/components/Countdown/Countdown";

export default function Home() {
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Susie+and+James+Wedding&dates=20251025T090000Z/20251025T170000Z&details=Join+us+for+the+wedding+of+Susie+and+James!&location=Austin,+TX`;
  const appleCalendarUrl = `localhost:3000/events/wedding.ics`;

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
          Susie<div className={styles.green}>&</div>James
        </h1>
        <p>
          Are officially off the market! The countdown is on, and we can’t wait
          to kick off our forever with YOU—one of our favorite people. Let’s
          celebrate!
        </p>
        <h3>October 25th 2025 - Austin, TX</h3>
        <h2>
          <Countdown targetDate="2025-10-25" />
        </h2>

        <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
          <button>Save The Date</button>
        </a>
        <a href={"/events/wedding.ics"} download>
          <button>Download ICS File</button>
        </a>
      </main>
    </div>
  );
}
