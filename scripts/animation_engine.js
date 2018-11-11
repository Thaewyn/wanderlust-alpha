var character_guid = 0;

var animation_engine = {
  /* === variables === */

  /* === functions === */
  init: function () {
    //not sure if this will be necessary.
  },
  build_sprite: function (parent_id, width, height, size, sprite) {
    //this function assumes the parent element is zero width and height
    // it creates child elements and spaces them accordingly.
    // This assumes there is a CSS rule that forces the individual pixels to be width and height = size
    //Expected params:
    // parent_id - the CSS selector (passed directly into jquery) of the parent element for this sprite
    // width - the width in 'pixels' of the sprite to be created (pixels in this case is the virtual div pixels being created)
    // height - the height of the sprite, as width above
    // size - the pixel width and heigh of each 'pixel' div

    //console.log("build sprite. parent_id = "+parent_id+", width: "+width+" height: "+height+" size: "+size);

    var counter = 1;
    var x_offset = 0;
    var y_offset = 0;
    var new_class = null;
    var target_sprite = smiley_sprite;
    //var id_name = "";
    character_guid++

    switch(sprite) {
      case 'smiley':
        target_sprite = smiley_sprite;
        break;
      case 'goblin':
        target_sprite = goblin_sprite;
        var id_name = 'goblin_';
        $(parent_id).attr("id",id_name+character_guid);
        break;
      default:
        target_sprite = smiley_sprite;
        break;
    }

    for (i=0; i<height; i++) {
      //rows
      for (j=0; j<width; j++) {
        //columns.
        //at this point, we build a div element under the parent with its class equal to 'pixel_[counter]'
        // and offset equal to... hm. Assuming height and width are even (should probably require that...)
        // the offset would go from -(half of width*size) to +(half of width*size). So that would make it
        // -((width/2)*size)+(i*size), or rearranged: (i-(width/2))*size
        new_class = character_guid+"_pixel_"+counter;
        counter++;
        $(parent_id).append("<div class='"+new_class+"'></div>");
        x_offset = (j-(width/2))*size;
        y_offset = (i-(height/2))*size;
        $("."+new_class).css("top", y_offset);
        $("."+new_class).css("left", x_offset);
        $("."+new_class).css("background-color", target_sprite[i][j]);
      }
    }
  },
  pixel_shock_right: function (target) {
    //console.log("pixel_shock_right target= "+target);
    //staggered 'push' in a direction - from top-left corner
    $(target).children("[class*='pixel']").each(function (i) { // TODO: switch from '8' to sqrt of the total number of children...

      var x_coord = (i%8)+1;
      var y_coord = Math.floor((i-1)/8)+1;
      var x_offset = Math.floor(Math.random()*3)+x_coord;
      var y_offset = Math.floor(Math.random()*3)+y_coord;

      TweenMax.to(this, 10, {
        //delay: Math.floor(i/3),
        top: "+="+y_offset,
        left: "+="+x_offset,
        repeat: 1,
        yoyo: true,
        useFrames: true
      })
    });
  },


  /* ==== Experimental stuff ==== */
  // move good ones and working things above this line.
  test: function () {
    //flag/wave function
    
    $("[class*='pixel']").each(function (i) {
      TweenMax.to(this, 10, {
        delay: Math.floor(i/3),
        top: "+=10",
        left: "+=40",
        repeat: 3,
        yoyo: true,
        useFrames: true
      })
    });

  },
  test2: function () {

    //randomized target! -- good one ---
    /*
    $("[class^='pixel']").each(function (i) {
      //need a different tween for each pixel if it's going to be randomized.
      TweenMax.to(this, 10, {
        delay: Math.floor(i/3),
        top: Math.floor(Math.random()*200)-100,
        left: Math.floor(Math.random()*200)-100,
        repeat: 1,
        yoyo: true,
        useFrames: true
      })
    });*/

    $("[class*='pixel']").each(function (i) {
      //need a different tween for each pixel if it's going to be randomized.
      TweenMax.to(this, 30, {
        delay: Math.floor(i/3),
        top: Math.floor(Math.random()*200)-100,
        left: Math.floor(Math.random()*200)-100,
        repeat: 1,
        yoyo: true,
        useFrames: true,
        ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 1, points: 20, taper: "out", randomize: true, clamp: false})
      })
    });
  },
  test3: function () {
    //single location target
    
    TweenMax.staggerTo($("[class*='pixel']"), 10, {
    //TweenMax.to($("[class*='pixel']"), 10, {
      top: Math.floor(Math.random()*200)-100,
      left: Math.floor(Math.random()*200)-100,
      repeat: 1,
      yoyo: true,
      useFrames: true
    },1);
  },
  player_damage_left: function () {
    //staggered 'push' in a direction - top-left corner
    $("#player").children("[class*='pixel']").each(function (i) { // TODO: switch from '8' to sqrt of the total number of children...

      var x_coord = (i%8)+1;
      var y_coord = Math.floor((i-1)/8)+1;
      var x_offset = Math.floor(Math.random()*3)+x_coord;
      var y_offset = Math.floor(Math.random()*3)+y_coord;

      TweenMax.to(this, 10, {
        //delay: Math.floor(i/3),
        top: "+="+y_offset,
        left: "+="+x_offset,
        repeat: 1,
        yoyo: true,
        useFrames: true
      })
    });
  },
  player_damage_right: function () {
    //staggered 'push' in a direction - top-right corner
    $("#player").children("[class*='pixel']").each(function (i) {

      var x_coord = 8-(i%8);
      var y_coord = Math.floor((i-1)/8)+1;
      var x_offset = Math.floor(Math.random()*3)+x_coord;
      var y_offset = Math.floor(Math.random()*3)+y_coord;

      TweenMax.to(this, 10, {
        //delay: Math.floor(i/3),
        top: "+="+y_offset,
        left: "-="+x_offset,
        repeat: 1,
        yoyo: true,
        useFrames: true
      })
    });
  },
  player_damage_top: function (target = "#player") {
    //staggered 'push' in a direction - top-down
    $(target).children("[class*='pixel']").each(function (i) {

      var x_coord = (i%8)-4;
      var y_coord = Math.floor((i-1)/8)+1;
      var x_offset = Math.floor(Math.random()*4)+x_coord;
      var y_offset = Math.floor(Math.random()*5)+y_coord;
      var left_opt = null;

      if (x_coord == 0) {
        left_opt = 0;
      } else if (x_coord < 0) {
        left_opt = "-="+Math.abs(x_offset);
      } else {
        left_opt = "+="+x_offset;
      }

      TweenMax.to(this, 10, {
        //delay: Math.floor(i/3),
        top: "+="+y_offset,
        left: left_opt,
        repeat: 1,
        yoyo: true,
        useFrames: true
      })
    });
  }
}
