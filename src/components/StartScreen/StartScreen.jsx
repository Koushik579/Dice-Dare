import { useState } from "react";

import "./StartScreen.css";

const StartScreen = ({ onStart }) => {
  const [maleName, setMaleName] =
    useState("");

  const [femaleName, setFemaleName] =
    useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const finalMaleName =
      maleName.trim() || "Male Partner";

    const finalFemaleName =
      femaleName.trim() ||
      "Female Partner";

    onStart({
      maleName: finalMaleName,
      femaleName: finalFemaleName,
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
          Roll the dice. Move forward. Complete
          the challenge. Reach the final first.
        </p>

        <form
          className="start-screen__form"
          onSubmit={handleSubmit}
        >
          <div className="start-screen__players">
            {/* =================================
                MALE PARTNER
            ================================== */}

            <div className="player-input player-input--male">
              <label htmlFor="male-partner">
                Male Partner
              </label>

              <input
                id="male-partner"
                type="text"
                value={maleName}
                onChange={(event) =>
                  setMaleName(
                    event.target.value
                  )
                }
                placeholder="Enter his name"
                maxLength={20}
                autoComplete="off"
              />
            </div>

            {/* =================================
                FEMALE PARTNER
            ================================== */}

            <div className="player-input player-input--female">
              <label htmlFor="female-partner">
                Female Partner
              </label>

              <input
                id="female-partner"
                type="text"
                value={femaleName}
                onChange={(event) =>
                  setFemaleName(
                    event.target.value
                  )
                }
                placeholder="Enter her name"
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