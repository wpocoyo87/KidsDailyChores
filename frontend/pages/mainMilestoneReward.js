import React, { useState } from "react";
import MilestoneReward from "../components/MilestoneReward";
import { useRouter } from "next/router";

const rewardTypes = [
  { label: "Daily", value: "daily", stars: 5 },
  { label: "Weekly", value: "weekly", stars: 7 },
  { label: "Monthly", value: "monthly", stars: 4 }, // 4 weeks for monthly
  { label: "Yearly", value: "yearly", stars: 12 },
];

const rewardLabels = {
  daily: "Daily Milestone",
  weekly: "Weekly Milestone",
  monthly: "Monthly Milestone",
  yearly: "Yearly Milestone",
};

export default function MainMilestoneRewardPage() {
  const [selectedType, setSelectedType] = useState("weekly");
  const [completedStars, setCompletedStars] = useState(3); // Example, connect to backend as needed
  const [rewardImages, setRewardImages] = useState({}); // { daily: url, weekly: url, monthly: url, yearly: url }
  const [notification, setNotification] = useState("");
  const router = useRouter();

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleSetRewardImage = (imgUrl) => {
    setRewardImages((prev) => ({ ...prev, [selectedType]: imgUrl }));
  };

  const currentType = rewardTypes.find((t) => t.value === selectedType);

  return (
    <div style={{ minHeight: "100vh", background: "#b2f7ef", padding: 0 }}>
      <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: 32 }}>
        {/* Filter Dropdown */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <label
            htmlFor="rewardType"
            style={{ fontWeight: "bold", fontSize: 20, marginRight: 12 }}
          >
            Select Reward Type:
          </label>
          <select
            id="rewardType"
            value={selectedType}
            onChange={handleTypeChange}
            style={{
              fontSize: 18,
              padding: "8px 18px",
              borderRadius: 12,
              border: "2px solid #FFD700",
              background: "#fffbe6",
              color: "#b7791f",
              fontWeight: "bold",
              outline: "none",
            }}
          >
            {rewardTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        {/* Milestone Reward */}
        <div style={{ position: "relative" }}>
          <MilestoneReward
            totalStars={currentType.stars}
            completedStars={completedStars}
            avatarUrl="/images/avatar1.png" // Can be changed to user avatar
            rewardReached={completedStars >= currentType.stars}
            label={rewardLabels[selectedType]}
            rewardImage={rewardImages[selectedType] || null}
            setRewardImage={handleSetRewardImage}
            kidId={"demoKidId"} // Replace with real id if available
            animationSpeed={1200}
            type={selectedType}
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
    </div>
  );
}
