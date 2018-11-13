var debug = function (string) {
  console.log(string);
}

var gameController = {
  //global variables
  row_count: 5,
  current_lane: 3,
  animation_speed: 0.25, //currently in seconds, will need to change if we make the tweens use frames.

  //objects and functions
  player: {
    //The player object. Should hold current status, hp, attack, defense, etc.
    stat_maxhp: 4,
    stat_hp: 4,
    stat_atk: 1,
    stat_def: 1,
    stat_lvl: 1,
    stat_xp: 0,
    stat_gold: 0,
    weapon: {
      name: 'Wooden Sword',
      attack: 1
    },
    armor: {
      name: 'Leather Armor',
      defense: 1
    },
    
    attack: function () {
      //computed attack stat, based on equipment
      //console.log("player.attack");
      return this.stat_atk + this.weapon.attack;
    },
    defense: function () {
      //computed defense stat, based on equipment
      //console.log("player.defense");

      var defense = this.stat_def + this.weapon.defense;
      //console.log("defense: "+defense);
      return defense;
    },
    equip: function (slot, item) {
      console.log("player.equip");
      //equip a new item into the given slot.
      if (slot == 'weapon') {
        this.weapon = item;
        this.stat_atk = this.stat_lvl + parseInt(item.attack);
        $(".hud .attack").children(".hud_data").text(this.stat_atk);
        $(".hud .weapon").children(".hud_data").text(this.weapon.name);
      } else if (slot == 'armor') {
        this.armor = item;
        this.stat_def = this.stat_lvl + parseInt(item.defense);
        $(".hud .defense").children(".hud_data").text(this.stat_def);
        $(".hud .armor").children(".hud_data").text(this.armor.name);
      }
      gameController.speech_bubble("This should help.");
    },
    compare: function (slot, item) {
      console.log("player.compare");
      //return a comparison between the item passed in the function
      // and the player's current equipment
    },
    gain_xp: function (amount) {
      //console.log("player.gain_xp: "+amount);
      //called when the player defeats a monster or boss.
      // If they gain enough, they level up (separate function)
      this.stat_xp += amount;

      if (this.stat_xp >= (this.stat_lvl * 10)) {
        this.level_up();
      }

      $(".hud .xp").children(".hud_data").text(this.stat_xp);
    },
    gain_gold: function (amount) {
      //console.log("player.gain_gold: "+amount);
      //earned gold. No secondary function beyond updating the HUD
      this.stat_gold += amount;

      $(".hud .gold").children(".hud_data").text(this.stat_gold);

    },
    spend_gold: function (amount) {
      //console.log("player.gain_gold: "+amount);
      //earned gold. No secondary function beyond updating the HUD
      this.stat_gold -= amount;

      $(".hud .gold").children(".hud_data").text(this.stat_gold);

    },
    level_up: function () {
      //console.log("player.level_up");
      //called when the player gains enough xp to level up
      // reset the current xp to 0, increase the level by 1,
      // and increase the base atk and def stats as necessary.

      var rollover = this.stat_xp - (this.stat_lvl * 10);
      this.stat_lvl += 1;
      this.stat_xp = rollover;

      //increase max health, refill health 
      this.stat_maxhp += 4;
      this.stat_hp = this.stat_maxhp;
      $(".hud .hp").children(".hud_data").text(this.stat_hp);
      gameController.speech_bubble("Level up!");

      //alternate increasing base attack and defense
      switch (this.stat_lvl % 2) {
        case 1:
          this.stat_atk += 1;
          $(".hud .attack").children(".hud_data").text(this.stat_atk);
          break;
        case 0:
          this.stat_def += 1;
          $(".hud .defense").children(".hud_data").text(this.stat_def);
          break;
      }

      $(".hud .xp").children(".hud_data").text(this.stat_xp);
      $(".hud .level").children(".hud_data").text(this.stat_lvl);
    },
    take_damage: function (amount) {
      //console.log("player.take_damage: "+amount);
      //take damage from a source. If the player's HP drops to or below
      // zero, run the 'game over' state.
      this.stat_hp -= amount;
      $(".hud .hp").children(".hud_data").text(this.stat_hp);

    },
    rest: function () {
      //full heal at the inn.
      this.stat_hp = this.stat_maxhp;
      $(".hud .hp").children(".hud_data").text(this.stat_hp);
      gameController.speech_bubble("Good as new.");
    }
  },
  init: function () {
    //console.log("gameController.init");
    //Set up the basics, make sure the player is in the right location, 
    // build any tweens that need to be made, etc

    animation_engine.build_sprite("#player", 8, 8, 4);
  },
  start: function () {
    console.log("gameController.start");
    //Player pressed the 'start' button. Listen for input and react accordingly
  },
  player_up: function () {
    //console.log("gameController.player_up");
    //the player is trying to move forward. Find out if they're bumping into anything
    // handle that interaction if necessary, then call new_row if they moved

    //find out what row the player is currently in:

    if (TweenMax.getTweensOf("#player").length == 0) { 
      var current_row = $("#player").parent().attr("class").split("_")[1];
      var new_row = parseInt(current_row) + 1;

      var target_space = $(".lane_"+this.current_lane+">.row_"+new_row);

      if (target_space.children().length > 0) {
        if (target_space.children(".monster").length > 0) {
          if (this.fight(target_space.children(".monster"))) {
            this.move_up(target_space, current_row);
          } else {
            //don't move if the fight isn't over
          }
        }
        if(target_space.children(".building").length > 0) {
          if(this.interact(target_space.children(".building"))) {
            this.move_up(target_space, current_row);
          } else {
            //can't afford it, stay here.
          }
        }
      } else {
        this.move_up(target_space, current_row);
      }
    }
  },
  move_up: function (target_space, current_row) {
    target_space.append($("#player").detach());
    TweenMax.fromTo($("#player"), this.animation_speed, {
      top: "300px"
    }, {
      top: "100px",
      ease: "linear"
    });
    this.new_row(current_row);

  },
  player_left: function () {
    //console.log("gameController.player_left");

      if (TweenMax.getTweensOf("#player").length == 0 && gameController.current_lane > 1) { 
      var current_row = $("#player").parent().attr("class").split("_")[1];
      var new_row = parseInt(current_row) + 1;

      var target_space = $(".lane_"+(this.current_lane-1)+">.row_"+new_row);
      
      if (target_space.children().length > 0) { 
        //is there something there? Then we need to handle it and then move
        // afterward if necessary.
        //console.log("collided with something!");
        if (target_space.children(".monster").length > 0) {
          //console.log("collided with monster! Fight!");
          if(this.fight(target_space.children(".monster"))) {
            //killed the monster! Move there.
            this.move_left(target_space, current_row);
          } else {
            //fight isn't over, fight again!
          }
        }
        if(target_space.children(".building").length > 0) {
          if(this.interact(target_space.children(".building"))) {
            this.move_left(target_space, current_row);
          } else {
            //can't afford it, stay here.
          }
        }

      } else {
        //empty space. Continue.
        this.move_left(target_space, current_row);
      }
    }
  },
  move_left: function (target_space, current_row) {
    //after the 'player_left' function, if the result tells the player to move, this handles that.

    this.current_lane -= 1;

    //first pass, assume that it's clear and just move the things.
    target_space.append($("#player").detach());
    TweenMax.fromTo($("#player"), this.animation_speed, {
      top: "300px",
      left: "300px",
    }, {
      top: "100px",
      left: "100px",
      ease: "linear"
    });
    this.new_row(current_row);

    TweenMax.to("[class^='lane_']", this.animation_speed, {
      left: "+=200"
    });
  },
  player_right: function () {
    //console.log("gameController.player_right");
    if (TweenMax.getTweensOf("#player").length == 0 && gameController.current_lane < 5) { 
      var current_row = $("#player").parent().attr("class").split("_")[1];
      var new_row = parseInt(current_row) + 1;

      var target_space = $(".lane_"+(this.current_lane+1)+">.row_"+new_row);
      
      if (target_space.children().length > 0) {
        if (target_space.children(".monster").length > 0) {
          if (this.fight(target_space.children(".monster"))) {
            this.move_right(target_space, current_row);
          } else {
            //don't move if the fight isn't over
          }
        }
        if(target_space.children(".building").length > 0) {
          if(this.interact(target_space.children(".building"))) {
            this.move_right(target_space, current_row);
          } else {
            //can't afford it, stay here.
          }
        }
      } else {
        this.move_right(target_space, current_row);
      }
    }
  },
  move_right: function (target_space, current_row) {
    this.current_lane += 1;

    //first pass, assume that it's clear and just move the things.
    target_space.append($("#player").detach());
    TweenMax.fromTo($("#player"), this.animation_speed, {
      top: "300px",
      left: "-100px",
    }, {
      top: "100px",
      left: "100px",
      ease: "linear"
    });
    this.new_row(current_row);

    TweenMax.to("[class^='lane_']", this.animation_speed, {
      left: "-=200"
    });
  },
  new_row: function (current_row) {
    //console.log("gameController.new_row");
    // this gets called after any player move that results in an actual move
    // Build the new row at the top of the screen, move everything else down
    // clean up the bottom row that's moved out of sight.
    this.row_count += 1;
    $("[class^='lane_']").prepend("<div class='row_"+this.row_count+"'></div>");

    //Randomizer to put a monster in lane every 3 rows.
    if (this.row_count % 3 == 0) {
      var which_lane = Math.floor(Math.random()*5)+1;
      this.spawn_monster(which_lane);
    } else if (this.row_count % 20 == 0) { //spawn an inn every... 20 rows? TODO: balance out the building spawn rates
      var which_lane = Math.floor(Math.random()*5)+1; // Do we want inns to spawn in every lane? We could restrict it to only certain lanes
      this.spawn_inn(which_lane);
    } else if (this.row_count % 30 == 5) { //moved these into 'else' statements so we wouldn't have conflicts.
      var which_lane = Math.floor(Math.random()*5)+1;
      this.spawn_weaponsmith(which_lane);
    } else if (this.row_count % 23 == 0) {
      var which_lane = Math.floor(Math.random()*5)+1;
      this.spawn_armorsmith(which_lane);
    }

    TweenMax.to("[class^='row_']", this.animation_speed, {
      top: "+=200",
      onComplete: this.new_row_cleanup,
      onCompleteParams: [current_row]
    });
  },
  new_row_cleanup: function (current_row) {
    //console.log("gameController.new_row_cleanup");
    $(".row_"+current_row).remove();
  },
  fight: function (monster) {
    //console.log("gameController.fight, monster = "+monster);
    //Takes the passed in monster (for the stats) and has them fight the player.
    // will return a boolean value based on the outcome. True means the player
    // won the fight and can progress forward. False means that the fight isn't
    // over yet, and damage is dealt.
    var updated_hp = parseInt(monster.attr("hp")) - this.player.attack();
    if(updated_hp <= 0) {
      //victory! Monster is slain, need to award XP and gold, remove monster sprite, and
      // make sure to return true so that move functions move properly.
      this.player.gain_gold(parseInt(monster.attr("gold")));
      this.player.gain_xp(parseInt(monster.attr("xp")));
      monster.remove();
      return true;
    } else {
      //console.log("attempt damage animation");
      animation_engine.pixel_shock_right("#"+monster.attr("id"));
      var damage = parseInt(monster.attr("attack")) - this.player.stat_def;
      if (damage > 0) {
        //console.log("damage taken: "+damage);
        this.player.take_damage(damage);
      } else {
        //console.log("hit, but no damage taken. damage = "+damage);
        //clink. Probably want a special animation for this so there is some feedback...
      }
      monster.attr("hp", updated_hp);
      return false;
    }
  },
  interact: function (interactable) {
    console.log("gameController.interact");
    //this takes in any non-monster object the player bumps into and handles the interaction.
    // In the case of (if we ever do them) pickups and power ups, apply their effects and then
    // return true (so that the player moves into that space). In the case of buildings, only
    // return true and apply the effect if the player can afford it. Might need to add some
    // money handling functions to the player object depending on how this goes.

    if(interactable.attr("cost") <= this.player.stat_gold) {
      this.player.spend_gold(interactable.attr("cost"));
      if(interactable.attr("name") == "inn") {
        this.player.rest();
        return true;
      } else if (interactable.attr("name") == "weaponsmith") {
        var weapon = {
          name: interactable.attr("weapon"),
          attack: interactable.attr("attack")
        }
        this.player.equip('weapon', weapon);
        return true;
      } else if (interactable.attr("name") == "armorsmith") {
        var armor = {
          name: interactable.attr("armor"),
          defense: interactable.attr("defense")
        }
        this.player.equip('armor', armor);
        return true;
      }
    } else {
      this.speech_bubble("I don't have enough gold!");
      return false;
    }

  },
  spawn_monster: function (lane_num) {
    //console.log("gameController.spawn_monster in lane "+lane_num);
    //takes a position value (might need to be split into x and y?) and creates
    // a monster object there. Right now, assuming monsters will only spawn into
    // newly-created rows, so all we need is the lane.

    var monster_picker = new Array();

    // using a switch statement to build the monster list so I can utilize 
    // fallthrough behavior to build up the list of creatures to choose from.
    var level = parseInt(this.player.stat_lvl);
    switch (level) {
      default:
      case 10:
        monster_picker.push(monster_list.lich);
      case 7:
        monster_picker.push(monster_list.zombie);
      case 5:
        monster_picker.push(monster_list.ghoul);
      case 3:
        monster_picker.push(monster_list.orc);
      case 2:
        //console.log("add warg to moster list");
        monster_picker.push(monster_list.warg);
      case 1:
        if(level > 3) { 
          //goblins should only spawn between levels 1 and 4
          break;
        } 
        //console.log("add goblin to monster list");
        monster_picker.push(monster_list.goblin);
        
      case 0:
        //shouldn't happen...
    }

    var which = Math.floor(Math.random()*monster_picker.length);
    var monster = monster_picker[which];

    if (monster.includes("goblin")) {
      $(".lane_"+lane_num+" .row_"+this.row_count).append(monster);
      animation_engine.build_sprite(".lane_"+lane_num+" .row_"+this.row_count+" .goblin", 8, 8, 4, "goblin");
    } else {
      $(".lane_"+lane_num+" .row_"+this.row_count).append(monster);
    }
  },
  spawn_weaponsmith: function (lane_num) {
    console.log("gameController.spawn_weaponsmith");

    $(".lane_"+lane_num+" .row_"+this.row_count).append(building_list.weaponsmith_1);
  },
  spawn_armorsmith: function (lane_num) {
    console.log("gameController.spawn_armorsmith");

    $(".lane_"+lane_num+" .row_"+this.row_count).append(building_list.armorsmith_1);
  },
  spawn_inn: function (lane_num) {
    console.log("gameController.spawn_inn");

    var cost = this.player.stat_lvl * 5
    $(".lane_"+lane_num+" .row_"+this.row_count).append("<div name='inn' class='building inn' cost='"+cost+"'>Inn</div>");
  },
  speech_bubble: function (text, target) {
    //console.log("speech_bubble");
    // ok, so this will take in a text string and apply it to a target as a child element.
    // It should be possible to have the characters appear one at a time, staggered (possibly
    //  making use of the TimelineMax's staggerTo function). At first, let's just get a box to appear.

    if(!target) {
      //console.log("defaulting");
      target = "#player .speech_bubble";
    }
    

    if (TweenMax.getTweensOf(target).length == 0) { 
      $(target+" p").empty();
      var chars = text.split("");
      for (i=0; i<text.length; i++) {
        $(target+" p").append("<span class='char_"+i+"' style='opacity:0;'>"+text[i]+"</span>");
      }

      var speech = new TimelineMax({paused:true, useFrames: true});
      speech.addLabel("start")
        .add(TweenMax.fromTo(target, 1, {
          opacity: 0
        }, {
          opacity: 1
        }))
        .add(TweenMax.staggerTo(target+" [class^='char_']", 3, {
          opacity:1
        }, 3))
        .addLabel("text_done", "+=90")
        .add(TweenMax.fromTo(target, 10, {
          opacity: 1
        }, {
          opacity: 0
        }), "text_done");
      speech.restart();
    }
  }
}

var monster_list = {
  goblin: "<div name='goblin' class='monster goblin' attack='1' hp='5' gold='2' xp='3'></div>",
  warg: "<div name='warg' class='monster warg' attack='3' hp='6' gold='3' xp='5'></div>",
  orc: "<div name='orc' class='monster orc' attack='5' hp='10' gold='5' xp='7'></div>",
  troll: "<div name='troll' class='monster troll' attack='7' hp='20' gold='6' xp='9'></div>",
  ghoul: "<div name='ghoul' class='monster ghoul' attack='9' hp='15' gold='8' xp='11'></div>",
  zombie: "<div name='zombie' class='monster zombie' attack='12' hp='15' gold='9' xp='13'></div>",
  lich: "<div name='lich' class='monster lich' attack='15' hp='30' gold='10' xp='15'></div>"
}

var building_list = {
  weaponsmith_1: "<div name='weaponsmith' class='building weaponsmith' cost='50' weapon='Steel Sword' attack='3'>Weaponsmith\nSteel sword\n50 Gold</div>",
  armorsmith_1: "<div name='armorsmith' class='building armorsmith' cost='70' armor='Steel Armor' defense='3'>Armorsmith\nSteel Armor\n70 Gold</div>"
}

$(document).ready(function () {
  //console.log("document ready.");

  gameController.init();

  //keybindings setup
  $(document).keydown(function (evt) {
    //console.log("keydown event... "+ evt.which);
    switch(evt.which) {
      case 37:
        //left
        gameController.player_left();
        break;
      case 38:
        //up
        gameController.player_up();
        break;
      case 39:
        //right
        gameController.player_right();
        break;
    }
  });

  $(".controls .left").on("click", function() {gameController.player_left()});
  $(".controls .right").on("click", function() {gameController.player_right()});
  $(".controls .up").on("click", function() {gameController.player_up()});
});