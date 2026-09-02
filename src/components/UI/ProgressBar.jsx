import "./ProgressBar.css";

const ProgressBar = ({
  value = 0,
  max = 37,
  label = "Progress",
  showValue = true,
}) => {
  const safeMax =
    Number(max) > 0 ? Number(max) : 1;

  const safeValue = Math.min(
    safeMax,
    Math.max(0, Number(value) || 0)
  );

  const percentage =
    (safeValue / safeMax) * 100;

  return (
    <div className="progress-bar">
      <div className="progress-bar__header">
        <span className="progress-bar__label">
          {label}
        </span>

        {showValue && (
          <span className="progress-bar__value">
            {safeValue} / {safeMax}
          </span>
        )}
      </div>

      <div
        className="progress-bar__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
      >
        <div
          className="progress-bar__fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;