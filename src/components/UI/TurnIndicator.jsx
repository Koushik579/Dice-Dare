import "./TurnIndicator.css";

const TurnIndicator = ({
  currentPlayer,
  player1,
  player2,
  isRolling = false,
  isMoving = false,
}) => {
  const activePlayer =
    currentPlayer === player1.id
      ? player1
      : player2;

  const status = isRolling
    ? "Rolling the dice..."
    : isMoving
      ? "Moving..."
      : "Your turn";

  return (
    <div className="turn-indicator">
      <div
        className={`turn-indicator__avatar turn-indicator__avatar--${activePlayer.id}`}
      >
        {activePlayer.name.charAt(0).toUpperCase()}
      </div>

      <div className="turn-indicator__content">
        <span className="turn-indicator__label">
          Current Turn
        </span>

        <strong className="turn-indicator__name">
          {activePlayer.name}
        </strong>

        <span
          className="turn-indicator__status"
          aria-live="polite"
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default TurnIndicator;