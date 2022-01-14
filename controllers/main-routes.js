const router = require('express').Router();

const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  if(req.session.loggedIn) {
    res.render('home', { loggedIn: req.session.loggedIn });
  } else {
    res.render('home', { msg: "Please log in to play!" });
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;