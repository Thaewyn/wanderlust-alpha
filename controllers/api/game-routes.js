const router = require('express').Router();
const { GameController } = require('../gameController');

router.get('/fight', async (req, res) => {
  //get current fight status.
  //pull from session if exists, if doesn't exist, create.
  res.send("fight status not yet implemented");
});

router.post('/fight/new', (req,res) => {
  //force a new fight, ignoring session data
  res.send("new fight not yet implemented");
});

router.get('/character', (req,res) => {
  //retrieve character data for the front-end
  res.json(req.session.game.player);
});

router.get('/inventory', (req,res) => {
  //retrieve character inventory
  // NOT YET IMPLEMENTED.
  res.status(404);
});

router.get('/dice', (req,res) => {
  //get current dice state
  res.json(req.session.game.player.dice);
});

router.post('/roll', (req,res) => {
  //roll dice. 
  //Expects a full body of dice data, with their locked/unlocked status toggled appropriately
  // only unlocked dice are rolled, and all are returned, alongside valid skills
  res.send("roll dice not yet implemented");
})

router.post('/skill', (req,res) => {
  //player has selected a skill to use this turn. Do game logic.
  res.send("select skill not yet implemented");
});

module.exports = router