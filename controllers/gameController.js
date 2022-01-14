const monsterList = require("../db/monster.json");

class Die {
  constructor() {
    this.faces = [1,2,3,4,5,6];
  }
  roll() {
    let i = Math.random() * this.faces.length;
    return this.faces[i]
  }
}

class GameController {
  constructor() {

  }
  static buildGameData() {
    return {
      monster: monsterList.goblin,
      player: {
        hp: 10,
        xp: 0,
        level: 1,
        gold: 5,
        dice: {
          one: {
            faces: [1,2,3,4,5,6],
            current: 1,
            locked: false
          },
          two: {
            faces: [1,2,3,4,5,6],
            current: 1,
            locked: false
          },
          three: {
            faces: [1,2,3,4,5,6],
            current: 1,
            locked: false
          },
          four: {
            faces: [1,2,3,4,5,6],
            current: 1,
            locked: false
          },
          five: {
            faces: [1,2,3,4,5,6],
            current: 1,
            locked: false
          }
        }
      }
    }
  }
  static startNewFight() {
    let newMonster = monsterList.goblin;
    return newMonster
  }
  static rollDice(dice) {
    //given an array of dice, roll each one to obtain a value
    let results = dice.map((dieSides) => {
      let i = Math.random() * dieSides.length;
      return this.faces[i]
    })
    return results
  }
}

module.exports = { GameController, Die }