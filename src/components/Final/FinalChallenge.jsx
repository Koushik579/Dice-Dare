import Modal from "../UI/Modal";
import Button from "../UI/Button";
import ChallengeCard from "../Challenge/ChallengeCard";
import "./FinalChallenge.css";

const FinalChallenge = ({
  challenge,
  playerName = "",
  isOpen = false,
  onComplete,
}) => {
  if (!challenge) {
    return null;
  }

  const handleComplete = () => {
    onComplete?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleComplete}
      closeOnOverlay={false}
      closeOnEscape={false}
      showCloseButton={false}
      className="final-challenge"
    >
      <div className="final-challenge__content">
        <div className="final-challenge__header">
          <span className="final-challenge__icon">
            ★
          </span>

          <div>
            <span className="final-challenge__eyebrow">
              You reached the final
            </span>

            <h2 className="final-challenge__heading">
              One Last Challenge
            </h2>
          </div>
        </div>

        <ChallengeCard
          challenge={challenge}
          type="final"
          playerName={playerName}
        />

        <div className="final-challenge__actions">
          <Button
            variant="primary"
            size="large"
            onClick={handleComplete}
          >
            Complete Final Challenge
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FinalChallenge;