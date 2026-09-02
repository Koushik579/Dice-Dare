import {
  useCallback,
  useState,
} from "react";

import {
  createChallengePool,
  getChallengeForSpace,
  selectFinalChallenge,
} from "../utils/challengePicker";

export const useChallenge = ({
  foreplayChallenges = [],
  oralChallenges = [],
  finalChallenges = [],
}) => {
  const [challengePool, setChallengePool] =
    useState({
      foreplay: [],
      oral: [],
    });

  const [activeChallenge, setActiveChallenge] =
    useState(null);

  const [finalChallenge, setFinalChallenge] =
    useState(null);

  /*
    --------------------------------------------------
    INITIALIZE CHALLENGES
    --------------------------------------------------
  */

  const initializeChallenges =
    useCallback(() => {
      const pool =
        createChallengePool(
          foreplayChallenges,
          oralChallenges
        );

      setChallengePool(pool);

      setActiveChallenge(null);
      setFinalChallenge(null);

      return pool;
    }, [
      foreplayChallenges,
      oralChallenges,
    ]);

  /*
    --------------------------------------------------
    GET CHALLENGE FOR A SPACE
    --------------------------------------------------
  */

  const getChallenge =
    useCallback(
      (space, poolOverride = null) => {
        const pool =
          poolOverride || challengePool;

        if (!pool) {
          return null;
        }

        return getChallengeForSpace(
          space,
          pool
        );
      },
      [challengePool]
    );

  /*
    --------------------------------------------------
    REVEAL CHALLENGE
    --------------------------------------------------
  */

  const revealChallenge =
    useCallback(
      (space, poolOverride = null) => {
        /*
          FINAL SPACE

          The final challenge is selected only
          when somebody reaches 37.
        */
        if (space === 37) {
          const selectedFinalChallenge =
            selectFinalChallenge(
              finalChallenges
            );

          setFinalChallenge(
            selectedFinalChallenge
          );

          return selectedFinalChallenge;
        }

        /*
          Normal space.
        */
        const challenge =
          getChallenge(
            space,
            poolOverride
          );

        setActiveChallenge(
          challenge
        );

        return challenge;
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
      setChallengePool({
        foreplay: [],
        oral: [],
      });

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