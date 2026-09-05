export const PLAYER_COUNT = 2;

export const MIN_DICE_VALUE = 1;
export const MAX_DICE_VALUE = 6;

export const START_POSITION = 0;
export const FINAL_POSITION = 37;

export const PLAYER_IDS = {
  ONE: "player1",
  TWO: "player2",
};

/*
  Each player has a fixed role for the game.

  PLAYER 1 = Male
  PLAYER 2 = Female
*/
export const PLAYER_GENDERS = {
  MALE: "male",
  FEMALE: "female",
};

export const PLAYER_ROLES = {
  [PLAYER_IDS.ONE]: PLAYER_GENDERS.MALE,
  [PLAYER_IDS.TWO]: PLAYER_GENDERS.FEMALE,
};

export const GAME_PHASES = {
  START: "start",
  PLAYING: "playing",
  CHALLENGE: "challenge",
  FINAL: "final",
  GAME_OVER: "gameOver",
};

export const TURN_PHASES = {
  READY: "ready",
  ROLLING: "rolling",
  MOVING: "moving",
  LANDED: "landed",
};

export const CHALLENGE_TYPES = {
  FOREPLAY: "foreplay",
  ORAL: "oral",
  FINAL: "final",
};

export const MOVEMENT_STEP_DELAY = 280;

export const DICE_ROLL_DURATION = 900;

export const CHALLENGE_REVEAL_DELAY = 350;

export const FINAL_CHALLENGE_COUNT = 1;