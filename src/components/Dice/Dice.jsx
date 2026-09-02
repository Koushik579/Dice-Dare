import "./Dice.css";

const Dice = ({
  value = 1,
  isRolling = false,
  disabled = false,
  onRoll,
}) => {
  const validValue = Math.min(6, Math.max(1, Number(value) || 1));

  return (
    <div className="dice-control">
      <button
        type="button"
        className={`dice ${
          isRolling ? "dice--rolling" : ""
        }`}
        onClick={onRoll}
        disabled={disabled || isRolling}
        aria-label={
          isRolling
            ? "Dice is rolling"
            : `Roll dice, current value ${validValue}`
        }
      >
        <span
          className={`dice__face dice__face--${validValue}`}
          aria-hidden="true"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <span
              key={index}
              className={`dice__dot dice__dot--${index + 1}`}
            />
          ))}
        </span>
      </button>

      <div
        className="dice-control__label"
        aria-live="polite"
      >
        {isRolling ? "Rolling..." : "Roll Dice"}
      </div>
    </div>
  );
};

export default Dice;