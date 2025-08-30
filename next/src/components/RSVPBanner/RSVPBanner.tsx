"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import styles from "./RSVPBanner.module.scss";

// LocalStorage keys
const DISMISSED_KEY = "rsvpBannerDismissed";
const COMPLETED_KEY = "rsvpCompleted";

/**
 * A dismissible site-wide banner reminding users to RSVP by the deadline.
 * Conditions to show:
 * - Not on the /rsvp page
 * - Not previously dismissed (localStorage)
 * - Not completed RSVP (localStorage)
 */
export default function RSVPBanner() {
  const [visible, setVisible] = useState(false);
  const { days: daysLeft, past: pastDeadline } = useDaysLeftToDeadline();
  const pathname = usePathname();

  useEffect(() => {
    // Guard for environments where window is not defined
    if (typeof window === "undefined") return;

    // Read localStorage flags
  const dismissedLS = localStorage.getItem(DISMISSED_KEY) === "true";
  const completedLS = localStorage.getItem(COMPLETED_KEY) === "true";
  // Read cookie flags as fallback/backup
  const dismissedCookie = getCookieFlag(DISMISSED_KEY);
  const completedCookie = getCookieFlag(COMPLETED_KEY);

  const dismissed = dismissedLS || dismissedCookie;
  const completed = completedLS || completedCookie;

    // Only show if not RSVP page, not dismissed, not completed
    setVisible(!dismissed && !completed);
  }, [pathname]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
  setCookieFlag(DISMISSED_KEY, "true");
    } catch {}
    setVisible(false);
  };

  // Hide on ESC key press
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && pathname !== "/rsvp" && (
        <motion.div
          className={styles.banner}
          role="region"
          aria-label="RSVP reminder"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <div className={styles.content}>
            <span>
              {pastDeadline ? (
                "RSVP deadline passed"
              ) : daysLeft !== null ? (
                <>
                  <strong className={styles.count}>{daysLeft}</strong> <strong className={styles.days}>days</strong> left to RSVP!
                </>
              ) : (
                "RSVP soon!"
              )}
            </span>
            {pastDeadline ? (
              <Link href="/get-in-touch">
                <button
                  type="button"
                  className={styles.ctaButton}
                  onClick={dismiss}
                >
                  Get In Touch
                </button>
              </Link>
            ) : (
              <Link href="/rsvp">
                <button
                  type="button"
                  className={styles.ctaButton}
                  onClick={dismiss}
                >
                  RSVP Now
                </button>
              </Link>
            )}
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={dismiss}
            aria-label="Dismiss RSVP banner"
          >
            <FaTimes />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compute and maintain countdown
function useDaysLeftToDeadline() {
  const [days, setDays] = useState<number | null>(null);
  const [past, setPast] = useState<boolean>(false);
  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const deadline = new Date(2025, 8, 21, 23, 59, 59); // Sep 21, 2025 23:59:59 local
      const diffMs = deadline.getTime() - now.getTime();
      const d = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, d);
      setDays(daysRemaining);
      setPast(diffMs <= 0);
    };
    compute();
    // Update every hour
    const id = setInterval(compute, 1000 * 60 * 60);
    return () => clearInterval(id);
  }, []);
  return { days, past };
}

// Utility function you can import elsewhere to mark RSVP completion
export const setRsvpCompleted = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COMPLETED_KEY, "true");
    setCookieFlag(COMPLETED_KEY, "true");
    localStorage.removeItem(DISMISSED_KEY); // optional cleanup
  } catch {}
};

// Cookie helpers for persistence
function setCookieFlag(name: string, value: string) {
  // 1 year
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

function getCookieFlag(name: string): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${name}=`) && c.split("=")[1] === "true");
}
