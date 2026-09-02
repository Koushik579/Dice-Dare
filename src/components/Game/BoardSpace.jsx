import "./BoardSpace.css";

const BoardSpace = ({
  space,
  type,
  isCurrent = false,
  isLanding = false,
  isFinal = false,
}) => {
  const typeLabel = {
    foreplay: "Foreplay",
    oral: "Oral",
    final: "Final",
  };

  const classes = [
    "board-space",
    `board-space--${type}`,
    isCurrent ? "board-space--current" : "",
    isLanding ? "board-space--landing" : "",
    isFinal ? "board-space--final" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      data-space={space}
      aria-label={
        isFinal
          ? "Final space, 37"
          : `Space ${space}, ${typeLabel[type]}`
      }
    >
      <div className="board-space__number">
        {space}
      </div>

      <div className="board-space__label">
        {isFinal
          ? "FINAL"
          : typeLabel[type]}
      </div>

      {isLanding && (
        <>
          <div
            className="board-space__landing-effect"
            aria-hidden="true"
          />

          <div
            className="board-space__landing-ring"
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
};

export default BoardSpace;