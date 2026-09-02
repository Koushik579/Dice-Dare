import "./ChallengeModal.css";

const ChallengeModal = ({
  challenge,
  type = "foreplay",
  playerName = "",
  isOpen = false,
  onComplete,
}) => {
  if (!isOpen || !challenge) {
    return null;
  }

  const typeLabels = {
    foreplay: "FOREPLAY",
    oral: "ORAL",
    final: "FINAL",
  };

  const typeLabel =
    typeLabels[type] || "CHALLENGE";

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div
      className="challenge-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-popup-title"
    >
      {/* Background overlay */}
      <div
        className="challenge-popup__backdrop"
        aria-hidden="true"
      />

      {/* Popup */}
      <div className="challenge-popup__card">
        <div className="challenge-popup__top">
          <div
            className={[
              "challenge-popup__category",
              `challenge-popup__category--${type}`,
            ].join(" ")}
          >
            <span className="challenge-popup__dot" />

            {typeLabel}
          </div>

          {challenge.id && (
            <span className="challenge-popup__number">
              #
              {challenge.id
                .split("-")
                .pop()}
            </span>
          )}
        </div>

        <div className="challenge-popup__divider" />

        <div className="challenge-popup__body">
          <span className="challenge-popup__eyebrow">
            {playerName
              ? `${playerName}'s Challenge`
              : "Your Challenge"}
          </span>

          <h2
            id="challenge-popup-title"
            className="challenge-popup__title"
          >
            {challenge.title}
          </h2>

          <p className="challenge-popup__text">
            {challenge.text}
          </p>
        </div>

        <div className="challenge-popup__footer">
          <button
            type="button"
            className="challenge-popup__button"
            onClick={handleComplete}
          >
            <span>
              Challenge Complete
            </span>

            <span
              className="challenge-popup__button-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;