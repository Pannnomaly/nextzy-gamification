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
        className="px-4 py-2 rounded-full bg-gray-200 text-gray-400 text-sm"
      >
        {`claimed ${rewardName}`}
      </button>
    );
  }

  return (
    <button
      disabled={!canClaim || loading}
      onClick={() => onClaim(rewardId)}
      className={`px-4 py-2 rounded-full text-sm transition
        ${
          canClaim
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-100 text-gray-400"
        }`}
    >
      {loading ? "Claiming reward. . ." : label}
    </button>
  );
}
