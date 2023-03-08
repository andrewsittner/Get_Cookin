const express = require('express');
const app = express();
const axios = require('axios');
const jwt = require('jsonwebtoken')
const path = require('path');
const cors = require('cors');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const port = 3000;
//this is just for testing autocomplete
const wordData = require('./testWords.js');
const autoComplete_URL = process.env.AUTOCOMPLETE_API_URL;


const { authenticateUser } = require('./middleware.js');

app.use(express.static(path.join(__dirname, '../dist')));
app.use(cors());

const recipeSearch = require('./controllers/recipeSearch.js');
const addUser = require('./controllers/addUser.js');
const saveRecipe = require('./controllers/saveRecipe.js');
const getAutocomplete = require('./controllers/getAutocomplete.js');

app.use(express.json());
app.use(cors());
app.use(authenticateUser);

// AUTHENTICATION  ===
app.post('/login-user', (req, res) => {
  let tempUser = searchTempUserStorage(req.body);
  if(!tempUser) return res.sendStatus(401)
  const signed = jwt.sign({ id: tempUser.id }, process.env.JWT_SECRET);
  console.log(tempUser.id, signed);
  res.send({ token: signed });
})

app.post('/signup-user', (req, res) => {
  console.log(req.body);
  if (req.body.email && req.body.first && req.body.last && req.body.password) {
    req.body.id = tempUserStorage.length + 1;
    tempUserStorage.push(req.body);
  } else {
    return res.sendStatus(401);
  }

  const signed = jwt.sign({ id: req.body.id }, process.env.JWT_SECRET);
  console.log(req.body.id, signed);
  res.send({ token: signed });
})
app.get('/testroute', (req, res) => {
  console.log(req.user_id && req.user_id);
  res.send('yo');
})

// /AUTHENTICATION ^^^

app.get('/autoComplete', (req, res) => {
  console.log('Inside get of autoComplete');
  let userInput = req.query.q;
  axios.get(`${autoComplete_URL}&q=${userInput}&limit=6`)
  .then(({data}) => {
    console.log(data)
    res.status(200).send(data);
  })
  .catch((err) => console.log(err));
})

// app.get('/&q=*', (req, res) => {
//   console.log(process.env.API_URL, process.env)
//   // axios.get(process.env.API_URL + req.url.slice(1))
//   // .then(res => console.log(res));
// })

//recipe search
app.get('/search', recipeSearch);
//recipe saving
app.post('/savedPage', saveRecipe.postSaved);
app.get('/savedPage', saveRecipe.getSaved);
//user signup
app.post('/signup', addUser);

//this is just for testing autocomplete
app.get('/ingredientdata', getAutocomplete);

// catch-all route handler for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist' , 'index.html'));
});

app.listen(port, () => {
  console.log(`We are cookin' on port ${port}`)
})

//test data = = = = = = = = = = = = = = = = = = = = =

const tempUserStorage = [
  {
    id: 1,
    first: 'hey',
    last: 'yo',
    email: 'bryce',
    password: 'andhisson',
    data: 'i am very very cool'
  },
  {
    id: 2,
    first: 'hiy',
    last: 'yoo',
    email: 'jimothy',
    password: 'bopeep',
    data: 'i am not very cool'
  },
  {
    id: 3,
    first: 'huy',
    last: 'yo00',
    email: 'user',
    password: 'pass',
    data: 'i am somewahat very cool'
  },
  {
    id: 4,
    first: 'hoy',
    last: 'yo0o0',
    email: 'user2',
    password: 'pass2',
    data: 'unethical chicken'
  },
  {
    id: 5,
    first: 'hay',
    last: 'yoooooo',
    email: 'user3',
    password: 'pass3',
    data: 'nekked chicken'
  }
];

const searchTempUserStorage = ({ email, password }) => {
  for (let i = 0; i < tempUserStorage.length; i++) {
    if (tempUserStorage[i].email === email && tempUserStorage[i].password === password) {
      return tempUserStorage[i];
    }
  }
  return false;
}