import Link from "next/link";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/our-story">Our Story</Link>
        </li>
        <li>
          <Link href="/q-and-a">Q&A</Link>
        </li>
        <li>
          <Link href="/travel-and-lodging">Travel & Lodging</Link>
        </li>
        <li>
          <Link href="/rsvp">RSVP</Link>
        </li>
        <li>
          <Link href="/photos">Photos</Link>
        </li>
        <li>
          <Link href="/registry">Registry</Link>
        </li>
      </ul>
    </header>
  );
}
