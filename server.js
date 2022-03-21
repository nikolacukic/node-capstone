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


app.post('/api/users/:_id/exercises', async (request, response) => {
  const userId = request.params._id;
  const { description, duration, date } = request.body;

  if (!description || !duration) {
    response.status(400).json({error: 'Please provide exercise description and duration'});
    return;
  }

  const creationDate = date ? Date.parse(date) : Date.now();

  if(isNaN(creationDate)) {
    response.status(400).json({error: 'Please provide the date in YYYY-MM-DD (ISO) format'});
    return;
  } else {
    try {
      const dateString = new Date(creationDate).toISOString().split('T')[0];
      const newExercise = await dbAdapter.insertExercise(userId, description, duration, dateString);

      response.status(201).json(newExercise);
    } catch (error) {
      response.status(400).json(error);
    }
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
