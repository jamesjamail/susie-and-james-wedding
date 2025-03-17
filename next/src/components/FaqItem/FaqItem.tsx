import React from "react";
import styles from "./FaqItem.module.css";

interface FaqItemProps {
  question: string;
  answer: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  return (
    <div className={styles.faqItem}>
      <h2 className={styles.question}>{question}</h2>
      <div className={styles.answer}>{answer}</div>
    </div>
  );
};

export default FaqItem;
