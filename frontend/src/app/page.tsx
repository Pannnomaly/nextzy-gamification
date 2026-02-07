"use client";

import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProgressBar from "@/src/components/ProgressBar";
import Tabs from "@/src/components/Tabs";
import RewardCheckpointButton from "@/src/components/RewardCheckpointButton";
import RewardClaimModal from "@/src/components/RewardClaimModal";
import PrimaryActionButton from "@/src/components/PrimaryActionButton";

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
  const router = useRouter();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [activeTab, setActiveTab] = useState<"play" | "reward">("play");
  const [playHistory, setPlayHistory] = useState<PlayHistoryItem[]>([]);
  const [rewardHistory, setRewardHistory] = useState<RewardHistoryItem[]>([]);
  const [claimingRewardId, setClaimingRewardId] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [claimedRewardName, setClaimedRewardName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryData, playData, rewardData] = await Promise.all([
          api.getUserSummary(),
          api.getPlayHistory(),
          api.getRewardHistory(),
        ]);

        setSummary(summaryData);
        setPlayHistory(playData.items);
        setRewardHistory(rewardData.items);
      } catch (error) {
        console.error("Failed to fetch user summary", error);
      }
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
      console.error("Failed to reset game", error);
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
      console.error("Failed to claim reward", error);
    } finally {
      setClaimingRewardId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div>
        <div>
          <p>สะสมคะแนน</p>
          <p>คะแนนครบ 10,000 รับรางวัลใหญ่</p>
          <p>
              {summary.totalScore.toLocaleString()}/10,000
          </p>
          <ProgressBar current={summary.totalScore} max={10000} />
        </div>
      </div>
      <div>

      </div>
      {summary.rewards.map((reward) => (
            <RewardCheckpointButton
              key={reward.id}
              label={`claim ${reward.name}`}
              rewardName={reward.name}
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
        <PrimaryActionButton
          label="ไปเล่นเกม"
          onClick={() => router.push("/game")}
        />

      <RewardClaimModal
        open={showRewardModal}
        rewardName={claimedRewardName}
        onClose={() => setShowRewardModal(false)}
      />
    </div>
  );
}
