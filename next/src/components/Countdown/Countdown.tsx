"use client";

import React, { useState, useEffect } from "react";
import styles from "./Countdown.module.scss";

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [days, setDays] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const calculateDaysLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

      setDays(days);

      if (days > 1) {
        setMessage("days to go!");
      } else if (days === 1) {
        setMessage("1 day to go!");
      } else if (days === 0) {
        setMessage("Today is the day!");
      } else if (days === -1) {
        setMessage("Married for 1 day");
      } else {
        const daysMarried = Math.abs(days);
        setMessage(`Married for ${daysMarried} days`);
      }
    };

    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 1000 * 60 * 60 * 24); // Update every day

    return () => clearInterval(interval);
  }, [targetDate]);

  const renderDays = () => {
    if (days === null) return null;

    return days
      .toString()
      .split("")
      .map((digit, index) => (
        <div key={index} className={styles.numberTile}>
          {digit}
        </div>
      ));
  };

  return (
    <div className={styles.countdown}>
      {renderDays()}
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default Countdown;
