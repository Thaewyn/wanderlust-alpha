//combat prototype scripts
var debug = function (string) {
  console.log(""+string);
}

var combatController = {
  // global variables
  energy_strength: 100,

  player: {
    hp: 100,
    speed: 5
  }

  /* so the core concept here is letting players do their own risk/reward balancing
  the player has a meter that slowly fills, but attacking reduces the meter.
  players can attack as fast as they like (there is a minimum cooldown of course)
  but the faster they attack, the weaker their defense gets. So if players are
  in full mash mode, they might get one-shot by the boss. But if they are more 
  measured in their attacks, their defense stays up.
  On the other side, the meter can continue to build above 'full defense' if the
  player does not swing OR get hit while dodging. Attack power will continue to build
  effectively until the point where players can one-shot the boss itself. But making
  an attack or taking a hit means the energy resets back to 'full defense'.
  The balancing is going to need some serious work, but at the moment I feel like energy
  above the 100% mark should probably increase geometrically. A linear increase would
  be too slow (and probably not outweigh the benefits of just slashing more often),
  and an exponential increase might be too fast depending on the difficulty of the boss.
  */
}