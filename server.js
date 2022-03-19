const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const dbAdapter = require('./database-adapter');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.get('/', (_, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/users', async (_, response) => {
  try {
    const records = await dbAdapter.getAllUsers();
    response.status(200).json(records);
  } catch (error) {
    response.status(400).json(error);
  }
});

app.post('/api/users', async (request, response) => {
  const username = request.body.username;

  if (username) {
    try {
      const newUser = await dbAdapter.insertUser(username);
      if (newUser) {
        response.status(201).json(newUser);
      } else {
        response.status(400).json(
          { error: `User with the username ${username} already exists!` }
        );
      }
    } catch (error) {
      response.status(400).json(error);
    }
  } else {
    response
      .status(400)
      .json({ error: 'Username not provided' });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
