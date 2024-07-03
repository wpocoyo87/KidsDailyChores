import { useRouter } from "next/router";
import { useEffect } from "react";

const CongratulationsPage = () => {
  const router = useRouter();
  const { kidName } = router.query;

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/checkedTask");
    }, 5000); // Redirect back to the tasks page after 5 seconds

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div style={styles.container}>
      <h1>Congratulations {kidName}!</h1>
      <p>You have completed your daily task!</p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Comic Sans MS, cursive",
    backgroundColor: "rgb(var(--background-start-rgb))",
    color: "rgb(var(--foreground-rgb))",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
};

export default CongratulationsPage;
