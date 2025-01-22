import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
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
          <Link href="/RSVP">RSVP</Link>
        </li>
        <li>
          <Link href="/Photos">Photos</Link>
        </li>
        <li>
          <Link href="/Registry">Registry</Link>
        </li>
      </ul>
    </div>
  );
}
