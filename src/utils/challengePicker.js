import {
  randomItems,
  randomItem,
} from "./random";

export const selectChallenges = (
  challenges,
  count
) => {
  if (
    !Array.isArray(challenges) ||
    challenges.length === 0
  ) {
    return [];
  }

  const selected = [];

  /*
    Each board section needs one challenge for every
    space. If there are fewer source challenges, shuffle
    the list again before reusing entries so repeats are
    still assigned randomly rather than in a fixed order.
  */
  while (selected.length < count) {
    const remainingCount =
      count - selected.length;

    selected.push(
      ...randomItems(
        challenges,
        Math.min(remainingCount, challenges.length)
      )
    );
  }

  return selected;
};

export const selectFinalChallenge = (
  challenges
) => {
  if (
    !Array.isArray(challenges) ||
    challenges.length === 0
  ) {
    return null;
  }

  return randomItem(challenges);
};

export const createChallengePool = (
  foreplayChallenges,
  oralChallenges
) => {
  return {
    foreplay: selectChallenges(
      foreplayChallenges,
      18
    ),

    oral: selectChallenges(
      oralChallenges,
      18
    ),
  };
};

export const getChallengeForSpace = (
  space,
  challengePool
) => {
  if (!challengePool) {
    return null;
  }

  /*
    FOREPLAY: 1–18
  */

  if (
    space >= 1 &&
    space <= 18
  ) {
    const index = space - 1;
    const challenges = challengePool.foreplay ?? [];

    return challenges.length > 0
      ? challenges[index % challenges.length]
      : null;
  }

  /*
    ORAL: 19–36
  */

  if (
    space >= 19 &&
    space <= 36
  ) {
    const index = space - 19;
    const challenges = challengePool.oral ?? [];

    return challenges.length > 0
      ? challenges[index % challenges.length]
      : null;
  }

  return null;
};
