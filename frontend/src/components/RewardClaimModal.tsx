type RewardClaimModalProps = {
  open: boolean;
  rewardName: string;
  onClose: () => void;
};

export default function RewardClaimModal({
  open,
  rewardName,
  onClose,
}: RewardClaimModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl p-6 w-[300px] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-lg font-bold mb-2">ยินดีด้วย</h2>
        <p className="text-sm text-gray-600 mb-6">
          คุณได้รับ <strong>{rewardName}</strong>
        </p>

        <button
          onClick={onClose}
          className="bg-yellow-400 text-white px-6 py-2 rounded-full w-full"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
