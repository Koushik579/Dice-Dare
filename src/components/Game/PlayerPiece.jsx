import "./PlayerPiece.css";

const PlayerPiece = ({
  player,
  isCurrentPlayer = false,
  isMoving = false,
  isLanding = false,
}) => {
  if (!player) {
    return null;
  }

  const classNames = [
    "player-piece",
    `player-piece--${player.id}`,
    isCurrentPlayer ? "player-piece--current" : "",
    isMoving ? "player-piece--moving" : "",
    isLanding ? "player-piece--landing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      aria-label={`${player.name}, space ${player.position}`}
    >
      <div className="player-piece__shadow" />

      <div className="player-piece__body">
        <div className="player-piece__highlight" />

        <span className="player-piece__initial">
          {player.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {isCurrentPlayer && (
        <div
          className="player-piece__indicator"
          aria-hidden="true"
        >
          <span />
        </div>
      )}
    </div>
  );
};

export default PlayerPiece;