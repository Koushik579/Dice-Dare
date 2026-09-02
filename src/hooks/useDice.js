import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { DICE_ROLL_DURATION } from "../constants/game";
import { rollDice } from "../utils/random";

const DICE_FACE_COUNT = 6;
const DICE_TICK_INTERVAL = 80;

export const useDice = () => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const rollIntervalRef = useRef(null);
  const finishTimeoutRef = useRef(null);
  const resolverRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }

    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
  }, []);

  const roll = useCallback(() => {
    if (isRolling) {
      return null;
    }

    setIsRolling(true);

    return new Promise((resolve) => {
      resolverRef.current = resolve;

      rollIntervalRef.current = setInterval(() => {
        const previewValue =
          Math.floor(
            Math.random() * DICE_FACE_COUNT
          ) + 1;

        setDiceValue(previewValue);
      }, DICE_TICK_INTERVAL);

      finishTimeoutRef.current = setTimeout(() => {
        const result = rollDice();

        clearTimers();

        setDiceValue(result);
        setIsRolling(false);

        if (resolverRef.current) {
          resolverRef.current(result);
          resolverRef.current = null;
        }
      }, DICE_ROLL_DURATION);
    });
  }, [isRolling, clearTimers]);

  const resetDice = useCallback(
    (value = 1) => {
      clearTimers();

      if (resolverRef.current) {
        resolverRef.current(null);
        resolverRef.current = null;
      }

      setIsRolling(false);
      setDiceValue(value);
    },
    [clearTimers]
  );

  useEffect(() => {
    return () => {
      clearTimers();

      if (resolverRef.current) {
        resolverRef.current(null);
        resolverRef.current = null;
      }
    };
  }, [clearTimers]);

  return {
    diceValue,
    isRolling,
    roll,
    resetDice,
  };
};