import styles from "../our-story/page.module.scss";

export default function TravelAndLodging() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Travel & Lodging</h1>
        <p>
          Pecan Springs Ranch sits right on the edge of Dripping Springs, TX
          while still falling within a comfortable 20-30 minute driving range to
          downtown Austin.
        </p>
        <p>
          Dripping Springs serves up all the Hill Country charm you never knew
          you needed, perfect for those craving a rustic retreat filled with
          rolling hills, BBQ joints, and what out-of-staters might consider a
          superfluous amount of Texas Flags. You can sip your way down Fitzhugh
          Road, hopping between its burgeoning wineries and breweries, or
          channel your inner adventurer with a day trip to Reimer’s Ranch or
          Hamilton Pool.
        </p>
        <p>
          Hotels near the venue:{" "}
          <a
            href="https://www.hilton.com/en/hotels/ausohhx-hampton-austin-oak-hill/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hampton Inn
          </a>
          ,{" "}
          <a
            href="https://www.choicehotels.com/texas/dripping-springs/sleep-inn-hotels/txe80?mc=llgoxxpx"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sleep Inn
          </a>
          ,{" "}
          <a
            href="https://www.sonesta.com/sonesta-simply-suites/tx/austin/sonesta-simply-suites-austin-south"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sonesta
          </a>
          ,{" "}
          <a
            href="https://www.marriott.com/en-us/hotels/auswe-residence-inn-austin-southwest/overview/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Residence Inn
          </a>
          , and{" "}
          <a
            href="https://www.marriott.com/en-us/hotels/auswa-aloft-austin-southwest/overview/"
            target="_blank"
            rel="noopener noreferrer"
          >
            A Loft Hotel
          </a>
          .
        </p>
        <p>
          If you’re more of a city rat craving live music, a two-stepping jaunt,
          or an indulgent meal (or six) — we’d recommend staying in Austin!
          Don’t worry, there will be plenty of Texas flags here too. It won’t be
          a problem to catch an Uber or Lyft to the venue from anywhere in
          Austin.
        </p>
        <p>
          Austin boutique hotels we love:{" "}
          <a
            href="https://www.thelinehotel.com/austin/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Line
          </a>
          ,{" "}
          <a
            href="https://driskillhotel.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Driskill
          </a>
          ,{" "}
          <a
            href="https://www.bunkhousehotels.com/carpenter-hotel"
            target="_blank"
            rel="noopener noreferrer"
          >
            Carpenter
          </a>
          ,{" "}
          <a
            href="https://www.hotelvanzandt.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hotel Van Zandt
          </a>
          .
        </p>
      </main>
    </div>
  );
}
