import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MOVEMENT_STEP_DELAY,
  PLAYER_IDS,
} from "../constants/game";

import {
  calculateNewPosition,
} from "../utils/gameRules";

const INITIAL_POSITIONS = {
  [PLAYER_IDS.ONE]: 0,
  [PLAYER_IDS.TWO]: 0,
};

export const usePlayerMovement = () => {
  const [visualPositions, setVisualPositions] =
    useState(INITIAL_POSITIONS);

  const [isMoving, setIsMoving] =
    useState(false);

  const [movingPlayerId, setMovingPlayerId] =
    useState(null);

  const movementTimerRef = useRef(null);
  const movementIdRef = useRef(0);

  const clearMovementTimer = useCallback(() => {
    if (movementTimerRef.current) {
      clearTimeout(
        movementTimerRef.current
      );

      movementTimerRef.current = null;
    }
  }, []);

  const movePlayer = useCallback(
    (
      playerId,
      currentPosition,
      diceValue,
      onComplete
    ) => {
      if (isMoving) {
        return false;
      }

      const targetPosition =
        calculateNewPosition(
          currentPosition,
          diceValue
        );

      const movementId =
        movementIdRef.current + 1;

      movementIdRef.current = movementId;

      setIsMoving(true);
      setMovingPlayerId(playerId);

      setVisualPositions((previous) => ({
        ...previous,
        [playerId]: currentPosition,
      }));

      let nextPosition = currentPosition;

      const completeMovement = () => {
        if (
          movementId !==
          movementIdRef.current
        ) {
          return;
        }

        setVisualPositions((previous) => ({
          ...previous,
          [playerId]: targetPosition,
        }));

        setIsMoving(false);
        setMovingPlayerId(null);
        movementTimerRef.current = null;

        /*
          IMPORTANT:
          Explicitly return BOTH the player ID
          and the final position.

          This prevents useGame from depending
          on a stale currentPlayer closure.
        */
        onComplete?.(
          playerId,
          targetPosition
        );
      };

      const moveNextStep = () => {
        if (
          movementId !==
          movementIdRef.current
        ) {
          return;
        }

        if (
          nextPosition >=
          targetPosition
        ) {
          completeMovement();
          return;
        }

        nextPosition += 1;

        setVisualPositions((previous) => ({
          ...previous,
          [playerId]: nextPosition,
        }));

        if (
          nextPosition >=
          targetPosition
        ) {
          movementTimerRef.current =
            setTimeout(
              completeMovement,
              MOVEMENT_STEP_DELAY
            );

          return;
        }

        movementTimerRef.current =
          setTimeout(
            moveNextStep,
            MOVEMENT_STEP_DELAY
          );
      };

      if (
        targetPosition ===
        currentPosition
      ) {
        completeMovement();
      } else {
        moveNextStep();
      }

      return true;
    },
    [isMoving]
  );

  const resetMovement = useCallback(
    (positions = INITIAL_POSITIONS) => {
      movementIdRef.current += 1;

      clearMovementTimer();

      setIsMoving(false);
      setMovingPlayerId(null);

      setVisualPositions({
        ...INITIAL_POSITIONS,
        ...positions,
      });
    },
    [clearMovementTimer]
  );

  const setVisualPosition = useCallback(
    (playerId, position) => {
      setVisualPositions((previous) => ({
        ...previous,
        [playerId]: position,
      }));
    },
    []
  );

  useEffect(() => {
    return () => {
      movementIdRef.current += 1;
      clearMovementTimer();
    };
  }, [clearMovementTimer]);

  return {
    visualPositions,
    isMoving,
    movingPlayerId,
    movePlayer,
    resetMovement,
    setVisualPosition,
  };
};