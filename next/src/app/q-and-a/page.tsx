import FaqItem from "@/components/FaqItem/FaqItem";

const faqData = [
  {
    question: "What is the date and time of the wedding ceremony?",
    answer:
      "Late afternoon/evening on Saturday, October 25th, 2025. Exact details will be shared closer to the big day—stay tuned!",
  },
  {
    question: "Where is the wedding taking place?",
    answer: "Pecan Springs Ranch\n10601 B Derecho Dr, Austin, TX 78737",
  },
  {
    question: "When do we RSVP?",
    answer:
      "Keep an eye on your mailbox for our formal invite, arriving in August or September 2025. It’ll have all the details for RSVP-ing officially.",
  },
  {
    question: "Are kids allowed?",
    answer: "Absolutely! We’d love for you to bring your mini me(s) along.",
  },
  {
    question: "Is there a dress code?",
    answer: "Semi-formal. Think polished, but have fun with it!",
  },
  {
    question: "Anything to be aware of in Austin this weekend?",
    answer:
      "We lucked out and snagged the one quiet weekend in October—sandwiched perfectly between ACL Music Festival and F1! This means easier travel, less traffic, and (hopefully) better hotel rates for our favorite people.",
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
      </main>
    </div>
  );
}
