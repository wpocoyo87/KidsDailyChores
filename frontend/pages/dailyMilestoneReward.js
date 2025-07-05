import { useState, useEffect } from "react";
import MilestoneReward from "@/components/MilestoneReward";
import axios from "axios";
import { useRouter } from "next/router";

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : null;

export default function DailyMilestoneRewardPage() {
  const [kidId, setKidId] = useState(null);
  const router = useRouter();

  // Get kidId from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectedKid = JSON.parse(localStorage.getItem("selectedKid"));
      setKidId(selectedKid?._id || null);
    }
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ position: "relative", width: "100%", maxWidth: 600 }}>
        <MilestoneReward
          totalStars={5}
          completedStars={3}
          avatarUrl="/images/avatar1.png"
          rewardReached={false}
          label="Daily Milestone"
          rewardImage={null}
          setRewardImage={() => {}}
          kidId={kidId}
          animationSpeed={1200}
        />
        <button
          onClick={() => router.push("/singleProfile")}
          style={{
            width: "100%",
            marginTop: 24,
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 0",
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 8px #0002",
            transition: "background 0.2s",
            display: "block",
          }}
        >
          Back to Kid&apos;s Page
        </button>
      </div>
    </div>
  );
}
