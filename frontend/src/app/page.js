"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const Home = () => {
  const router = useRouter();
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const emojis = ["🌟", "⭐", "✨", "🎯", "🏆", "🎪", "🎨", "🚀"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % emojis.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleParentLogin = () => {
    router.push("/login");
  };

  const handleKidsLogin = () => {
    router.push("/kidsLogin");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.emojiContainer}>
          <span className={styles.emoji}>{emojis[currentEmoji]}</span>
        </div>
        
        <h1 className={styles.title}>
          Kids Daily Chores
        </h1>
        
        <p className={styles.subtitle}>
          🎯 Make chores fun and rewarding! ⭐
        </p>
        
        <div className={styles.buttonContainer}>
          <div className={styles.loginSection}>
            <h2 className={styles.sectionTitle}>👨‍👩‍👧‍👦 For Parents</h2>
            <p className={styles.sectionDescription}>
              Create tasks, track progress, and manage your kids' activities
            </p>
            <button onClick={handleParentLogin} className={styles.parentButton}>
              🔐 Parent Login
            </button>
          </div>
          
          <div className={styles.loginSection}>
            <h2 className={styles.sectionTitle}>👶 For Kids</h2>
            <p className={styles.sectionDescription}>
              Complete your tasks and earn amazing stars!
            </p>
            <button onClick={handleKidsLogin} className={styles.kidButton}>
              🎮 Kids Login
            </button>
          </div>
        </div>
        
        <div className={styles.registerSection}>
          <p className={styles.registerText}>New to Kids Daily Chores?</p>
          <button onClick={handleRegister} className={styles.registerButton}>
            ✨ Create Family Account
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
