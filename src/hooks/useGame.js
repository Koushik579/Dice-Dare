import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { useDice } from "./useDice";
import { useChallenge } from "./useChallenge";
import { usePlayerMovement } from "./usePlayerMovement";

import {
  GAME_PHASES,
  PLAYER_GENDERS,
  PLAYER_IDS,
  START_POSITION,
  TURN_PHASES,
} from "../constants/game";

import { FINAL_SPACE } from "../constants/board";

import {
  hasReachedFinal,
} from "../utils/gameRules";

export const useGame = ({
  player1Name = "Male Partner",
  player2Name = "Female Partner",

  foreplayMaleChallenges = [],
  foreplayFemaleChallenges = [],

  oralMaleChallenges = [],
  oralFemaleChallenges = [],

  finalChallenges = [],
}) => {
  /* ==================================================
     GAME STATE
  ================================================== */

  const [gamePhase, setGamePhase] =
    useState(GAME_PHASES.START);

  const [turnPhase, setTurnPhase] =
    useState(TURN_PHASES.READY);

  const [currentPlayer, setCurrentPlayer] =
    useState(PLAYER_IDS.ONE);

  /* ==================================================
     PLAYERS
  ================================================== */

  const [players, setPlayers] = useState({
    [PLAYER_IDS.ONE]: {
      id: PLAYER_IDS.ONE,
      name:
        player1Name ||
        "Male Partner",

      gender:
        PLAYER_GENDERS.MALE,

      position:
        START_POSITION,
    },

    [PLAYER_IDS.TWO]: {
      id: PLAYER_IDS.TWO,
      name:
        player2Name ||
        "Female Partner",

      gender:
        PLAYER_GENDERS.FEMALE,

      position:
        START_POSITION,
    },
  });

  const [winner, setWinner] =
    useState(null);

  const [landingSpace, setLandingSpace] =
    useState(null);

  /* ==================================================
     HOOKS
  ================================================== */

  const dice = useDice();

  const challenge =
    useChallenge({
      foreplayMaleChallenges,
      foreplayFemaleChallenges,
      oralMaleChallenges,
      oralFemaleChallenges,
      finalChallenges,
    });

  const movement =
    usePlayerMovement();

  /* ==================================================
     CURRENT PLAYER
  ================================================== */

  const currentPlayerData =
    useMemo(
      () =>
        players[currentPlayer],
      [
        players,
        currentPlayer,
      ]
    );

  const otherPlayer =
    useMemo(
      () =>
        currentPlayer ===
        PLAYER_IDS.ONE
          ? PLAYER_IDS.TWO
          : PLAYER_IDS.ONE,
      [currentPlayer]
    );

  /* ==================================================
     START GAME
  ================================================== */

  const startGame =
    useCallback(
      ({
        maleName,
        femaleName,
      } = {}) => {
        const finalMaleName =
          maleName?.trim() ||
          player1Name?.trim() ||
          "Male Partner";

        const finalFemaleName =
          femaleName?.trim() ||
          player2Name?.trim() ||
          "Female Partner";

        /*
          Create a new random pool for the game.
        */
        challenge.initializeChallenges();

        const initialPlayers = {
          [PLAYER_IDS.ONE]: {
            id: PLAYER_IDS.ONE,

            name:
              finalMaleName,

            gender:
              PLAYER_GENDERS.MALE,

            position:
              START_POSITION,
          },

          [PLAYER_IDS.TWO]: {
            id: PLAYER_IDS.TWO,

            name:
              finalFemaleName,

            gender:
              PLAYER_GENDERS.FEMALE,

            position:
              START_POSITION,
          },
        };

        setPlayers(
          initialPlayers
        );

        setCurrentPlayer(
          PLAYER_IDS.ONE
        );

        setWinner(null);
        setLandingSpace(null);

        setTurnPhase(
          TURN_PHASES.READY
        );

        setGamePhase(
          GAME_PHASES.PLAYING
        );

        dice.resetDice(1);

        movement.resetMovement({
          [PLAYER_IDS.ONE]:
            START_POSITION,

          [PLAYER_IDS.TWO]:
            START_POSITION,
        });
      },
      [
        challenge,
        dice,
        movement,
        player1Name,
        player2Name,
      ]
    );

  /* ==================================================
     SWITCH TURN
  ================================================== */

  const switchTurn =
    useCallback(() => {
      setCurrentPlayer(
        (previousPlayer) =>
          previousPlayer ===
          PLAYER_IDS.ONE
            ? PLAYER_IDS.TWO
            : PLAYER_IDS.ONE
      );

      setLandingSpace(null);

      setTurnPhase(
        TURN_PHASES.READY
      );
    }, []);

  /* ==================================================
     MOVEMENT COMPLETE
  ================================================== */

  const handleMovementComplete =
    useCallback(
      (
        playerId,
        newPosition
      ) => {
        const movedPlayer =
          players[playerId];

        if (!movedPlayer) {
          return;
        }

        /*
          Update the permanent player position.
        */
        setPlayers(
          (previousPlayers) => ({
            ...previousPlayers,

            [playerId]: {
              ...previousPlayers[
                playerId
              ],

              position:
                newPosition,
            },
          })
        );

        setLandingSpace(
          newPosition
        );

        /* ==========================================
           FINAL SPACE
        =========================================== */

        if (
          hasReachedFinal(
            newPosition
          )
        ) {
          const selectedFinalChallenge =
            challenge.revealChallenge(
              FINAL_SPACE
            );

          if (
            !selectedFinalChallenge
          ) {
            console.error(
              "No final challenge found in final.js"
            );

            return;
          }

          setWinner({
            ...movedPlayer,

            position:
              FINAL_SPACE,
          });

          setTurnPhase(
            TURN_PHASES.LANDED
          );

          setGamePhase(
            GAME_PHASES.FINAL
          );

          return;
        }

        /* ==========================================
           NORMAL CHALLENGE
        =========================================== */

        const selectedChallenge =
          challenge.revealChallenge(
            newPosition,
            movedPlayer.gender
          );

        if (
          selectedChallenge
        ) {
          setTurnPhase(
            TURN_PHASES.LANDED
          );

          setGamePhase(
            GAME_PHASES.CHALLENGE
          );

          return;
        }

        /*
          If the selected data file doesn't contain
          a challenge for this space, don't freeze
          the game.
        */
        console.warn(
          `No challenge found for ${movedPlayer.gender} at space ${newPosition}.`
        );

        setTurnPhase(
          TURN_PHASES.READY
        );

        setGamePhase(
          GAME_PHASES.PLAYING
        );

        switchTurn();
      },
      [
        challenge,
        players,
        switchTurn,
      ]
    );

  /* ==================================================
     ROLL DICE
  ================================================== */

  const handleRoll =
    useCallback(
      async () => {
        if (
          gamePhase !==
            GAME_PHASES.PLAYING ||
          turnPhase !==
            TURN_PHASES.READY ||
          dice.isRolling ||
          movement.isMoving ||
          winner
        ) {
          return;
        }

        setTurnPhase(
          TURN_PHASES.ROLLING
        );

        const result =
          await dice.roll();

        if (!result) {
          setTurnPhase(
            TURN_PHASES.READY
          );

          return;
        }

        setTurnPhase(
          TURN_PHASES.MOVING
        );

        const started =
          movement.movePlayer(
            currentPlayer,

            currentPlayerData.position,

            result,

            handleMovementComplete
          );

        if (!started) {
          setTurnPhase(
            TURN_PHASES.READY
          );
        }
      },
      [
        currentPlayer,
        currentPlayerData.position,
        dice,
        gamePhase,
        handleMovementComplete,
        movement,
        turnPhase,
        winner,
      ]
    );

  /* ==================================================
     NORMAL CHALLENGE COMPLETE
  ================================================== */

  const continueAfterChallenge =
    useCallback(() => {
      if (
        gamePhase !==
          GAME_PHASES.CHALLENGE ||
        turnPhase !==
          TURN_PHASES.LANDED
      ) {
        return;
      }

      challenge.closeChallenge();

      setGamePhase(
        GAME_PHASES.PLAYING
      );

      switchTurn();
    }, [
      challenge,
      gamePhase,
      switchTurn,
      turnPhase,
    ]);

  /* ==================================================
     FINAL CHALLENGE COMPLETE
  ================================================== */

  const completeFinalChallenge =
    useCallback(() => {
      if (
        gamePhase !==
          GAME_PHASES.FINAL ||
        !winner
      ) {
        return;
      }

      challenge.closeFinalChallenge();

      setGamePhase(
        GAME_PHASES.GAME_OVER
      );

      setTurnPhase(
        TURN_PHASES.LANDED
      );
    }, [
      challenge,
      gamePhase,
      winner,
    ]);

  /* ==================================================
     RESTART
  ================================================== */

  const restartGame =
    useCallback(() => {
      challenge.resetChallenges();

      dice.resetDice(1);

      movement.resetMovement({
        [PLAYER_IDS.ONE]:
          START_POSITION,

        [PLAYER_IDS.TWO]:
          START_POSITION,
      });

      setPlayers({
        [PLAYER_IDS.ONE]: {
          id: PLAYER_IDS.ONE,

          name:
            player1Name ||
            "Male Partner",

          gender:
            PLAYER_GENDERS.MALE,

          position:
            START_POSITION,
        },

        [PLAYER_IDS.TWO]: {
          id: PLAYER_IDS.TWO,

          name:
            player2Name ||
            "Female Partner",

          gender:
            PLAYER_GENDERS.FEMALE,

          position:
            START_POSITION,
        },
      });

      setCurrentPlayer(
        PLAYER_IDS.ONE
      );

      setWinner(null);
      setLandingSpace(null);

      setTurnPhase(
        TURN_PHASES.READY
      );

      setGamePhase(
        GAME_PHASES.START
      );
    }, [
      challenge,
      dice,
      movement,
      player1Name,
      player2Name,
    ]);

  /* ==================================================
     RETURN
  ================================================== */

  return {
    gamePhase,
    turnPhase,

    currentPlayer,
    currentPlayerData,
    otherPlayer,

    players,
    winner,
    landingSpace,

    diceValue:
      dice.diceValue,

    isRolling:
      dice.isRolling,

    visualPositions:
      movement.visualPositions,

    isMoving:
      movement.isMoving,

    movingPlayerId:
      movement.movingPlayerId,

    activeChallenge:
      challenge.activeChallenge,

    finalChallenge:
      challenge.finalChallenge,

    startGame,
    handleRoll,

    continueAfterChallenge,

    completeFinalChallenge,

    restartGame,
  };
};