const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const controller = require('./controller');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.get('/', (_, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/users', async (_, response) => {
  try {
    const records = await controller.getAllUsers();
    response.status(200).json(records);
  } catch (error) {
    response.status(400).json(error);
  }
});

app.post('/api/users', async (request, response) => {
  try {
    const newUser = await controller.insertUser(request.body.username);
    response.status(201).json(newUser);
  } catch (error) {
    response.status(error.code ?? 400).json({ error : error.message ?? error});
  }
});

app.post('/api/users/:_id/exercises', async (request, response) => {
  try {
    const newExercise = await controller.insertExercise(request.params._id, request.body);
    response.status(201).json(newExercise);
  } catch (error) {
    response.status(error.code ?? 400).json({ error : error.message ?? error});
  }
});

app.get('/api/users/:_id/logs', async (request, response) => {
  try {
    const logs = await controller.getUserLogs(request.params._id, request.query);
    response.status(200).json(logs);
  } catch (error) {
    response.status(error.code ?? 400).json({ error : error.message ?? error});
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
