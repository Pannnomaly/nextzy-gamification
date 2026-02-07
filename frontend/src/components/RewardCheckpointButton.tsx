type RewardCheckpointButtonProps = {
  label: string;
  rewardName: string;
  rewardId: string;
  canClaim: boolean;
  claimed: boolean;
  onClaim: (rewardId: string) => void;
  loading?: boolean;
};

export default function RewardCheckpointButton({
  label,
  rewardName,
  rewardId,
  canClaim,
  claimed,
  onClaim,
  loading,
}: RewardCheckpointButtonProps) {
  if (claimed) {
    return (
      <button
        disabled
        className="px-3 py-1 rounded-full text-[8px] font-[700] bg-[#FF7B7B] text-white text-sm"
      >
        {`ได้รับรางวัล ${rewardName}แล้ว`}
      </button>
    );
  }

  return (
    <button
      disabled={!canClaim || loading}
      onClick={() => onClaim(rewardId)}
      className={`px-3 py-1 rounded-full text-[8px] font-[700] transition
        ${
          canClaim
            ? "bg-[#FF0004] text-white hover:bg-[#a50003]"
            : "bg-[#DDDDDD] text-white"
        }`}
    >
      {loading ? "กำลังรับรางวัล. . ." : label}
    </button>
  );
}
