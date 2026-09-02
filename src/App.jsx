import StartScreen from "./components/StartScreen/StartScreen";
import GameBoard from "./components/Game/GameBoard";
import Dice from "./components/Dice/Dice";
import TurnIndicator from "./components/UI/TurnIndicator";
import ProgressBar from "./components/UI/ProgressBar";
import ChallengeModal from "./components/Challenge/ChallengeModal";
import FinalChallenge from "./components/Final/FinalChallenge";
import GameOver from "./components/GameOver/GameOver";

import { useGame } from "./hooks/useGame";

import { GAME_PHASES } from "./constants/game";
import { getChallengeType } from "./utils/gameRules";

import { foreplayChallenges } from "./data/foreplay";
import { oralChallenges } from "./data/oral";
import { finalChallenges } from "./data/final";

import "./App.css";

const App = () => {
  const game = useGame({
    foreplayChallenges,
    oralChallenges,
    finalChallenges,
  });

  const handleStart = ({
    player1Name,
    player2Name,
  }) => {
    game.startGame({
      player1Name,
      player2Name,
    });
  };

  const handleRestart = () => {
    game.restartGame();
  };

  const activeChallengeType =
    game.activeChallenge && game.landingSpace
      ? getChallengeType(
          game.landingSpace
        )
      : null;

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

  /*
    Start screen
  */

  if (isStart) {
    return (
      <div className="app">
        <StartScreen
          onStart={handleStart}
        />
      </div>
    );
  }

  /*
    Game over screen
  */

  if (isGameOver) {
    return (
      <div className="app">
        <GameOver
          winner={game.winner}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  /*
    Main game
  */

  return (
    <div className="app">
      <main className="game-screen">
        <header className="game-screen__header">
          <div className="game-screen__brand">
            <span
              className="game-screen__brand-mark"
              aria-hidden="true"
            >
              ✦
            </span>

            <div>
              <span className="game-screen__brand-title">
                Dice & Dare
              </span>

              <span className="game-screen__brand-subtitle">
                Two Player Game
              </span>
            </div>
          </div>

          <div
            className="game-screen__space-count"
            aria-label={`Current player is on space ${
              game.currentPlayerData?.position ?? 0
            } of 37`}
          >
            <span>SPACE</span>

            <strong>
              {game.currentPlayerData
                ?.position ?? 0}
            </strong>

            <span>/ 37</span>
          </div>
        </header>

        <section
          className="game-screen__players"
          aria-label="Player information"
        >
          <TurnIndicator
            currentPlayer={
              game.currentPlayer
            }
            player1={
              game.players.player1
            }
            player2={
              game.players.player2
            }
            isRolling={
              game.isRolling
            }
            isMoving={
              game.isMoving
            }
          />

          <div className="game-screen__progress">
            <ProgressBar
              value={
                game.currentPlayerData
                  ?.position ?? 0
              }
              max={37}
              label={`${game.currentPlayerData?.name ?? "Player"} progress`}
            />
          </div>
        </section>

        <section
          className="game-screen__board-section"
          aria-label="Game board"
        >
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

        <section
          className="game-screen__controls"
          aria-label="Game controls"
        >
          <div className="game-screen__dice-area">
            <Dice
              value={game.diceValue}
              isRolling={
                game.isRolling
              }
              disabled={
                !isPlaying ||
                game.isMoving
              }
              onRoll={
                game.handleRoll
              }
            />
          </div>

          <div
            className="game-screen__turn-message"
            aria-live="polite"
          >
            {game.isRolling && (
              <span>
                Rolling the dice...
              </span>
            )}

            {!game.isRolling &&
              game.isMoving && (
                <span>
                  {
                    game.currentPlayerData
                      ?.name
                  }{" "}
                  is moving...
                </span>
              )}

            {!game.isRolling &&
              !game.isMoving &&
              isPlaying && (
                <span>
                  {
                    game.currentPlayerData
                      ?.name
                  }{" "}
                  — roll the dice
                </span>
              )}
          </div>
        </section>
      </main>

      <ChallengeModal
        challenge={
          game.activeChallenge
        }
        type={
          activeChallengeType ||
          "foreplay"
        }
        playerName={
          game.currentPlayerData
            ?.name
        }
        isOpen={isChallenge}
        onComplete={
          game.continueAfterChallenge
        }
      />

      <FinalChallenge
        challenge={
          game.finalChallenge
        }
        playerName={
          game.winner?.name ||
          game.currentPlayerData
            ?.name
        }
        isOpen={isFinal}
        onComplete={
          game.completeFinalChallenge
        }
      />
    </div>
  );
};

export default App;