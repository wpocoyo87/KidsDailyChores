// pages/confirmation.js

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ConfirmationPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  useEffect(() => {
    const confirmUser = async () => {
      try {
        // Retrieve registrationId from localStorage or router query params
        const registrationId = user?.registrationId;

        // Simulate successful confirmation
        console.log(
          "User confirmed successfully with registration ID:",
          registrationId
        );

        // Redirect to login page after confirmation
        setTimeout(() => {
          router.push("/login"); // Replace with your actual login page route
        }, 5000); // Redirects to login page after 5 seconds
      } catch (error) {
        console.error("Error confirming user:", error);
        // Handle error cases here, if necessary
      }
    };

    confirmUser();
  }, []);

  // Styles for the component
  const styles = {
    body: {
      textAlign: "center",
      marginTop: "50px",
    },
  };

  return (
    <div style={styles.body}>
      <h1>Confirmation Page</h1>
      <p>Thank you for confirming your registration!</p>
      <p>Redirecting to login page in 5 seconds...</p>
    </div>
  );
};

export default ConfirmationPage;
