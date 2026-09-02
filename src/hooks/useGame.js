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
  PLAYER_IDS,
  START_POSITION,
  TURN_PHASES,
} from "../constants/game";

import { FINAL_SPACE } from "../constants/board";
import { hasReachedFinal } from "../utils/gameRules";

export const useGame = ({
  player1Name = "Player 1",
  player2Name = "Player 2",
  foreplayChallenges,
  oralChallenges,
  finalChallenges,
}) => {
  const [gamePhase, setGamePhase] =
    useState(GAME_PHASES.START);

  const [turnPhase, setTurnPhase] =
    useState(TURN_PHASES.READY);

  const [currentPlayer, setCurrentPlayer] =
    useState(PLAYER_IDS.ONE);

  const [players, setPlayers] = useState({
    [PLAYER_IDS.ONE]: {
      id: PLAYER_IDS.ONE,
      name: player1Name || "Player 1",
      position: START_POSITION,
    },

    [PLAYER_IDS.TWO]: {
      id: PLAYER_IDS.TWO,
      name: player2Name || "Player 2",
      position: START_POSITION,
    },
  });

  const [winner, setWinner] = useState(null);
  const [landingSpace, setLandingSpace] =
    useState(null);

  const dice = useDice();

  const challenge = useChallenge({
    foreplayChallenges,
    oralChallenges,
    finalChallenges,
  });

  const movement = usePlayerMovement();

  const currentPlayerData = useMemo(
    () => players[currentPlayer],
    [players, currentPlayer]
  );

  const otherPlayer = useMemo(
    () =>
      currentPlayer === PLAYER_IDS.ONE
        ? PLAYER_IDS.TWO
        : PLAYER_IDS.ONE,
    [currentPlayer]
  );

  /*
    Start a completely new game.

    Names are passed directly into this function
    so we never depend on React state updating
    before the game starts.
  */

  const startGame = useCallback(
    ({
      player1Name: name1,
      player2Name: name2,
    } = {}) => {
      const finalPlayer1Name =
        name1?.trim() ||
        player1Name?.trim() ||
        "Player 1";

      const finalPlayer2Name =
        name2?.trim() ||
        player2Name?.trim() ||
        "Player 2";

      challenge.initializeChallenges();

      const initialPlayers = {
        [PLAYER_IDS.ONE]: {
          id: PLAYER_IDS.ONE,
          name: finalPlayer1Name,
          position: START_POSITION,
        },

        [PLAYER_IDS.TWO]: {
          id: PLAYER_IDS.TWO,
          name: finalPlayer2Name,
          position: START_POSITION,
        },
      };

      setPlayers(initialPlayers);

      setCurrentPlayer(PLAYER_IDS.ONE);
      setWinner(null);
      setLandingSpace(null);

      setTurnPhase(TURN_PHASES.READY);
      setGamePhase(GAME_PHASES.PLAYING);

      dice.resetDice(1);

      movement.resetMovement({
        [PLAYER_IDS.ONE]: START_POSITION,
        [PLAYER_IDS.TWO]: START_POSITION,
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

  const switchTurn = useCallback(() => {
    setCurrentPlayer((player) =>
      player === PLAYER_IDS.ONE
        ? PLAYER_IDS.TWO
        : PLAYER_IDS.ONE
    );

    setLandingSpace(null);
    setTurnPhase(TURN_PHASES.READY);
  }, []);

  const handleMovementComplete = useCallback(
    (playerId, newPosition) => {
      const playerWhoMoved = players[playerId];

      if (!playerWhoMoved) {
        return;
      }

      const updatedPlayer = {
        ...playerWhoMoved,
        position: newPosition,
      };

      setPlayers((previousPlayers) => ({
        ...previousPlayers,
        [playerId]: updatedPlayer,
      }));

      setLandingSpace(newPosition);
      setTurnPhase(TURN_PHASES.LANDED);

      if (hasReachedFinal(newPosition)) {
        const finalWinner = {
          ...updatedPlayer,
          position: FINAL_SPACE,
        };

        setWinner(finalWinner);
        setGamePhase(GAME_PHASES.FINAL);

        challenge.revealChallenge(FINAL_SPACE);

        return;
      }

      setGamePhase(GAME_PHASES.CHALLENGE);

      challenge.revealChallenge(newPosition);
    },
    [
      challenge,
      players,
    ]
  );

  const handleRoll = useCallback(
    async () => {
      if (
        gamePhase !== GAME_PHASES.PLAYING ||
        turnPhase !== TURN_PHASES.READY ||
        dice.isRolling ||
        movement.isMoving ||
        winner
      ) {
        return;
      }

      setTurnPhase(TURN_PHASES.ROLLING);

      const result = await dice.roll();

      if (!result) {
        setTurnPhase(TURN_PHASES.READY);
        return;
      }

      /*
        A player needs an exact roll to reach the final
        space. Overshoots do not move the piece or reveal
        another challenge; the turn simply passes.
      */
      if (
        currentPlayerData.position + result >
        FINAL_SPACE
      ) {
        switchTurn();
        return;
      }

      setTurnPhase(TURN_PHASES.MOVING);

      const started =
        movement.movePlayer(
          currentPlayer,
          currentPlayerData.position,
          result,
          handleMovementComplete
        );

      if (!started) {
        setTurnPhase(TURN_PHASES.READY);
      }
    },
    [
      currentPlayer,
      currentPlayerData.position,
      dice,
      gamePhase,
      handleMovementComplete,
      movement,
      switchTurn,
      turnPhase,
      winner,
    ]
  );

  const continueAfterChallenge =
    useCallback(() => {
      if (
        gamePhase !==
          GAME_PHASES.CHALLENGE ||
        turnPhase !== TURN_PHASES.LANDED
      ) {
        return;
      }

      challenge.closeChallenge();

      setGamePhase(GAME_PHASES.PLAYING);

      switchTurn();
    }, [
      challenge,
      gamePhase,
      switchTurn,
      turnPhase,
    ]);

  const completeFinalChallenge =
    useCallback(() => {
      if (
        gamePhase !== GAME_PHASES.FINAL ||
        !winner
      ) {
        return;
      }

      challenge.closeChallenge();

      setGamePhase(GAME_PHASES.GAME_OVER);
      setTurnPhase(TURN_PHASES.LANDED);
    }, [
      challenge,
      gamePhase,
      winner,
    ]);

  const restartGame = useCallback(() => {
    challenge.resetChallenges();

    dice.resetDice(1);

    movement.resetMovement({
      [PLAYER_IDS.ONE]: START_POSITION,
      [PLAYER_IDS.TWO]: START_POSITION,
    });

    setPlayers({
      [PLAYER_IDS.ONE]: {
        id: PLAYER_IDS.ONE,
        name: player1Name || "Player 1",
        position: START_POSITION,
      },

      [PLAYER_IDS.TWO]: {
        id: PLAYER_IDS.TWO,
        name: player2Name || "Player 2",
        position: START_POSITION,
      },
    });

    setCurrentPlayer(PLAYER_IDS.ONE);
    setWinner(null);
    setLandingSpace(null);

    setTurnPhase(TURN_PHASES.READY);
    setGamePhase(GAME_PHASES.START);
  }, [
    challenge,
    dice,
    movement,
    player1Name,
    player2Name,
  ]);

  return {
    gamePhase,
    turnPhase,

    currentPlayer,
    currentPlayerData,
    otherPlayer,

    players,
    winner,
    landingSpace,

    diceValue: dice.diceValue,
    isRolling: dice.isRolling,

    visualPositions:
      movement.visualPositions,

    isMoving: movement.isMoving,

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
