const checkSecretWord = (secretWord, guess) => {
    const secretLetters = secretWord.split("");
    const guessLetters = guess.split("");
    let correctCount = 0;
    let correctLetterPositions = [];
    let almostCorrectCount = 0;
  
    for (let i = 0; i < guessLetters.length; i++) {
      const guessLetter = guessLetters[i];
      const letterIndex = secretLetters.indexOf(guessLetter);
  
      if (letterIndex !== -1) {
        if (letterIndex === i) {
          correctCount++;
          correctLetterPositions.push(i);
        } else {
          almostCorrectCount++;
        }
      }
    }
  
    return {
      correct: correctCount,
      correctLetterPositions,
      almostCorrect: almostCorrectCount,
      incorrect: 5 - correctCount - almostCorrectCount,
    };
  };
  
  const generateRoomId = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let roomId = '';
    for (let i = 0; i < 4; i++) {
      roomId += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return roomId;
  };
  
  module.exports = { checkSecretWord , generateRoomId };
  