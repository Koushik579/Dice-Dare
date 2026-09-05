import { useMemo } from "react";

import StartScreen from "./components/StartScreen/StartScreen";
import GameBoard from "./components/Game/GameBoard";
import Dice from "./components/Dice/Dice";
import TurnIndicator from "./components/UI/TurnIndicator";
import ProgressBar from "./components/UI/ProgressBar";
import ChallengeModal from "./components/Challenge/ChallengeModal";
import FinalChallenge from "./components/Final/FinalChallenge";
import GameOver from "./components/GameOver/GameOver";

import { useGame } from "./hooks/useGame";

import {
  GAME_PHASES,
  TURN_PHASES,
} from "./constants/game";

import { foreplayMaleChallenges } from "./data/foreplaymale";
import { foreplayFemaleChallenges } from "./data/foreplayfemale";
import { oralMaleChallenges } from "./data/oralmale";
import { oralFemaleChallenges } from "./data/oralfemale";
import { finalChallenges } from "./data/final";

import "./App.css";

const App = () => {
  const game = useGame({
    foreplayMaleChallenges,
    foreplayFemaleChallenges,

    oralMaleChallenges,
    oralFemaleChallenges,

    finalChallenges,
  });

  const isStart =
    game.gamePhase === GAME_PHASES.START;

  const isPlaying =
    game.gamePhase === GAME_PHASES.PLAYING;

  const isChallenge =
    game.gamePhase === GAME_PHASES.CHALLENGE;

  const isFinal =
    game.gamePhase === GAME_PHASES.FINAL;

  const isGameOver =
    game.gamePhase === GAME_PHASES.GAME_OVER;

  const activeChallengeType =
    game.activeChallenge?.type ||
    (
      game.landingSpace >= 19
        ? "oral"
        : "foreplay"
    );

  const currentPosition =
    Number.isFinite(
      Number(game.currentPlayerData?.position)
    )
      ? Number(
          game.currentPlayerData.position
        )
      : 0;

  const progressValue =
    Math.min(
      Math.max(currentPosition, 0),
      37
    );

  const progress = useMemo(
    () => ({
      current: progressValue,
      total: 37,
    }),
    [progressValue]
  );

  /*
    -----------------------------------------------
    START GAME
    -----------------------------------------------
  */

  const handleStart = ({
    maleName,
    femaleName,
  }) => {
    game.startGame({
      maleName,
      femaleName,
    });
  };

  /*
    -----------------------------------------------
    NORMAL CHALLENGE COMPLETE
    -----------------------------------------------
  */

  const handleChallengeComplete = () => {
    game.continueAfterChallenge();
  };

  /*
    -----------------------------------------------
    FINAL CHALLENGE COMPLETE
    -----------------------------------------------
  */

  const handleFinalComplete = () => {
    game.completeFinalChallenge();
  };

  /*
    -----------------------------------------------
    START SCREEN
    -----------------------------------------------
  */

  if (isStart) {
    return (
      <main className="app">
        <StartScreen
          onStart={handleStart}
        />
      </main>
    );
  }

  /*
    -----------------------------------------------
    GAME SCREEN
    -----------------------------------------------
  */

  return (
    <main className="app">
      <div className="game-screen">

        {/* HEADER */}

        <header className="game-screen__header">
          <div>
            <div className="game-screen__eyebrow">
              DICE & DARE
            </div>

            <h1 className="game-screen__title">
              The Game
            </h1>
          </div>

          <div className="game-screen__turn">
            <TurnIndicator
              currentPlayer={game.currentPlayer}
              player1={game.players.player1}
              player2={game.players.player2}
              isRolling={game.isRolling}
              isMoving={game.isMoving}
            />
          </div>
        </header>

        {/* PLAYER INFORMATION */}

        <section
          className="game-screen__players"
          aria-label="Players"
        >
          <div
            className={[
              "game-player",
              "game-player--male",
              game.currentPlayer ===
                game.players.player1.id
                ? "game-player--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="game-player__avatar">
              {game.players.player1.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="game-player__info">
              <strong>
                {game.players.player1.name}
                {" "}
                <span>
                  Space {game.players.player1.position}
                </span>
              </strong>
            </div>
          </div>

          <div
            className={[
              "game-player",
              "game-player--female",
              game.currentPlayer ===
                game.players.player2.id
                ? "game-player--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="game-player__avatar">
              {game.players.player2.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="game-player__info">
              <strong>
                {game.players.player2.name}
                {" "}
                <span>
                  Space {game.players.player2.position}
                </span>
              </strong>
            </div>
          </div>
        </section>

        {/* PROGRESS */}

        <section className="game-screen__progress">
          <ProgressBar
            value={progress.current}
            max={progress.total}
          />
        </section>

        {/* BOARD */}

        <section className="game-screen__board-section">
          <GameBoard
            players={game.players}
            currentPlayer={
              game.currentPlayer
            }
            landingSpace={
              game.landingSpace
            }
            visualPositions={
              game.visualPositions
            }
            isMoving={
              game.isMoving
            }
            movingPlayerId={
              game.movingPlayerId
            }
          />
        </section>

        {/* CONTROLS */}

        <section className="game-screen__controls">
          <Dice
            value={game.diceValue}
            isRolling={game.isRolling}
            onRoll={game.handleRoll}
            disabled={
              !isPlaying ||
              game.turnPhase !==
                TURN_PHASES.READY ||
              game.isMoving
            }
          />

          <p className="game-screen__hint">
            {game.isRolling
              ? "Rolling..."
              : game.isMoving
                ? "Moving..."
                : isPlaying
                  ? `${game.currentPlayerData?.name}'s turn`
                  : ""}
          </p>
        </section>
      </div>

      {/* NORMAL CHALLENGE POPUP */}

      <ChallengeModal
        challenge={
          game.activeChallenge
        }
        type={
          activeChallengeType ||
          "foreplay"
        }
        playerName={
          game.currentPlayerData?.name
        }
        isOpen={isChallenge}
        onComplete={
          handleChallengeComplete
        }
      />

      {/* FINAL CHALLENGE */}

      <FinalChallenge
        challenge={
          game.finalChallenge
        }
        playerName={
          game.winner?.name ||
          game.currentPlayerData?.name
        }
        isOpen={isFinal}
        onComplete={
          handleFinalComplete
        }
      />

      {/* GAME OVER */}

      {isGameOver && (
        <GameOver
          winner={game.winner}
          onRestart={
            game.restartGame
          }
        />
      )}
    </main>
  );
};

export default App;
