import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  createChallengePool,
  getChallengeForSpace,
  selectFinalChallenge,
} from "../utils/challengePicker";

const EMPTY_POOL = {
  male: {
    foreplay: [],
    oral: [],
  },
  female: {
    foreplay: [],
    oral: [],
  },
};

export const useChallenge = ({
  foreplayMaleChallenges = [],
  foreplayFemaleChallenges = [],

  oralMaleChallenges = [],
  oralFemaleChallenges = [],

  finalChallenges = [],
}) => {
  const [challengePool, setChallengePool] =
    useState(EMPTY_POOL);

  const [activeChallenge, setActiveChallenge] =
    useState(null);

  const [finalChallenge, setFinalChallenge] =
    useState(null);

  /*
    Keep a synchronous copy of the pool.

    React state updates are asynchronous, so this
    prevents the first dice roll from seeing an
    empty challenge pool immediately after starting
    the game.
  */
  const challengePoolRef =
    useRef(EMPTY_POOL);

  /*
    --------------------------------------------------
    INITIALIZE
    --------------------------------------------------
  */

  const initializeChallenges =
    useCallback(() => {
      const newPool =
        createChallengePool({
          foreplayMaleChallenges,
          foreplayFemaleChallenges,

          oralMaleChallenges,
          oralFemaleChallenges,
        });

      challengePoolRef.current = newPool;

      setChallengePool(newPool);

      setActiveChallenge(null);
      setFinalChallenge(null);

      return newPool;
    }, [
      foreplayMaleChallenges,
      foreplayFemaleChallenges,
      oralMaleChallenges,
      oralFemaleChallenges,
    ]);

  /*
    --------------------------------------------------
    GET CHALLENGE
    --------------------------------------------------
  */

  const getChallenge =
    useCallback(
      (space, gender, poolOverride = null) => {
        const pool =
          poolOverride ||
          challengePoolRef.current;

        if (!pool || !gender) {
          return null;
        }

        const genderPool =
          pool[gender];

        if (!genderPool) {
          return null;
        }

        return getChallengeForSpace(
          space,
          genderPool
        );
      },
      []
    );

  /*
    --------------------------------------------------
    REVEAL CHALLENGE
    --------------------------------------------------
  */

  const revealChallenge =
    useCallback(
      (
        space,
        gender,
        poolOverride = null
      ) => {
        /*
          FINAL SPACE

          Space 37 does NOT use the normal
          challenge pool.

          Exactly one random challenge is
          selected from final.js.
        */
        if (space === 37) {
          const selectedFinal =
            selectFinalChallenge(
              finalChallenges
            );

          setFinalChallenge(
            selectedFinal
          );

          return selectedFinal;
        }

        /*
          Normal spaces require the player's
          gender so we know which dataset to use.
        */
        if (!gender) {
          console.warn(
            "Challenge selection requires a player gender."
          );

          return null;
        }

        const selectedChallenge =
          getChallenge(
            space,
            gender,
            poolOverride
          );

        setActiveChallenge(
          selectedChallenge
        );

        return selectedChallenge;
      },
      [
        finalChallenges,
        getChallenge,
      ]
    );

  /*
    --------------------------------------------------
    CLOSE NORMAL CHALLENGE
    --------------------------------------------------
  */

  const closeChallenge =
    useCallback(() => {
      setActiveChallenge(null);
    }, []);

  /*
    --------------------------------------------------
    CLOSE FINAL CHALLENGE
    --------------------------------------------------
  */

  const closeFinalChallenge =
    useCallback(() => {
      setFinalChallenge(null);
    }, []);

  /*
    --------------------------------------------------
    RESET
    --------------------------------------------------
  */

  const resetChallenges =
    useCallback(() => {
      challengePoolRef.current =
        EMPTY_POOL;

      setChallengePool(EMPTY_POOL);
      setActiveChallenge(null);
      setFinalChallenge(null);
    }, []);

  return {
    challengePool,

    activeChallenge,
    finalChallenge,

    initializeChallenges,

    getChallenge,
    revealChallenge,

    closeChallenge,
    closeFinalChallenge,

    resetChallenges,
  };
};