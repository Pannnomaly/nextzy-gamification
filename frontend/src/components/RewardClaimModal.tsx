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
        <h2 className="text-[#333333] text-[24px] font-[500] mb-2">
          ยินดีด้วย
        </h2>
        <p className="text-[#565656] text-[16px] font-[400] mb-6">
          คุณได้รับ <strong>{rewardName}</strong>
        </p>

        <button
          onClick={onClose}
          className="bg-[#FFC124] hover:bg-[#cc9a1b] text-white text-[16px] font-[600] px-6 py-2 rounded-full w-full transition duration-300 ease-in-out"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
