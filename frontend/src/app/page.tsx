"use client";

import { api } from "@/src/lib/api";
import ProgressBar from "@/src/components/ProgressBar";
import Tabs from "@/src/components/Tabs";
import { useEffect, useState } from "react";
import RewardCheckpointButton from "@/src/components/RewardCheckpointButton";
import RewardClaimModal from "@/src/components/RewardClaimModal";

type PlayHistoryItem = {
  id: string;
  score: number;
  playedAt: string;
};

type RewardHistoryItem = {
  id: string;
  rewardName: string;
  checkPoint: number;
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
  const [claimingRewardId, setClaimingRewardId] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [claimedRewardName, setClaimedRewardName] = useState("");

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

  const handleReset = async () => {
    try {
      await api.resetGame();

      const [summaryData, playData, rewardData] = await Promise.all([
        api.getUserSummary(),
        api.getPlayHistory(),
        api.getRewardHistory(),
      ]);

      setSummary(summaryData);
      setPlayHistory(playData.items);
      setRewardHistory(rewardData.items);
    } catch (error) {
      alert("Failed to reset game!");
      console.error(error);
    }
  };

  const handleClaimReward = async (rewardId: string, rewardName: string) => {
    try {
      setClaimingRewardId(rewardId);

      await api.claimReward(rewardId);

      const [summaryData, rewardData] = await Promise.all([
        api.getUserSummary(),
        api.getRewardHistory(),
      ]);

      setSummary(summaryData);
      setRewardHistory(rewardData.items);

      setClaimedRewardName(rewardName);
      setShowRewardModal(true);
    } catch (error) {
      alert("Failed to claim reward!");
      console.error(error);
    } finally {
      setClaimingRewardId(null);
    }
  };

  return (
    <>
      <main style={{ padding: 24 }}>
        <h1>Nextzy Gamification</h1>

        <section style={{ marginTop: 24 }}>
          <h2>Total Score</h2>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>
            {summary.totalScore.toLocaleString()}
          </p>

          <ProgressBar current={summary.totalScore} max={10000} />

          {summary.rewards.map((reward) => (
            <RewardCheckpointButton
              key={reward.id}
              label={`claim ${reward.name}`}
              rewardId={reward.id}
              canClaim={summary.totalScore >= reward.checkpoint}
              claimed={reward.claimed}
              loading={claimingRewardId === reward.id}
              onClaim={() => handleClaimReward(reward.id, reward.name)}
            />
          ))}

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
                  {item.rewardName} ({item.checkPoint}) —{" "}
                  {new Date(item.claimedAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <RewardClaimModal
        open={showRewardModal}
        rewardName={claimedRewardName}
        onClose={() => setShowRewardModal(false)}
      />
    </>
  );
}
