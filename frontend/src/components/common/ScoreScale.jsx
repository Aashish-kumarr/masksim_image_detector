export default function ScoreScale({ score = 0, threshold = 0.5 }) {
  // Ensure score is between 0 and 1
  const clampedScore = Math.max(0, Math.min(1, Number(score) || 0));
  const percent = (clampedScore * 100).toFixed(2);
  const thresholdPercent = (threshold * 100).toFixed(2);
  const isSynthetic = clampedScore >= threshold;

  return (
    <div
      className="score-scale-container"
      role="meter"
      aria-label="Detector score on decision scale"
      aria-valuenow={clampedScore}
      aria-valuemin="0"
      aria-valuemax="1"
    >
      <div className="score-bar-track">
        {/* Fill up to score */}
        <div
          className="score-bar-fill"
          style={{
            width: `${percent}%`,
            background: isSynthetic
              ? "linear-gradient(90deg, #3b82f6 0%, #d97706 60%, #dc2626 100%)"
              : "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)",
          }}
        />

        {/* Threshold Line at 0.50 */}
        <div
          className="score-threshold-marker"
          style={{ left: `${thresholdPercent}%` }}
          title={`Decision Threshold: ${threshold.toFixed(4)}`}
        />

        {/* Indicator Pin */}
        <div
          className={`score-pin ${isSynthetic ? "synthetic" : "real"}`}
          style={{ left: `${percent}%` }}
          title={`Score: ${clampedScore.toFixed(4)}`}
        />
      </div>

      <div className="score-labels">
        <div className="score-label-item" style={{ textAlign: "left" }}>
          <span style={{ fontWeight: 600, color: !isSynthetic ? "var(--color-real)" : "var(--text-secondary)" }}>
            Real (0.00)
          </span>
          <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Authentic
          </span>
        </div>

        <div className="score-label-item" style={{ textAlign: "center" }}>
          <span className="mono" style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            Threshold ({threshold.toFixed(2)})
          </span>
          <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Standard Boundary
          </span>
        </div>

        <div className="score-label-item" style={{ textAlign: "right" }}>
          <span style={{ fontWeight: 600, color: isSynthetic ? "var(--color-synthetic)" : "var(--text-secondary)" }}>
            Synthetic (1.00)
          </span>
          <span className="mono" style={{ fontSize: "11px", color: isSynthetic ? "var(--color-synthetic)" : "var(--text-muted)" }}>
            SD Fingerprint
          </span>
        </div>
      </div>
    </div>
  );
}
