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

  if (!summary) return <div className="min-h-screen flex justify-center items-center">Loading. . .</div>;

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
      <div className="bg-[#DDD] p-3">
        <div className="flex flex-col bg-white border-2 border-black rounded-2xl p-5">
          <p className="flex flex-col items-end font-semibold text-[16px] mb-2">
            สะสมคะแนน
          </p>
          <p className="flex flex-col items-end font-semibold text-[16px]">
            คะแนนครบ 10,000 รับรางวัลใหญ่
          </p>
          <p className="flex flex-col items-end text-[#FF2428] font-bold text-[24px] mb-10">
            {summary.totalScore.toLocaleString()}/10,000
          </p>
          <div>
            <ProgressBar current={summary.totalScore} max={10000} />
          </div>
          <div className="flex justify-end gap-2">
            {summary.rewards.map((reward) => (
              <RewardCheckpointButton
                key={reward.id}
                label={`กดรับรางวัล ${reward.name}`}
                rewardName={reward.name}
                rewardId={reward.id}
                canClaim={summary.totalScore >= reward.checkpoint}
                claimed={reward.claimed}
                loading={claimingRewardId === reward.id}
                onClaim={() => handleClaimReward(reward.id, reward.name)}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-center py-5">
          <button
            onClick={handleReset}
            className="bg-[#1E00FF] hover:bg-[#1500ad] font-bold text-white text-[20px] px-4 py-2 rounded-full transition duration-300 ease-in-out"
          >
            RESET
          </button>
        </div>
        <div>
          <Tabs active={activeTab} onChange={setActiveTab} />

          <div className="pb-28">
            {activeTab === "play" && (
              <ul className="mt-3">
                {playHistory.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-5 px-10 py-2 border"
                  >
                    <div className="bg-gradient-to-b from-[#973E40] to-[#F41C20] rounded-full p-8"></div>
                    <div>
                      <p className="text-[16px] font-bold">
                        เล่นได้ {item.score} คะแนน
                      </p>
                      <p className="text-[14px] font-[400] text-[#A3A3A3]">
                        เล่นเมื่อ {new Date(item.playedAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "reward" && (
              <ul className="mt-3">
                {rewardHistory.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-5 px-10 py-2 border"
                  >
                    <div className="bg-gradient-to-b from-[#091050] to-[#5D1CF4] rounded-full p-8"></div>
                    <div>
                      <p className="text-[16px] font-bold">
                        ได้รับรางวัล {item.rewardName}
                      </p>
                      <p className="text-[14px] font-[400] text-[#A3A3A3]">
                        ได้รับเมื่อ {new Date(item.claimedAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

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
