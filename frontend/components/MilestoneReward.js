import React, { useEffect, useState, useRef } from "react";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const starSvg = (filled, animate) => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: filled ? "drop-shadow(0 0 12px gold)" : "none",
      transition: "filter 0.3s",
      animation: animate ? "star-shine 0.8s linear infinite alternate" : "none",
    }}
  >
    <polygon
      points="27,5 33,21 51,21 36,32 41,49 27,39 13,49 18,32 3,21 21,21"
      fill={filled ? "#FFD700" : "#e2e8f0"}
      stroke="#b7791f"
      strokeWidth="2"
    />
  </svg>
);

const fireworkSvg = (
  <svg width="70" height="70" viewBox="0 0 60 60">
    <g>
      <circle cx="30" cy="30" r="8" fill="#FFD700" />
      <g stroke="#FFD700" strokeWidth="2">
        <line x1="30" y1="10" x2="30" y2="0" />
        <line x1="30" y1="50" x2="30" y2="60" />
        <line x1="10" y1="30" x2="0" y2="30" />
        <line x1="50" y1="30" x2="60" y2="30" />
        <line x1="45" y1="15" x2="55" y2="5" />
        <line x1="15" y1="45" x2="5" y2="55" />
        <line x1="15" y1="15" x2="5" y2="5" />
        <line x1="45" y1="45" x2="55" y2="55" />
      </g>
    </g>
  </svg>
);

// Zigzag path points (for 5 stars, can be extended)
function getZigzagPoints(width, height, totalStars) {
  // Manually define for 5 stars as per user request
  // Start: center bottom, up right, up left, up center, up right/top center
  const margin = 80;
  const midX = width / 2;
  const bottomY = height - margin;
  const topY = margin + 10;
  const points = [
    { x: midX, y: bottomY }, // start center bottom
    { x: midX + 120, y: height - margin * 2 }, // up right
    { x: midX - 120, y: height - margin * 3.2 }, // up left
    { x: midX, y: height - margin * 4.2 }, // up center
    { x: midX, y: topY }, // top center (reward)
  ];
  // If more than 5 stars, interpolate between these points
  if (totalStars === 5) return points;
  // For more, interpolate between these points
  const result = [];
  for (let i = 0; i < totalStars; i++) {
    const t = i / (totalStars - 1);
    // Linear interpolation between points
    const idx = Math.floor(t * (points.length - 1));
    const nextIdx = Math.min(idx + 1, points.length - 1);
    const localT = t * (points.length - 1) - idx;
    const x = points[idx].x + (points[nextIdx].x - points[idx].x) * localT;
    const y = points[idx].y + (points[nextIdx].y - points[idx].y) * localT;
    result.push({ x, y });
  }
  return result;
}

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : null;

// Add medal and trophy SVGs
const medalSvg = (filled, animate) => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: filled ? "drop-shadow(0 0 12px #FFD700)" : "none",
      transition: "filter 0.3s",
      animation: animate ? "star-shine 0.8s linear infinite alternate" : "none",
    }}
  >
    <circle
      cx="27"
      cy="27"
      r="18"
      fill={filled ? "#FFD700" : "#e2e8f0"}
      stroke="#b7791f"
      strokeWidth="2"
    />
    <rect x="20" y="8" width="14" height="10" rx="3" fill="#b7791f" />
    <rect x="20" y="36" width="14" height="6" rx="2" fill="#b7791f" />
  </svg>
);

const smallMedalSvg = (filled, animate) => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: filled ? "drop-shadow(0 0 8px #FFD700)" : "none",
      transition: "filter 0.3s",
      animation: animate ? "star-shine 0.8s linear infinite alternate" : "none",
    }}
  >
    <circle
      cx="19"
      cy="19"
      r="12"
      fill={filled ? "#FFD700" : "#e2e8f0"}
      stroke="#b7791f"
      strokeWidth="2"
    />
    <rect x="13" y="4" width="12" height="6" rx="2" fill="#b7791f" />
    <rect x="13" y="28" width="12" height="4" rx="1.5" fill="#b7791f" />
  </svg>
);

const trophySvg = (filled, animate) => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: filled ? "drop-shadow(0 0 12px #FFD700)" : "none",
      transition: "filter 0.3s",
      animation: animate ? "star-shine 0.8s linear infinite alternate" : "none",
    }}
  >
    <rect x="20" y="38" width="14" height="6" rx="2" fill="#b7791f" />
    <rect x="24" y="32" width="6" height="6" rx="2" fill="#FFD700" />
    <ellipse
      cx="27"
      cy="20"
      rx="12"
      ry="10"
      fill={filled ? "#FFD700" : "#e2e8f0"}
      stroke="#b7791f"
      strokeWidth="2"
    />
    <path
      d="M15 20 Q10 30 20 32"
      stroke="#b7791f"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M39 20 Q44 30 34 32"
      stroke="#b7791f"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const MilestoneReward = ({
  totalStars = 5,
  completedStars = 2,
  avatarUrl = "/images/default-avatar.png",
  rewardReached = false,
  label = "Milestone",
  rewardImage = null,
  setRewardImage,
  kidId,
  animationSpeed = 1200, // slower default
  type = "weekly", // default to weekly for backward compatibility
}) => {
  // SVG/container dimensions
  const width = 500;
  const height = 600;
  // Get zigzag points for stars
  const starPositions = getZigzagPoints(width, height, totalStars);

  // Avatar animation state
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [shineStars, setShineStars] = useState([]);
  const [showFirework, setShowFirework] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Notification state for RewardImageCard
  const [notification, setNotification] = useState("");

  // Set client-side flag and generate sparkles
  useEffect(() => {
    setIsClient(true);
    // Generate sparkles only on client side to avoid hydration mismatch
    const generatedSparkles = [...Array(80)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${4 + Math.random() * 2}px`,
      height: `${4 + Math.random() * 2}px`,
      opacity: 0.2 + Math.random() * 0.5,
      animationDelay: `${Math.random()}s`,
    }));
    setSparkles(generatedSparkles);
  }, []);

  // Animate avatar movement and star shining
  useEffect(() => {
    setAvatarIdx(0);
    setShineStars([]);
    setShowFirework(false);
    let step = 0;
    const interval = setInterval(() => {
      if (step <= completedStars) {
        setAvatarIdx(step);
        setShineStars((prev) => [...prev, step - 1]);
        step++;
      } else {
        clearInterval(interval);
        if (rewardReached) {
          setTimeout(() => setShowFirework(true), 400);
        }
      }
    }, animationSpeed);
    return () => clearInterval(interval);
  }, [completedStars, rewardReached, totalStars, animationSpeed]);

  // Night sky background with sparkling dots
  const renderNightSky = () => (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        background: "linear-gradient(180deg, #232946 0%, #1a1a2e 100%)",
        overflow: "hidden",
      }}
    >
      {isClient &&
        sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            style={{
              position: "absolute",
              left: sparkle.left,
              top: sparkle.top,
              width: sparkle.width,
              height: sparkle.height,
              borderRadius: "50%",
              background: "#fff",
              opacity: sparkle.opacity,
              filter: "blur(0.5px)",
              animation: `sparkle 2s ${sparkle.animationDelay} infinite alternate`,
            }}
          />
        ))}
      <style>{`
        @keyframes sparkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.7; }
        }
        @keyframes star-shine {
          0% { filter: drop-shadow(0 0 12px gold); }
          100% { filter: drop-shadow(0 0 24px #fffbe6); }
        }
      `}</style>
    </div>
  );

  // Curved path between milestones
  const renderCurvedPath = () => {
    let path = "";
    for (let i = 0; i < starPositions.length - 1; i++) {
      const a = starPositions[i];
      const b = starPositions[i + 1];
      // Use quadratic bezier for smooth curve
      const midX = (a.x + b.x) / 2 + (i % 2 === 0 ? 40 : -40); // alternate curve
      const midY = (a.y + b.y) / 2 + (i % 2 === 0 ? -30 : 30);
      path += `M${a.x},${a.y} Q${midX},${midY} ${b.x},${b.y} `;
    }
    return (
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <g strokeDasharray="2,18" stroke="#fffbe6" strokeWidth="7" fill="none">
          <path d={path} />
        </g>
      </svg>
    );
  };

  // Avatar position
  const avatarPos = starPositions[avatarIdx] || starPositions[0];

  // Choose icon based on type
  const getMilestoneIcon = () => {
    if (type === "yearly") return trophySvg;
    if (type === "monthly") return medalSvg;
    if (type === "weekly") return smallMedalSvg;
    return starSvg; // fallback
  };
  const milestoneIcon = getMilestoneIcon();

  return (
    <div
      style={{
        position: "relative",
        minHeight: height,
        background: "rgba(30,34,60,0.92)",
        borderRadius: 36,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        padding: 48,
        maxWidth: width + 48,
        margin: "40px auto",
        overflow: "hidden",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {renderNightSky()}
      <h2
        style={{
          color: "#FFD700",
          fontWeight: "bold",
          fontSize: 36,
          marginBottom: 32,
          zIndex: 2,
          textShadow: "0 2px 8px #000",
        }}
      >
        {label}
      </h2>
      {/* Reward Image Card at the top center */}
      <div style={{ marginBottom: 24 }}>
        <RewardImageCard
          rewardImage={rewardImage}
          setRewardImage={setRewardImage}
          kidId={kidId}
          setNotification={setNotification}
        />
      </div>
      <div
        style={{
          position: "relative",
          width,
          height,
          zIndex: 2,
          marginBottom: 24,
        }}
      >
        {renderCurvedPath()}
        {/* Milestone icons */}
        {starPositions.map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x - 27,
              top: pos.y - 27,
              zIndex: 3,
            }}
          >
            {milestoneIcon(i < completedStars, shineStars.includes(i))}
          </div>
        ))}
        {/* Avatar animation */}
        <div
          style={{
            position: "absolute",
            left: avatarPos.x - 38,
            top: avatarPos.y - 38,
            zIndex: 5,
            width: 76,
            height: 76,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: `left ${
              animationSpeed / 1000
            }s cubic-bezier(.68,-0.55,.27,1.55), top ${
              animationSpeed / 1000
            }s cubic-bezier(.68,-0.55,.27,1.55)`,
          }}
        >
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              border: "5px solid #FFD700",
              background: "#fff",
              boxShadow: "0 4px 18px rgba(255,215,0,0.18)",
              objectFit: "cover",
              transition: "box-shadow 0.3s",
            }}
          />
        </div>
      </div>
      <div
        style={{
          color: "#fffbe6",
          fontWeight: "bold",
          fontSize: 26,
          marginTop: 18,
          zIndex: 2,
          textShadow: "0 2px 8px #000",
        }}
      >
        {rewardReached
          ? "🎉 Reward Unlocked! 🎉"
          : `${completedStars} / ${totalStars} Milestones Completed`}
      </div>
      {notification && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: notification.includes("upload") ? "#d4edda" : "#f8d7da",
            color: notification.includes("upload") ? "#155724" : "#721c24",
            border: notification.includes("upload")
              ? "1px solid #c3e6cb"
              : "1px solid #f5c6cb",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: "bold",
            fontSize: 16,
            boxShadow: "0 2px 8px #0002",
            zIndex: 100,
          }}
        >
          {notification}
        </div>
      )}
    </div>
  );
};

function RewardImageCard({
  rewardImage,
  setRewardImage,
  kidId,
  setNotification,
}) {
  const fileInputRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  // Upload handler
  const handleUpload = async (file) => {
    setNotification("");

    // Check if Cloudinary is configured
    if (
      !CLOUDINARY_UPLOAD_PRESET ||
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_URL
    ) {
      setNotification(
        "Cloudinary not configured. Please set environment variables."
      );
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const cloudinaryRes = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = cloudinaryRes.data.secure_url;
      await axios.post(`${apiUrl}/api/reward-image`, {
        imageUrl,
        kidId,
        type: "daily",
      });
      setRewardImage(imageUrl);
      setNotification("Reward image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      setNotification("Failed to upload image. Check console for details.");
    }
    setTimeout(() => setNotification(""), 2000);
  };

  // Delete handler
  const handleDelete = async () => {
    setNotification("");
    try {
      await axios.delete(`${apiUrl}/api/reward-image`, {
        data: { kidId, type: "daily" },
      });
      setRewardImage(null);
      setNotification("Reward image deleted.");
    } catch {
      setNotification("Failed to delete image.");
    }
    setShowMenu(false);
    setTimeout(() => setNotification(""), 2000);
  };

  // Replace handler
  const handleReplace = () => {
    fileInputRef.current.click();
    setShowMenu(false);
  };

  // File input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        background: "#fffbe6",
        border: "4px solid #FFD700",
        borderRadius: 32,
        boxShadow: "0 2px 12px #FFD700",
        padding: 24,
        transform: "rotate(-8deg)",
        minWidth: 220,
        minHeight: 180,
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: "bold", color: "#FFD700", marginBottom: 12 }}>
        Upload your reward image
      </div>
      {!rewardImage ? (
        <>
          <button
            style={{
              background: "#FFD700",
              color: "#222",
              border: "none",
              borderRadius: 16,
              padding: "10px 18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => fileInputRef.current.click()}
          >
            Upload Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </>
      ) : (
        <div style={{ position: "relative" }}>
          <img
            src={rewardImage}
            alt="Reward"
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              objectFit: "cover",
              border: "3px solid #FFD700",
              boxShadow: "0 2px 12px #FFD700",
              cursor: "pointer",
            }}
            onClick={() => setShowMenu((v) => !v)}
            title="Click to edit"
          />
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "100%",
                marginLeft: 12,
                background: "#fffbe6",
                border: "2px solid #FFD700",
                borderRadius: 12,
                boxShadow: "0 2px 8px #FFD700",
                zIndex: 10,
                padding: 8,
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  color: "#d9534f",
                  marginBottom: 6,
                  fontWeight: "bold",
                }}
                onClick={handleDelete}
              >
                Delete
              </div>
              <div
                style={{
                  cursor: "pointer",
                  color: "#007bff",
                  fontWeight: "bold",
                }}
                onClick={handleReplace}
              >
                Replace
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MilestoneReward;
