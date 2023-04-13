# CryptoClash

## 1.1 Description
CryptoClash is a real-time, multiplayer online game where players collaborate in teams to crack secret codes within a limited number of turns. The game combines teamwork, communication, and problem-solving in a fun and interactive setting

## 1.2 Problem
Many existing online games focus on individual accomplishments or competitive gameplay,
leaving a gap for games that emphasize cooperation and collective problem-solving.
CryptoClash addresses this need by providing an engaging and accessible game that fosters
teamwork, communication, and strategic thinking.

## 1.3 User Profile
The end users are casual gamers and puzzle enthusiasts who enjoy collaborating with others to solve problems. They may range from teenagers to adults and use the application during their free time or breaks for a quick gaming session. The application should be easy to use, visually appealing, and considerate of different skill levels and age groups.

## 1.4 Requirements: Use Cases and Features
### Lobby system:
Players can choose to play multiplayer mode
### Game:
- Players can submit their secret codeword
- Players can guess codes created by the opposing team to score points.
- Players can communicate with team members using a chat panel.
### Team assignment:
- Divide players into Codemasters and Decoders teams
### Code creation:
Codemasters team can create a secret code consisting of a word that represents a specific object, concept, or phrase that will be validated based on length and meaning. They will have an option to view potential words that they could use if they can’t come up with anything.
### Code guessing:
Decoders team has a limited time to guess the correct word that represents the given
set of letters.
### Turn tracking:
Limit the number of turns for Decoders to crack the code
### Time limit:
The Codemasters team has a limited time to pick a word and the Decoders team has a limited time to guess the correct word
### Chat functionality:
Enable team communication during gameplay
### Scoring System:
Teams earn points based on the number of correct guesses within the time limit

## 1.5 Tech Stack and APIs
- Frontend: React for building the user interface ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- Backend: Node.js and Express for handling server-side logic ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- Database: MongoDB for storing user information & game data ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- Real-time communication: Socket.io for real-time multiplayer communication ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
- API for the words: Datamuse API
- Styling: CSS frameworks like Bootstrap or Material-UI for a modern and responsive design
- Deployment: Heroku ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

## 1.6 External APIs that will be consumed
**Datamuse API** is used in this project to generate word options for the game's secret word. Specifically, we will use the API’s `/words` endpoint to generate a list of words that match the specified criteria (e.g., word length, starting/ending letters, validate if it exists etc. , and then give those words as options to the Codemasters team to assist them in coming up with a word.

## 1.7 How to Run the App
### Step 1:


## 1.8 Key Learnings
### Working with a full-stack application: 
This project involved working with both front-end and back-end technologies, including React, Node.js, Express, and MongoDB. You may have learned how to integrate these different components to build a complete web application.

### Real-time communication with Socket.io: 
Real-time communication is a key feature of any multiplayer game. I learned how to use Socket.io to set up real-time communication between the server and the clients, allowing players to see each other's moves in real-time.

### Data persistence with MongoDB: 
This project involved storing player and game data in a database using MongoDB. I learned how to use Mongoose to define data models, create database queries, and handle data validation.

### Working with APIs: 
The project involves integrating with an external API to generate random words. I learned how to use Axios to make HTTP requests to the API and handle the response.

### Problem-solving: 
Building a game involves solving various problems, including designing the game logic, handling user input, and validating user moves. I have learned how to approach these problems and find creative solutions.

## 1.9 Next Steps
- Adding animations, sound effects and aesthetics to enhance the user experience
- Adding user authentication using Passport.js
- Implementing a leaderboard to track high scores and rankings
- Adding the ability for players to customize their profile and display name.
- Adding matchmaking option based on ranks.