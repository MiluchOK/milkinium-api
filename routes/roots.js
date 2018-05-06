const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Home!' });
});

routes.get('/about', (req, res) => {
  res.status(200).json({ message: 'About!' });
});


module.exports = routes;