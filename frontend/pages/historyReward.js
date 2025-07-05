import React, { useState } from "react";
import { useRouter } from "next/router";

// Dummy data for demonstration
const kids = [
  { id: "kid1", name: "Ali" },
  { id: "kid2", name: "Aina" },
  { id: "kid3", name: "Bob" },
];
const initialRewards = [
  {
    id: 1,
    type: "daily",
    image: "/images/star.png",
    description: "Completed all daily tasks!",
    claimed: false,
    kidId: "kid1",
  },
  {
    id: 2,
    type: "weekly",
    image: "/images/avatar2.png",
    description: "Finished weekly milestone!",
    claimed: true,
    kidId: "kid2",
  },
  {
    id: 3,
    type: "monthly",
    image: "/images/avatar3.png",
    description: "Monthly achievement unlocked!",
    claimed: false,
    kidId: "kid3",
  },
  {
    id: 4,
    type: "yearly",
    image: "/images/avatar4.png",
    description: "Yearly superstar!",
    claimed: false,
    kidId: "kid1",
  },
];

const typeLabels = {
  daily: "Daily Reward",
  weekly: "Weekly Reward",
  monthly: "Monthly Reward",
  yearly: "Yearly Reward",
};

export default function HistoryRewardPage() {
  const [rewards, setRewards] = useState(initialRewards);
  const [selectedKid, setSelectedKid] = useState(kids[0].id);
  const [viewAs, setViewAs] = useState("parent"); // "parent" or "kid"
  const router = useRouter();

  const handleClaim = (id) => {
    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === id ? { ...reward, claimed: true } : reward
      )
    );
  };

  // Filter rewards by selected kid
  const filteredRewards = rewards.filter((r) => r.kidId === selectedKid);

  return (
    <div style={{ minHeight: "100vh", background: "#e0f7fa", padding: 0 }}>
      <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: 32 }}>
        {/* Back to Homepage Button */}
        <button
          onClick={() => router.push("/")}
          style={{
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 24px",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            marginBottom: 18,
            boxShadow: "0 2px 8px #0002",
            transition: "background 0.2s",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          ← Back to Homepage
        </button>
        <h2
          style={{
            textAlign: "center",
            fontSize: 36,
            fontWeight: "bold",
            marginBottom: 18,
          }}
        >
          Reward&apos;s History
        </h2>
        {/* View as toggle (for demo) */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: "bold", marginRight: 8 }}>View as:</span>
          <select
            value={viewAs}
            onChange={(e) => setViewAs(e.target.value)}
            style={{
              fontSize: 16,
              padding: "6px 14px",
              borderRadius: 8,
              border: "2px solid #FFD700",
              background: "#fffbe6",
              color: "#b7791f",
              fontWeight: "bold",
              outline: "none",
            }}
          >
            <option value="parent">Parent</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#b7791f",
            fontWeight: "bold",
            marginBottom: 18,
          }}
        >
          Only parents can claim rewards. Kids can view their rewards but cannot
          claim.
        </div>
        {/* Kid Filter */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 28,
            justifyContent: "center",
          }}
        >
          <div>
            <label style={{ fontWeight: "bold", marginRight: 8 }}>Kid:</label>
            <select
              value={selectedKid}
              onChange={(e) => setSelectedKid(e.target.value)}
              style={{
                fontSize: 16,
                padding: "6px 14px",
                borderRadius: 8,
                border: "2px solid #FFD700",
                background: "#fffbe6",
                color: "#b7791f",
                fontWeight: "bold",
                outline: "none",
              }}
            >
              {kids.map((kid) => (
                <option key={kid.id} value={kid.id}>
                  {kid.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {filteredRewards.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888" }}>
            No rewards yet for this kid.
          </div>
        ) : (
          filteredRewards.map((reward) => (
            <div
              key={reward.id}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 2px 12px #0001",
                padding: 20,
                marginBottom: 20,
                gap: 20,
              }}
            >
              <img
                src={reward.image}
                alt={typeLabels[reward.type]}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  objectFit: "cover",
                  border: "2px solid #FFD700",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontWeight: "bold", fontSize: 20, color: "#b7791f" }}
                >
                  {typeLabels[reward.type]}
                </div>
                <div style={{ color: "#333", margin: "6px 0 10px 0" }}>
                  {reward.description}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: reward.claimed ? "#28a745" : "#ff9800",
                  }}
                >
                  {reward.claimed ? "Claimed" : "Not Claimed"}
                </div>
              </div>
              <button
                onClick={() => handleClaim(reward.id)}
                disabled={reward.claimed || viewAs === "kid"}
                style={{
                  background: reward.claimed ? "#bbb" : "#FFD700",
                  color: reward.claimed ? "#fff" : "#b7791f",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 18px",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor:
                    reward.claimed || viewAs === "kid"
                      ? "not-allowed"
                      : "pointer",
                  boxShadow: "0 2px 8px #0001",
                  transition: "background 0.2s",
                  opacity: viewAs === "kid" ? 0.7 : 1,
                }}
                title={
                  viewAs === "kid"
                    ? "Only parents can claim rewards"
                    : undefined
                }
              >
                {reward.claimed ? "Claimed" : "Claim"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
