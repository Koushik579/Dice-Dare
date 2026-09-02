import Button from "../UI/Button";
import "./GameOver.css";

const GameOver = ({
  winner,
  onRestart,
}) => {
  if (!winner) {
    return null;
  }

  return (
    <section
      className="game-over"
      aria-label="Game over"
    >
      <div className="game-over__glow" />

      <div className="game-over__content">
        <div className="game-over__badge">
          GAME COMPLETE
        </div>

        <div className="game-over__trophy">
          <span aria-hidden="true">★</span>
        </div>

        <p className="game-over__eyebrow">
          We have a winner
        </p>

        <h1 className="game-over__title">
          {winner.name}
        </h1>

        <p className="game-over__message">
          Reached the final and completed the
          challenge.
        </p>

        <div className="game-over__position">
          <span>FINAL SPACE</span>
          <strong>37</strong>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={onRestart}
        >
          Play Again
        </Button>
      </div>
    </section>
  );
};

export default GameOver;