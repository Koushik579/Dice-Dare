import {
  randomItems,
  randomItem,
} from "./random";

/*
  Select a fixed number of unique challenges
  from a source dataset.
*/
export const selectChallenges = (
  challenges,
  count = 18
) => {
  if (
    !Array.isArray(challenges) ||
    challenges.length === 0
  ) {
    return [];
  }

  return randomItems(
    challenges,
    Math.min(count, challenges.length)
  );
};

/*
  Select exactly ONE final challenge.
*/
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

/*
  Create the complete challenge pool for
  one gender.

  The source data can contain 100–200+
  challenges, but only 18 are selected
  for each section for the current game.
*/
export const createGenderChallengePool = ({
  foreplayChallenges = [],
  oralChallenges = [],
}) => {
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

/*
  Create all challenge pools for the game.
*/
export const createChallengePool = ({
  foreplayMaleChallenges = [],
  foreplayFemaleChallenges = [],
  oralMaleChallenges = [],
  oralFemaleChallenges = [],
}) => {
  return {
    male:
      createGenderChallengePool({
        foreplayChallenges:
          foreplayMaleChallenges,

        oralChallenges:
          oralMaleChallenges,
      }),

    female:
      createGenderChallengePool({
        foreplayChallenges:
          foreplayFemaleChallenges,

        oralChallenges:
          oralFemaleChallenges,
      }),
  };
};

/*
  Return the challenge assigned to a specific
  board space.

  1–18  → foreplay
  19–36 → oral

  The gender-specific pool is passed in by
  useChallenge.
*/
export const getChallengeForSpace = (
  space,
  genderPool
) => {
  if (
    !genderPool ||
    !Number.isInteger(space)
  ) {
    return null;
  }

  /*
    FOREPLAY
    Spaces 1–18
  */
  if (
    space >= 1 &&
    space <= 18
  ) {
    const challengeIndex =
      space - 1;

    return (
      genderPool.foreplay?.[
        challengeIndex
      ] ?? null
    );
  }

  /*
    ORAL
    Spaces 19–36
  */
  if (
    space >= 19 &&
    space <= 36
  ) {
    const challengeIndex =
      space - 19;

    return (
      genderPool.oral?.[
        challengeIndex
      ] ?? null
    );
  }

  /*
    Space 37 is intentionally excluded.
    Final challenges are selected separately.
  */
  return null;
};