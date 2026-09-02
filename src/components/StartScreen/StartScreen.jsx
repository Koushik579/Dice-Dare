import { useState } from "react";
import "./StartScreen.css";

const StartScreen = ({ onStart }) => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const name1 = player1Name.trim() || "Player 1";
    const name2 = player2Name.trim() || "Player 2";

    onStart({
      player1Name: name1,
      player2Name: name2,
    });
  };

  return (
    <section className="start-screen">
      <div className="start-screen__content">
        <div className="start-screen__badge">
          TWO PLAYER GAME
        </div>

        <h1 className="start-screen__title">
          Dice & Dare
        </h1>

        <p className="start-screen__subtitle">
          Roll the dice. Move forward. Complete the challenge.
          Reach the final first.
        </p>

        <form
          className="start-screen__form"
          onSubmit={handleSubmit}
        >
          <div className="start-screen__players">
            <div className="player-input">
              <label htmlFor="player1">
                Player 1
              </label>

              <input
                id="player1"
                type="text"
                value={player1Name}
                onChange={(event) =>
                  setPlayer1Name(event.target.value)
                }
                placeholder="Enter name"
                maxLength={20}
                autoComplete="off"
              />
            </div>

            <div className="player-input">
              <label htmlFor="player2">
                Player 2
              </label>

              <input
                id="player2"
                type="text"
                value={player2Name}
                onChange={(event) =>
                  setPlayer2Name(event.target.value)
                }
                placeholder="Enter name"
                maxLength={20}
                autoComplete="off"
              />
            </div>
          </div>

          <button
            className="start-screen__button"
            type="submit"
          >
            Start Game
          </button>
        </form>

        <div className="start-screen__rules">
          <div className="rule">
            <span>37</span>
            <p>Spaces</p>
          </div>

          <div className="rule">
            <span>2</span>
            <p>Players</p>
          </div>

          <div className="rule">
            <span>🎲</span>
            <p>Roll to move</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartScreen;