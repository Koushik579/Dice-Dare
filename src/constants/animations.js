export const ANIMATION_TIMINGS = {
  // Dice
  DICE_ROLL: 900,
  DICE_SETTLE: 180,

  // Player movement
  PIECE_MOVE: 280,
  PIECE_LANDING: 500,

  // Landing effects
  LANDING_PULSE: 600,
  LANDING_PARTICLES: 900,

  // Challenge
  CHALLENGE_REVEAL: 400,
  CHALLENGE_EXIT: 300,

  // Final
  FINAL_REVEAL: 800,
  VICTORY: 1200,
};

export const ANIMATION_CLASSES = {
  DICE: {
    ROLLING: "dice--rolling",
    SETTLE: "dice--settle",
  },

  PIECE: {
    MOVING: "piece--moving",
    LANDING: "piece--landing",
  },

  SPACE: {
    ACTIVE: "space--active",
    LANDING: "space--landing",
    FINAL: "space--final",
  },

  CHALLENGE: {
    ENTER: "challenge--enter",
    EXIT: "challenge--exit",
  },
};