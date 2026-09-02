import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import BoardSpace from "./BoardSpace";
import PlayerPiece from "./PlayerPiece";

import {
  BOARD_SPACES,
  FINAL_SPACE,
} from "../../constants/board";

import "./GameBoard.css";

const NORMAL_BOARD_SPACES = BOARD_SPACES.filter(
  (space) => space.number < FINAL_SPACE
);

const GameBoard = ({
  players,
  currentPlayer,
  landingSpace,
  visualPositions = {},
  isMoving = false,
  movingPlayerId = null,
}) => {
  const trackRef = useRef(null);
  const spaceRefs = useRef({});
  const [piecePositions, setPiecePositions] =
    useState({});

  /*
    Keep references for every logical position,
    including START (0) and FINAL (37).
  */
  const setSpaceRef = useCallback(
    (spaceNumber, element) => {
      if (element) {
        spaceRefs.current[spaceNumber] =
          element;
      } else {
        delete spaceRefs.current[spaceNumber];
      }
    },
    []
  );

  /*
    Calculate the center point of every player's
    current visual board position.
  */
  const calculatePiecePositions =
    useCallback(() => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const trackRect =
        track.getBoundingClientRect();

      const nextPositions = {};

      Object.values(players).forEach(
        (player) => {
          const position =
            visualPositions[player.id] ??
            player.position;

          const spaceElement =
            spaceRefs.current[position];

          if (!spaceElement) {
            return;
          }

          const spaceRect =
            spaceElement.getBoundingClientRect();

          nextPositions[player.id] = {
            left:
              spaceRect.left -
              trackRect.left +
              spaceRect.width / 2,

            top:
              spaceRect.top -
              trackRect.top +
              spaceRect.height / 2,
          };
        }
      );

      setPiecePositions(nextPositions);
    },
    [players, visualPositions]
  );

  /*
    Recalculate after player movement or layout changes.
  */
  useEffect(() => {
    calculatePiecePositions();
  }, [calculatePiecePositions]);

  /*
    Recalculate when the browser viewport changes.
  */
  useEffect(() => {
    const handleResize = () => {
      calculatePiecePositions();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [calculatePiecePositions]);

  /*
    ResizeObserver keeps piece coordinates synchronized
    if the board itself changes size.
  */
  useEffect(() => {
    const track = trackRef.current;

    if (!track || !window.ResizeObserver) {
      return undefined;
    }

    const observer =
      new ResizeObserver(() => {
        calculatePiecePositions();
      });

    observer.observe(track);

    return () => {
      observer.disconnect();
    };
  }, [calculatePiecePositions]);

  /*
    Logical players currently occupying a space.
  */
  const getPlayersOnSpace = useCallback(
    (spaceNumber) => {
      return Object.values(players).filter(
        (player) =>
          player.position === spaceNumber
      );
    },
    [players]
  );

  /*
    Players currently occupying a space visually
    while a piece is moving.
  */
  const getVisualPlayersOnSpace =
    useCallback(
      (spaceNumber) => {
        return Object.values(players).filter(
          (player) => {
            const position =
              visualPositions[player.id] ??
              player.position;

            return position === spaceNumber;
          }
        );
      },
      [players, visualPositions]
    );

  /*
    Show the furthest logical position reached.
  */
  const maxPosition = Math.max(
  ...Object.values(players).map(
    (player) =>
      Number.isFinite(
        Number(player.position)
      )
        ? Number(player.position)
        : 0
  ),
  0
);

  /*
    Find the special START and FINAL positions.
  */
  const startPlayers =
    getPlayersOnSpace(0);

  const finalPlayers =
    getPlayersOnSpace(FINAL_SPACE);

  return (
    <section
      className="game-board"
      aria-label="Dice and Dare game board"
    >
      <div className="game-board__header">
        <div className="game-board__legend">
          <span className="legend-item legend-item--foreplay">
            <span className="legend-dot" />
            Foreplay
          </span>

          <span className="legend-item legend-item--oral">
            <span className="legend-dot" />
            Oral
          </span>

          <span className="legend-item legend-item--final">
            <span className="legend-dot" />
            Final
          </span>
        </div>

        <div
          className="game-board__progress"
          aria-label={`Furthest player position ${maxPosition} of 37`}
        >
          <span>{maxPosition}</span>
          <span className="progress-divider">
            /
          </span>
          <span>37</span>
        </div>
      </div>

      <div
        className="game-board__track"
        ref={trackRef}
      >
        {/* -----------------------------------------
            START POSITION
        ------------------------------------------ */}

        <div
          ref={(element) =>
            setSpaceRef(0, element)
          }
          className="game-board__start"
          aria-label="Starting position"
        >
          <div className="game-board__start-label">
            START
          </div>

          <div className="game-board__start-arrow">
            ↓
          </div>

          {startPlayers.length > 0 && (
            <div
              className="game-board__start-players"
              aria-hidden="true"
            >
              {startPlayers.map((player) => (
                <span
                  key={player.id}
                  className={[
                    "game-board__start-player",
                    `game-board__start-player--${player.id}`,
                  ].join(" ")}
                >
                  {player.name
                    .charAt(0)
                    .toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* -----------------------------------------
            36-SPACE ZIG-ZAG BOARD
        ------------------------------------------ */}

        <div className="game-board__spaces">
          {NORMAL_BOARD_SPACES.map(
            (space) => {
              const playersOnSpace =
                getPlayersOnSpace(
                  space.number
                );

              const visualPlayers =
                getVisualPlayersOnSpace(
                  space.number
                );

              const displayPlayers =
                isMoving
                  ? visualPlayers
                  : playersOnSpace;

              return (
                <div
                  key={space.id}
                  ref={(element) =>
                    setSpaceRef(
                      space.number,
                      element
                    )
                  }
                  className="game-board__space-wrapper"
                >
                  <BoardSpace
                    space={space.number}
                    type={space.type}
                    players={displayPlayers}
                    isCurrent={
                      playersOnSpace.some(
                        (player) =>
                          player.id ===
                          currentPlayer
                      )
                    }
                    isLanding={
                      landingSpace ===
                      space.number
                    }
                    isFinal={false}
                  />
                </div>
              );
            }
          )}
        </div>

        {/* -----------------------------------------
            FINAL POSITION
        ------------------------------------------ */}

        <div
          ref={(element) =>
            setSpaceRef(
              FINAL_SPACE,
              element
            )
          }
          className="game-board__final"
        >
          <BoardSpace
            space={FINAL_SPACE}
            type="final"
            players={finalPlayers}
            isCurrent={
              finalPlayers.some(
                (player) =>
                  player.id ===
                  currentPlayer
              )
            }
            isLanding={
              landingSpace ===
              FINAL_SPACE
            }
            isFinal
          />
        </div>

        {/* -----------------------------------------
            ANIMATED PLAYER PIECES
        ------------------------------------------ */}

        <div
          className="game-board__pieces"
          aria-hidden="true"
        >
          {Object.values(players).map(
            (player) => {
              const position =
                piecePositions[player.id];

              if (!position) {
                return null;
              }

              const visualPosition =
                visualPositions[player.id] ??
                player.position;

              const isThisPlayerMoving =
                isMoving &&
                movingPlayerId ===
                  player.id;

              const isThisPlayerLanding =
                landingSpace ===
                  visualPosition &&
                movingPlayerId ===
                  player.id;

              return (
                <div
                  className="game-board__piece-wrapper"
                  key={player.id}
                  style={{
                    left: `${position.left}px`,
                    top: `${position.top}px`,
                  }}
                >
                  <PlayerPiece
                    player={{
                      ...player,
                      position:
                        visualPosition,
                    }}
                    isCurrentPlayer={
                      player.id ===
                      currentPlayer
                    }
                    isMoving={
                      isThisPlayerMoving
                    }
                    isLanding={
                      isThisPlayerLanding
                    }
                  />
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};

export default GameBoard;