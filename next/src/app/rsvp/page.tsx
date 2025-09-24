"use client"

import React from "react";
import styles from "./page.module.scss";

function RSVP() {
  return (
    <div className="page">
      <main className="main">
        <h1 className={styles.header}>R S V P</h1>        
          <div className={styles.deadlineNotice}>The RSVP window has closed. Please contact us directly if needed.</div>
          <a href="/get-in-touch" className={styles.getInTouchLink}>
            <button>Get In Touch</button>
          </a>
      </main>
    </div>
  );
}

export default RSVP;
