import styles from "./page.module.scss";
import Image from "next/image";
import Countdown from "@/components/Countdown/Countdown";
import Homepage from "@/components/Homepage/page";

export default function Home() {
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Susie+and+James+Wedding&dates=20251025T090000Z/20251025T170000Z&details=Join+us+for+the+wedding+of+Susie+and+James!&location=Austin,+TX`;

  return <Homepage />;
}
