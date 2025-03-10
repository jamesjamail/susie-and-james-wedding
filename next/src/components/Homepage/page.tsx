"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useClickAway } from "react-use";
import styles from "./Homepage.module.scss";
import Countdown from "@/components/Countdown/Countdown";
import classNames from "classnames";

export default function Homepage() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Susie+and+James+Wedding&dates=20251025T210000Z/20251026T040000Z&details=Join+us+for+the+wedding+of+Susie+and+James!&location=Pecan+Springs+Ranch,+Austin,+TX`;

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setModalOpen(false);
    }
  };

  useClickAway(modalRef, () => {
    setModalOpen(false);
  });

  useEffect(() => {
    if (modalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen]);

  return (
    <div className={styles.page}>
      <div className={styles.hero} />
      <main className={styles.center}>
        <div className={styles.row}>
          <div className={styles.textbox}>
            <div className={styles.susieandjames}>
              <h1>
                Susie<div className={styles.green}>&</div>James
              </h1>
            </div>
            <div className={styles.textWithBackground}>
              <p className={styles.heading}>
                Are officially off the market! The countdown is on, and we can’t
                wait to kick off our forever with YOU—one of our favorite
                people. Let’s celebrate!
              </p>
            </div>
          </div>
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.details}>
            <h3 className={classNames(styles.h3, styles.hideOnMobile)}>
              Saturday
            </h3>

            <h3 className={styles.h3}>October 25th, 2025</h3>
          </div>
          <div className={styles.verticalRuler}></div>
          {/* Thick vertical ruler */}
          <div className={styles.details}>
            <h3 className={styles.h3}>Pecan Springs Ranch</h3>
            <h3 className={classNames(styles.h3, styles.hideOnMobile)}>
              Austin, TX
            </h3>
          </div>
          <div
            className={classNames(styles.verticalRuler, styles.hideOnDesktop)}
          />

          <div className={classNames(styles.details, styles.hideOnDesktop)}>
            <h3 className={styles.h3}>Austin, TX</h3>
          </div>
        </div>

        <div className={styles.center}>
          <a onClick={toggleModal}>
            <button className={styles.button}>Save The Date</button>
          </a>
        </div>
        <h2>
          <Countdown targetDate="2025-10-25" />
        </h2>
        {modalOpen && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.modalContent} ref={modalRef}>
              <button className={styles.closeButton} onClick={toggleModal}>
                &times;
              </button>
              <h2>SAVE THE DATE</h2>
              <div className={styles.modalLinks}>
                <button className={styles.button}>
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Add to Google Calendar
                  </a>
                </button>

                <button className={styles.button}>
                  <a href={"/events/susie-and-james-wedding.ics"} download>
                    Download ICS File
                  </a>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
