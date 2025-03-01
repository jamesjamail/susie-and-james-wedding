"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.scss";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const navLinks = (
    <ul className={styles.navLinks}>
      <li>
        <Link href="/" className={pathname === "/" ? styles.active : ""}>
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/our-story"
          className={pathname === "/our-story" ? styles.active : ""}
        >
          Our Story
        </Link>
      </li>
      <li>
        <Link
          href="/q-and-a"
          className={pathname === "/q-and-a" ? styles.active : ""}
        >
          Q&A
        </Link>
      </li>
      <li>
        <Link
          href="/travel-and-lodging"
          className={pathname === "/travel-and-lodging" ? styles.active : ""}
        >
          Travel & Lodging
        </Link>
      </li>
      <li>
        <Link
          href="/rsvp"
          className={pathname === "/rsvp" ? styles.active : ""}
        >
          RSVP
        </Link>
      </li>
      <li>
        <Link
          href="/photos"
          className={pathname === "/photos" ? styles.active : ""}
        >
          Photos
        </Link>
      </li>
      <li>
        <Link
          href="/registry"
          className={pathname === "/registry" ? styles.active : ""}
        >
          Registry
        </Link>
      </li>
    </ul>
  );

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">S & J</Link>
        <button className={styles.hamburger} onClick={toggleMenu}>
          <FaBars />
        </button>
      </div>
      <div className={styles.desktopNavLinks}>{navLinks}</div>
      {menuOpen && (
        <motion.div
          className={styles.fullScreenMenu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className={styles.closeButton} onClick={toggleMenu}>
            <FaTimes />
          </button>
          {navLinks}
        </motion.div>
      )}
    </header>
  );
}
