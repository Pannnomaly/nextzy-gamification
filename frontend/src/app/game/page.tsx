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

      startAnimation(result.earnedScore);
    } catch (error) {
      console.error("Failed to start game", error);
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
      <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#FFF9F2] to-[#fad8af]">
        <p className="text-[24px] font-bold mt-14 mb-20">
          คะแนนสะสม {displayTotalScore.toLocaleString()} / 10,000
        </p>

        <div className="flex gap-3 justify-center mt-20">
          {SCORES.map((score) => {
            const isFaded = fadedScores.includes(score);
            const isFinal = revealResult && score === lockedResult;

            return (
              <div
                key={score}
                className="px-4 py-2 rounded-xl text-[#09862E] text-[24px] font-[600]"
                style={{
                  opacity: isFaded ? 0.25 : 1,
                  background: isFinal ? "#0EF76F" : "#1AE3D6",
                  transform: isFinal ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              >
                {score}
              </div>
            );
          })}
        </div>

        <button
          className="px-4 py-2 mt-14 rounded-2xl text-[20px] font-bold text-white bg-[#FF2428] hover:bg-[#c01b1e] transition duration-300 ease-in-out"
          onClick={handlePlay}
          disabled={isScoreMaxed || isPlaying}
        >
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
