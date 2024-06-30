"use client";

import Link from "next/link";
import styles from "./page.module.css"; // Import module styles

const Home = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Daily Checklist for Kids</h1>
      <div className={styles.links}>
        <Link href="/login">Login</Link>
        {" / "}
        <Link href="/register">Register</Link>
      </div>
    </main>
  );
};

export default Home;
