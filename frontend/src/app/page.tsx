"use client";

import { api } from "@/src/lib/api";
import ProgressBar from "@/src/components/ProgressBar";
import Tabs from "@/src/components/Tabs";
import { useEffect, useState } from "react";

type PlayHistoryItem = {
  id: string;
  score: number;
  playedAt: string;
};

type RewardHistoryItem = {
  id: string;
  name: string;
  checkpoint: number;
  claimedAt: string;
};

type RewardSummary = {
  id: string;
  name: string;
  checkpoint: number;
  claimed: boolean;
};

type UserSummary = {
  totalScore: number;
  rewards: RewardSummary[];
};

export default function HomePage() {
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [activeTab, setActiveTab] = useState<"play" | "reward">("play");
  const [playHistory, setPlayHistory] = useState<PlayHistoryItem[]>([]);
  const [rewardHistory, setRewardHistory] = useState<RewardHistoryItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [summaryData, playData, rewardData] = await Promise.all([
        api.getUserSummary(),
        api.getPlayHistory(),
        api.getRewardHistory(),
      ]);

      setSummary(summaryData);
      setPlayHistory(playData.items);
      setRewardHistory(rewardData.items);
    }

    fetchData();
  }, []);

  if (!summary) return <div style={{ padding: 24 }}>Loading. . .</div>;

  async function handleReset() {
    await api.resetGame();

    const [summaryData, playData, rewardData] = await Promise.all([
      api.getUserSummary(),
      api.getPlayHistory(),
      api.getRewardHistory(),
    ]);

    setSummary(summaryData);
    setPlayHistory(playData.items);
    setRewardHistory(rewardData.items);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Nextzy Gamification</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Total Score</h2>
        <p style={{ fontSize: 24, fontWeight: "bold" }}>
          {summary.totalScore.toLocaleString()}
        </p>
        
        <ProgressBar current={summary.totalScore} max={10000} />

        <button
          onClick={handleReset}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          RESET
        </button>
      </section>

      <section style={{ marginTop: 32 }}>
        <Tabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "play" && (
          <ul style={{ marginTop: 16 }}>
            {playHistory.map((item) => (
              <li key={item.id}>
                +{item.score} points —{" "}
                {new Date(item.playedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}

        {activeTab === "reward" && (
          <ul style={{ marginTop: 16 }}>
            {rewardHistory.map((item) => (
              <li key={item.id}>
                {item.name} ({item.checkpoint}) —{" "}
                {new Date(item.claimedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
