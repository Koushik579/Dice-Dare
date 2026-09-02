import {
  FINAL_SPACE,
  FOREPLAY_END,
  ORAL_END,
} from "../constants/board";

/**
 * Calculates a player's new position.
 *
 * Players can only move forward.
 * Players must roll the exact remaining value to reach
 * the final space. An overshoot leaves them in place.
 */
export const calculateNewPosition = (currentPosition, diceValue) => {
  const nextPosition = currentPosition + diceValue;

  return nextPosition > FINAL_SPACE
    ? currentPosition
    : nextPosition;
};

/**
 * Returns the category associated with a board position.
 */
export const getChallengeType = (position) => {
  if (position >= 1 && position <= FOREPLAY_END) {
    return "foreplay";
  }

  if (position > FOREPLAY_END && position <= ORAL_END) {
    return "oral";
  }

  if (position === FINAL_SPACE) {
    return "final";
  }

  return null;
};

/**
 * Checks whether a player has reached the final space.
 */
export const hasReachedFinal = (position) => {
  return position >= FINAL_SPACE;
};

/**
 * Returns the number of spaces a player needs to move.
 */
export const getMovementDistance = (currentPosition, diceValue) => {
  const newPosition = calculateNewPosition(
    currentPosition,
    diceValue
  );

  return newPosition - currentPosition;
};

/**
 * Determines whether a dice roll is valid.
 */
export const isValidDiceValue = (value) => {
  return Number.isInteger(value) && value >= 1 && value <= 6;
};

/**
 * Returns information about a player's next move.
 */
export const getMoveResult = (currentPosition, diceValue) => {
  const newPosition = calculateNewPosition(
    currentPosition,
    diceValue
  );

  return {
    previousPosition: currentPosition,
    newPosition,
    distance: newPosition - currentPosition,
    reachesFinal: hasReachedFinal(newPosition),
    challengeType: getChallengeType(newPosition),
  };
};
