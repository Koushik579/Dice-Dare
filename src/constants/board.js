export const BOARD_SIZE = 37;

export const FOREPLAY_START = 1;
export const FOREPLAY_END = 18;

export const ORAL_START = 19;
export const ORAL_END = 36;

export const FINAL_SPACE = 37;

export const BOARD_SPACES = Array.from(
  { length: BOARD_SIZE },
  (_, index) => {
    const space = index + 1;

    let type = "foreplay";

    if (space >= ORAL_START && space <= ORAL_END) {
      type = "oral";
    }

    if (space === FINAL_SPACE) {
      type = "final";
    }

    return {
      id: space,
      number: space,
      type,
    };
  }
);

export const getSpaceType = (space) => {
  if (space >= FOREPLAY_START && space <= FOREPLAY_END) {
    return "foreplay";
  }

  if (space >= ORAL_START && space <= ORAL_END) {
    return "oral";
  }

  if (space === FINAL_SPACE) {
    return "final";
  }

  return null;
};