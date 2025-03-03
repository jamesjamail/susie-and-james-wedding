import styles from "./Homepage.module.scss";
import Image from "next/image";
import Countdown from "@/components/Countdown/Countdown";

export default function Homepage() {
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Susie+and+James+Wedding&dates=20251025T090000Z/20251025T170000Z&details=Join+us+for+the+wedding+of+Susie+and+James!&location=Austin,+TX`;

  return (
    <div className={"page"}>
      <div className={styles.hero}>
        <Image
          src="/Wallpaper.png"
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          quality={90}
          priority
        />
      </div>
      <main className={styles.center}>
        <div className={styles.row}>
          <div className={styles.center}>
            <Image
              src="/wedding-rings.png"
              alt="Wedding rings"
              width={400}
              height={400}
              priority
            />
          </div>
          <div className={styles.textbox}>
            <div className={styles.susieandjames}>
              <h1>
                Susie<div className={styles.green}>&</div>James
              </h1>
            </div>

            <p className={styles.heading}>
              Are officially off the market! The countdown is on, and we can’t
              wait to kick off our forever with YOU—one of our favorite people.
              Let’s celebrate!
            </p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.center}>
            <h2>
              <Countdown targetDate="2025-10-25" />
            </h2>
          </div>
          <div className={styles.center}>
            <h3 className={styles.h3}> October 25th, 2025</h3>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.center}>
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className={styles.button}>Save The Date</button>
            </a>
          </div>
          <div className={styles.center}>
            <a href={"/events/wedding.ics"} download>
              <button className={styles.button}>Download ICS File</button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
