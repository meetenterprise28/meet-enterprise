import { useNavigate } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const MASCOT_STYLES = `
@keyframes tshirt-float {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
}
@keyframes tshirt-glow {
  0%, 100% { filter: drop-shadow(0 0 6px #FFD700) drop-shadow(0 0 12px rgba(255,215,0,0.4)); }
  50% { filter: drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px rgba(255,215,0,0.6)); }
}
@keyframes tshirt-glow-hover {
  0%, 100% { filter: drop-shadow(0 0 12px #FFD700) drop-shadow(0 0 24px rgba(255,215,0,0.8)) drop-shadow(0 0 36px rgba(255,215,0,0.4)); }
  50% { filter: drop-shadow(0 0 18px #FFD700) drop-shadow(0 0 32px rgba(255,215,0,0.9)) drop-shadow(0 0 48px rgba(255,215,0,0.5)); }
}
@keyframes tshirt-blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}
@keyframes tshirt-wink {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}
@keyframes tshirt-wave {
  0%   { transform: rotate(0deg) translateY(0px); }
  15%  { transform: rotate(-25deg) translateY(-4px); }
  30%  { transform: rotate(10deg) translateY(-6px); }
  45%  { transform: rotate(-20deg) translateY(-4px); }
  60%  { transform: rotate(8deg) translateY(-2px); }
  75%  { transform: rotate(-10deg) translateY(0px); }
  100% { transform: rotate(0deg) translateY(0px); }
}
@keyframes tshirt-shimmy {
  0%   { transform: translateX(0) rotate(-2deg) scaleX(1); }
  20%  { transform: translateX(-6px) rotate(-6deg) scaleX(0.96); }
  40%  { transform: translateX(6px) rotate(4deg) scaleX(1.04); }
  60%  { transform: translateX(-4px) rotate(-4deg) scaleX(0.97); }
  80%  { transform: translateX(4px) rotate(3deg) scaleX(1.02); }
  100% { transform: translateX(0) rotate(-2deg) scaleX(1); }
}
@keyframes tshirt-spin {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
@keyframes tshirt-bounce-excited {
  0%   { transform: translateY(0) scaleY(1) scaleX(1); }
  20%  { transform: translateY(-14px) scaleY(1.08) scaleX(0.94); }
  40%  { transform: translateY(4px) scaleY(0.92) scaleX(1.06); }
  60%  { transform: translateY(-10px) scaleY(1.05) scaleX(0.96); }
  80%  { transform: translateY(2px) scaleY(0.96) scaleX(1.02); }
  100% { transform: translateY(0) scaleY(1) scaleX(1); }
}
@keyframes tshirt-hover-pop {
  0%   { transform: scale(1) rotate(-2deg); }
  40%  { transform: scale(1.18) rotate(2deg); }
  70%  { transform: scale(1.13) rotate(-1deg); }
  100% { transform: scale(1.15) rotate(0deg); }
}
@keyframes tshirt-dance-body {
  0%   { transform: translateX(0px) rotate(-2deg) scaleY(1); }
  12%  { transform: translateX(-10px) rotate(-15deg) scaleY(0.95); }
  25%  { transform: translateX(0px) rotate(0deg) scaleY(1.08); }
  37%  { transform: translateX(10px) rotate(15deg) scaleY(0.95); }
  50%  { transform: translateX(0px) rotate(0deg) scaleY(1.08); }
  62%  { transform: translateX(-10px) rotate(-15deg) scaleY(0.95); }
  75%  { transform: translateX(0px) rotate(0deg) scaleY(1.08); }
  87%  { transform: translateX(10px) rotate(15deg) scaleY(0.95); }
  100% { transform: translateX(0px) rotate(-2deg) scaleY(1); }
}
@keyframes tshirt-dance-arms {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-30deg) translateY(-6px); }
  50%  { transform: rotate(0deg); }
  75%  { transform: rotate(30deg) translateY(-6px); }
  100% { transform: rotate(0deg); }
}
@keyframes tshirt-dance-sparkle {
  0%   { opacity: 0; transform: scale(0.5) translateY(0px); }
  30%  { opacity: 1; transform: scale(1.2) translateY(-4px); }
  60%  { opacity: 0.8; transform: scale(1) translateY(-8px); }
  100% { opacity: 0; transform: scale(0.5) translateY(-14px); }
}
@keyframes tshirt-talk-bubble {
  0%   { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.85); }
  18%  { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
  70%  { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-4px) scale(0.9); }
}
@keyframes tshirt-talk-nod {
  0%, 100% { transform: translateY(0px) rotate(-1deg); }
  20%  { transform: translateY(-5px) rotate(1deg); }
  40%  { transform: translateY(2px) rotate(-2deg); }
  60%  { transform: translateY(-4px) rotate(1deg); }
  80%  { transform: translateY(1px) rotate(-1deg); }
}
.tshirt-mascot-anim {
  animation: tshirt-float 3s ease-in-out infinite, tshirt-glow 2s ease-in-out infinite;
  display: inline-block;
  transform-origin: center bottom;
  transition: transform 0.2s ease;
}
.tshirt-mascot-anim.hovered {
  animation: tshirt-hover-pop 0.3s ease forwards, tshirt-glow-hover 2s ease-in-out infinite;
}
.tshirt-mascot-anim.wave {
  animation: tshirt-wave 1.4s ease-in-out, tshirt-glow 2s ease-in-out infinite;
}
.tshirt-mascot-anim.shimmy {
  animation: tshirt-shimmy 1.0s ease-in-out, tshirt-glow 2s ease-in-out infinite;
}
.tshirt-mascot-anim.spin {
  animation: tshirt-spin 0.7s ease-in-out, tshirt-glow 2s ease-in-out infinite;
}
.tshirt-mascot-anim.bounce {
  animation: tshirt-bounce-excited 1.0s ease-in-out, tshirt-glow 2s ease-in-out infinite;
}
.tshirt-mascot-anim.dance {
  animation: tshirt-dance-body 1.9s ease-in-out, tshirt-glow 2s ease-in-out infinite;
}
.tshirt-mascot-anim.talk {
  animation: tshirt-talk-nod 2.5s ease-in-out, tshirt-glow 2s ease-in-out infinite;
}
.tshirt-eyes-anim {
  animation: tshirt-blink 4s ease-in-out infinite;
  transform-origin: center center;
}
.tshirt-eyes-anim.winking {
  animation: tshirt-wink 0.5s ease-in-out forwards;
}
.tshirt-mascot-clickable {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.mascot-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: linear-gradient(135deg, oklch(0.15 0.02 85), oklch(0.12 0.01 85));
  border: 1px solid rgba(255,215,0,0.5);
  border-radius: 12px;
  padding: 5px 10px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 600;
  color: #FFD700;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6), 0 0 12px rgba(255,215,0,0.2);
  opacity: 0;
  transform: translateY(6px) scale(0.9);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
  letter-spacing: 0.03em;
}
.mascot-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 14px;
  border: 5px solid transparent;
  border-top-color: rgba(255,215,0,0.5);
}
.tshirt-wrapper:hover .mascot-tooltip,
.tshirt-wrapper:focus-within .mascot-tooltip {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.mascot-speech-bubble {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(6px) scale(0.85);
  background: linear-gradient(135deg, #1a1208, #0f0b05);
  border: 1.5px solid #FFD700;
  border-radius: 10px;
  padding: 6px 10px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 600;
  color: #FFD700;
  box-shadow: 0 4px 20px rgba(0,0,0,0.7), 0 0 16px rgba(255,215,0,0.25);
  z-index: 60;
  pointer-events: none;
  animation: tshirt-talk-bubble 2.5s ease forwards;
  letter-spacing: 0.02em;
}
.mascot-speech-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #FFD700;
}
.dance-sparkle-left {
  animation: tshirt-dance-sparkle 0.8s ease-in-out infinite alternate;
}
.dance-sparkle-right {
  animation: tshirt-dance-sparkle 0.8s ease-in-out 0.4s infinite alternate;
}
`;

type MoodState =
  | "idle"
  | "wave"
  | "shimmy"
  | "spin"
  | "bounce"
  | "wink"
  | "dance"
  | "talk";

const TALK_MESSAGES = [
  "🛍️ Check our deals!",
  "✨ New arrivals!",
  "💎 Premium quality!",
  "🎁 Great offers!",
  "🌟 Shop now!",
];

// Weighted mood picker
const MOOD_WEIGHTS: { mood: MoodState; weight: number }[] = [
  { mood: "dance", weight: 30 },
  { mood: "talk", weight: 20 },
  { mood: "wave", weight: 15 },
  { mood: "shimmy", weight: 15 },
  { mood: "spin", weight: 10 },
  { mood: "bounce", weight: 5 },
  { mood: "wink", weight: 5 },
];

function pickWeightedMood(): MoodState {
  const total = MOOD_WEIGHTS.reduce((s, m) => s + m.weight, 0);
  let r = Math.random() * total;
  for (const { mood, weight } of MOOD_WEIGHTS) {
    r -= weight;
    if (r <= 0) return mood;
  }
  return "dance";
}

const MOOD_DURATIONS: Record<MoodState, number> = {
  idle: 0,
  wave: 1500,
  shimmy: 1100,
  spin: 800,
  bounce: 1100,
  wink: 600,
  dance: 2000,
  talk: 2500,
};

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = MASCOT_STYLES;
  document.head.appendChild(tag);
  stylesInjected = true;
}

interface TShirtMascotProps {
  anchored?: boolean;
}

export function TShirtMascot({ anchored = false }: TShirtMascotProps) {
  injectStyles();
  const navigate = useNavigate();
  const [mood, setMood] = useState<MoodState>("idle");
  const [hovered, setHovered] = useState(false);
  const talkMsgRef = useRef(0);
  const moodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleMood = useCallback(() => {
    const delay = 4000 + Math.random() * 4000;
    moodTimerRef.current = setTimeout(() => {
      const next = pickWeightedMood();
      if (next === "talk") {
        talkMsgRef.current = (talkMsgRef.current + 1) % TALK_MESSAGES.length;
      }
      setMood(next);
      resetTimerRef.current = setTimeout(() => {
        setMood("idle");
        scheduleMood();
      }, MOOD_DURATIONS[next]);
    }, delay);
  }, []);

  useEffect(() => {
    scheduleMood();
    return () => {
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [scheduleMood]);

  const handleClick = () => {
    navigate({ to: "/support" });
  };

  const isWinking = mood === "wink";
  const isDancing = mood === "dance";
  const isTalking = mood === "talk";
  const bodyMood = isWinking ? "idle" : mood;

  const animClass = hovered
    ? "tshirt-mascot-anim hovered"
    : bodyMood !== "idle"
      ? `tshirt-mascot-anim ${bodyMood}`
      : "tshirt-mascot-anim";

  // Eye variants
  const eyeRadius = isDancing ? 3.8 : 3;
  const eyeClass = isWinking ? "tshirt-eyes-anim winking" : "tshirt-eyes-anim";

  // Mouth variants
  const renderMouth = () => {
    if (mood === "bounce") {
      return (
        <ellipse
          cx="35"
          cy="57"
          rx="6"
          ry="4"
          fill="#1a1208"
          stroke="#1a1208"
          strokeWidth="1"
        />
      );
    }
    if (isTalking) {
      // happy squint smile
      return (
        <path
          d="M 27 54 Q 35 62 43 54"
          stroke="#1a1208"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    return (
      <path
        d="M 27 54 Q 35 61 43 54"
        stroke="#1a1208"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  const wrapperStyle: CSSProperties = anchored
    ? { display: "inline-block", width: 70, height: 80, position: "relative" }
    : {
        position: "fixed",
        bottom: 80,
        right: 16,
        zIndex: 50,
        width: 70,
        height: 80,
      };

  return (
    <button
      type="button"
      style={wrapperStyle}
      className="tshirt-wrapper tshirt-mascot-clickable"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Need help? Click to visit our Help & Support page"
      data-ocid="mascot.help.button"
    >
      {/* Tooltip — follow mode only */}
      {!anchored && !isTalking && (
        <div className="mascot-tooltip">Need help? 💬</div>
      )}

      {/* Speech bubble — follow mode + talk mood only */}
      {!anchored && isTalking && (
        <div className="mascot-speech-bubble" key={talkMsgRef.current}>
          {TALK_MESSAGES[talkMsgRef.current]}
        </div>
      )}

      <div className={animClass}>
        <svg
          width="70"
          height="80"
          viewBox="0 0 70 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Meet Enterprises mascot"
        >
          {/* T-shirt body */}
          <path
            d="
              M 20 18
              L 5 30
              L 14 34
              L 14 72
              Q 14 74 16 74
              L 54 74
              Q 56 74 56 72
              L 56 34
              L 65 30
              L 50 18
              Q 44 22 35 22
              Q 26 22 20 18
              Z
            "
            fill="#FFD700"
            stroke="#B8860B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Collar U-shape cutout */}
          <path
            d="M 26 18 Q 35 28 44 18"
            fill="#1a1208"
            stroke="#B8860B"
            strokeWidth="1.5"
          />
          {/* Waving sleeve highlight */}
          {mood === "wave" && (
            <path
              d="M 5 30 L 14 34"
              stroke="#FFD700"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}
          {/* Dancing arms — flap up/down */}
          {isDancing && (
            <>
              <line
                x1="14"
                y1="34"
                x2="4"
                y2="24"
                stroke="#B8860B"
                strokeWidth="4"
                strokeLinecap="round"
                style={{
                  transformOrigin: "14px 34px",
                  animation: "tshirt-dance-arms 0.48s ease-in-out infinite",
                }}
              />
              <line
                x1="56"
                y1="34"
                x2="66"
                y2="24"
                stroke="#B8860B"
                strokeWidth="4"
                strokeLinecap="round"
                style={{
                  transformOrigin: "56px 34px",
                  animation:
                    "tshirt-dance-arms 0.48s ease-in-out 0.24s infinite",
                }}
              />
            </>
          )}
          {/* Face: eyes */}
          <g className={eyeClass}>
            <circle cx="29" cy="45" r={eyeRadius} fill="#1a1208" />
            {/* Right eye */}
            {isWinking ? (
              <path
                d="M 38.5 45 Q 41 42.5 43.5 45"
                stroke="#1a1208"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : isTalking ? (
              /* Happy squinting eyes during talk */
              <>
                <path
                  d="M 26.5 45 Q 29 42.5 31.5 45"
                  stroke="#1a1208"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 38.5 45 Q 41 42.5 43.5 45"
                  stroke="#1a1208"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : (
              <circle cx="41" cy="45" r={eyeRadius} fill="#1a1208" />
            )}
            {/* Eye shines */}
            {!isWinking && !isTalking && (
              <>
                <circle
                  cx="30.2"
                  cy="43.8"
                  r={isDancing ? 1.2 : 0.9}
                  fill="white"
                  opacity="0.8"
                />
                <circle
                  cx="42.2"
                  cy="43.8"
                  r={isDancing ? 1.2 : 0.9}
                  fill="white"
                  opacity="0.8"
                />
              </>
            )}
            {!isWinking && isTalking && null}
          </g>
          {/* Mouth */}
          {renderMouth()}
          {/* Cheek blush */}
          <ellipse
            cx="24"
            cy="52"
            rx="3.5"
            ry="2"
            fill="#FF8C42"
            opacity="0.35"
          />
          <ellipse
            cx="46"
            cy="52"
            rx="3.5"
            ry="2"
            fill="#FF8C42"
            opacity="0.35"
          />
          {/* Shimmy sparkles */}
          {mood === "shimmy" && (
            <text x="58" y="28" fontSize="10" fill="#FFD700" opacity="0.9">
              ✨
            </text>
          )}
          {/* Spin stars */}
          {mood === "spin" && (
            <text x="55" y="18" fontSize="12" fill="#FFD700" opacity="0.9">
              ⭐
            </text>
          )}
          {/* Dance sparkles */}
          {isDancing && (
            <>
              <text
                x="1"
                y="22"
                fontSize="13"
                fill="#FFD700"
                className="dance-sparkle-left"
              >
                ✨
              </text>
              <text
                x="54"
                y="16"
                fontSize="11"
                fill="#FFD700"
                className="dance-sparkle-right"
              >
                💃
              </text>
              <text
                x="56"
                y="55"
                fontSize="10"
                fill="#FFD700"
                className="dance-sparkle-left"
                style={{ animationDelay: "0.2s" }}
              >
                ✨
              </text>
            </>
          )}
        </svg>
      </div>
    </button>
  );
}
