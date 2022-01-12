const router = require('express').Router();

const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  res.render('home', { test: "asdf1234" });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;