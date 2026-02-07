"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import PrimaryActionButton from "@/src/components/PrimaryActionButton";
import GameResultModal from "@/src/components/GameResultModal";

const SCORES = [300, 500, 1000, 3000];

export default function GamePage() {
  const router = useRouter();

  const [totalScore, setTotalScore] = useState<number>(0);
  const [displayTotalScore, setDisplayTotalScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMaxReached, setIsMaxReached] = useState(false);

  const [lockedResult, setLockedResult] = useState<number | null>(null);
  const [fadedScores, setFadedScores] = useState<number[]>([]);
  const [revealResult, setRevealResult] = useState(false);

  const [earnedScore, setEarnedScore] = useState<number | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const isScoreMaxed = totalScore >= 10000;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await api.getUserSummary();
        setTotalScore(summary.totalScore);
        setDisplayTotalScore(summary.totalScore);
      } catch (error) {
        console.error("Failed to fetch user summary", error);
      }
    };

    fetchSummary();
  }, []);

  const handlePlay = async () => {
    if (isScoreMaxed) {
    console.warn("Score already maxed. Play disabled.");
    return;
  }

  if (isPlaying) return;

    setIsPlaying(true);
    setRevealResult(false);
    setFadedScores([]);

    try {
      const result = await api.playGame();

      setLockedResult(result.earnedScore);
      setTotalScore(result.totalScore);
      setIsMaxReached(result.isMaxScoreReached);

      startAnimation(result.earnedScore);
    } catch (error) {
      console.error(error);
      setIsPlaying(false);
    }
  };

  const startAnimation = (finalScore: number) => {
    let remaining = [...SCORES];

    const interval = setInterval(() => {
      if (remaining.length <= 1) {
        clearInterval(interval);

        setRevealResult(true);
        setEarnedScore(finalScore);
        setDisplayTotalScore(totalScore + finalScore);
        setShowResultModal(true);
        setIsPlaying(false);
        return;
      }

      const candidates = remaining.filter((s) => s !== finalScore);
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const scoreToFade = candidates[randomIndex];

      setFadedScores((prev) => [...prev, scoreToFade]);
      remaining = remaining.filter((s) => s !== scoreToFade);
    }, 350);
  };

  return (
    <>
      <main style={{ padding: 24, textAlign: "center" }}>
        <h1>Game</h1>
        <p style={{ fontWeight: "bold", marginBottom: 16 }}>
          คะแนนสะสม {displayTotalScore.toLocaleString()} / 10,000
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          {SCORES.map((score) => {
            const isFaded = fadedScores.includes(score);
            const isFinal = revealResult && score === lockedResult;

            return (
              <div
                key={score}
                style={{
                  opacity: isFaded ? 0.25 : 1,
                  background: isFinal ? "#34d399" : "#5eead4",
                  transform: isFinal ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              >
                {score}
              </div>
            );
          })}
        </div>

        <button onClick={handlePlay} disabled={isScoreMaxed || isPlaying}>
          {isScoreMaxed
            ? "คะแนนครบแล้ว"
            : isPlaying
              ? "กำลังสุ่ม..."
              : "สุ่มคะแนน"}
        </button>

        <PrimaryActionButton
          label="กลับหน้าหลัก"
          onClick={() => router.push("/")}
        />
      </main>
      <GameResultModal
        open={showResultModal && earnedScore !== null}
        earnedScore={earnedScore ?? 0}
        onClose={() => setShowResultModal(false)}
      />
    </>
  );
}
