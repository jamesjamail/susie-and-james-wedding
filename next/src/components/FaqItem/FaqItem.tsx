import React from "react";
import styles from "./FaqItem.module.css";

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  return (
    <div className={styles.faqItem}>
      <h2 className={styles.question}>{question}</h2>
      <p className={styles.answer}>{answer}</p>
    </div>
  );
};

export default FaqItem;
