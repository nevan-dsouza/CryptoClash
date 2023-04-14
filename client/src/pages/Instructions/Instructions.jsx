import { useState } from "react";
import "./Instructions.css";
import useWindowSize from "../../utils/useWindowSize";

import maleChat from "../../assets/male-chat-3d.png";
import femaleChat from "../../assets/female-chat-3d.png";
import bubbleChat from "../../assets/chat-bubble-3d.png";

const Instructions = () => {
  const { width, height } = useWindowSize();

  return (
    <div className="About-main">
      {width >= 835 ? (
        <div className="logo-image-section">
          <img src={maleChat} className="about-male-chat-illustration" />
        </div>
      ) : null}
      <div className={`loginForm`}>
        <p
          className={`text-dark`}
          style={{
            fontSize: "4rem",
            fontWeight: "bolder",
            fontFamily: "sans-serif",
            textShadow:
              "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          Instructions!
        </p>
        <div
          className={"Login-form-field-text-message text-dark"}
          style={{
            fontSize: "1.5rem",
            fontWeight: "bolder",
            fontFamily: "sans-serif",
            textAlign: "justify",
            textJustify: "inter-word",
          }}
        >
          There are 2 teams in the game, Codemasters and Decoders. These teams are set, with Codemasters coming up with a secret 5-letter word within 30 seconds. Decoders then have 1 minute and 5 guesses to crack the secret word, with hints displayed in different colors. Points are awarded based on successful guesses, with 6 rounds in total and teams switching after 3 rounds. Good luck!
        </div>

        <div
          className={`d-flex justify-content-around align-items-center  text-dark`}
        >
          <footer>&copy; Copyright 2023 CryptoClash</footer>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bolder",
              fontFamily: "sans-serif",
              textAlign: "end",
              textShadow:
                "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          >
            Have Fun!
          </p>
        </div>
      </div>
      {width >= 1200 ? (
        <div className="logo-image-section">
          <img src={bubbleChat} className="about-chat-bubble" alt="bubble chat"/>
        </div>
      ) : null}
    </div>
  );
};

export default Instructions;
