interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const badgeColor =
    score > 69
      ? "bg-badge-green text-badge-green-text"
      : score > 49
        ? "bg-badge-yellow text-badge-yellow-text"
        : "bg-badge-red text-badge-red-text";

  const badgeText =
    score > 69 ? "Rất tốt" : score > 49 ? "Khá tốt" : "Cần cải thiện";

  return (
    <div className={`score-badge ${badgeColor}`}>
      <p className="text-xs font-semibold">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;
