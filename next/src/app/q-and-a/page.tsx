import FaqItem from "@/components/FaqItem/FaqItem";

const faqData = [
  {
    question: "What is the date and time of the wedding ceremony?",
    answer: (
      <span>
        Arrive at 5:00pm Saturday, October 25th, 2025. Ceremony starts promptly at 5:30pm. Cocktail hour and reception to follow.
      </span>
    ),
  },
  {
    question: "Where is the wedding taking place?",
    answer: (
      <span>
        Pecan Springs Ranch
        <br />
        10601 B Derecho Dr
        <br />
        Austin, TX 78737
      </span>
    ),
  },
  {
    question: "When do we RSVP?",
    answer: (
      <span>
        Please RSVP by September 21st, 2025. You can RSVP <a href="/rsvp">here</a>.
      </span>
    ),
  },
  {
    question: "Will there be a hotel block?",
    answer: (
      <>
      <span>
        No, but we recommend the following hotels if you wish to stay close to
        the venue:{" "}
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
        <br />
        There are also lots of great Airbnbs in the area if you’re looking for
        something different.
      </span>
      <br /><br />
      <strong>Cansler family members:</strong> If you’d like to stay up north near Lynn &amp; David, we’ve arranged a discounted hotel rate just minutes from their home.{" "}
      <a
        href="https://www.hilton.com/en/book/reservation/deeplink/?ctyhocn=AUSAAGI&groupCode=CANSLR&arrivaldate=2025-10-24&departuredate=2025-10-26&cid=OM,WW,HILTONLINK,EN,DirectLink&fromId=HILTONLINKDIRECT"
        target="_blank"
        rel="noopener noreferrer"
      >
        Reserve your room here.
      </a>
      </>
    ),
  },
  {
    question: "Is there a dress code?",
    answer: <span>Semi-formal. Think polished, but have fun with it!<br /><br /><strong>Heads up:</strong> Pecan Springs Ranch is mostly grass; wearing heels is not recommended.</span>,
  },
  {
    question: "Anything to be aware of in Austin this weekend?",
    answer: (
      <span>
        We lucked out and snagged the one quiet weekend in October—sandwiched
        perfectly between ACL Music Festival and F1! This means easier travel,
        less traffic, and (hopefully) better hotel rates for our favorite
        people.
      </span>
    ),
  },
];

// should we rename this page FAQ?
export default function QandA() {
  return (
    <div className={"page"}>
      <main className={"main"}>
        <h1>Q & A</h1>
        {faqData.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
        <br />
      </main>
    </div>
  );
}
