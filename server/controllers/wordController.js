const axios = require('axios');

const generateRandomWords = async (req, res) => {
  try {
    const { count } = req.query;
    const response = await axios.get(`https://api.datamuse.com/words?sp=?????&max=5`);
    const words = response.data.map((wordObj) => wordObj.word);
    res.json(words);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { generateRandomWords };
