import "./ChallengeCard.css";

const ChallengeCard = ({
  challenge,
  type = "foreplay",
  playerName = "",
}) => {
  if (!challenge) {
    return null;
  }

  const typeLabels = {
    foreplay: "Foreplay",
    oral: "Oral",
    final: "Final Challenge",
  };

  const typeLabel =
    typeLabels[type] || "Challenge";

  return (
    <article
      className={[
        "challenge-card",
        `challenge-card--${type}`,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="challenge-card__top">
        <div className="challenge-card__category">
          <span className="challenge-card__category-dot" />
          {typeLabel}
        </div>

        {challenge.id && (
          <span className="challenge-card__number">
            #{challenge.id.split("-").pop()}
          </span>
        )}
      </div>

      <div className="challenge-card__content">
        <span className="challenge-card__eyebrow">
          {playerName
            ? `${playerName}'s Challenge`
            : "Your Challenge"}
        </span>

        <h2 className="challenge-card__title">
          {challenge.title}
        </h2>

        <p className="challenge-card__text">
          {challenge.text}
        </p>
      </div>

      <div className="challenge-card__footer">
        <span className="challenge-card__footer-line" />
        <span className="challenge-card__footer-symbol">
          ✦
        </span>
        <span className="challenge-card__footer-line" />
      </div>
    </article>
  );
};

export default ChallengeCard;