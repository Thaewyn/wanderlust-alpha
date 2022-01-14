//console.log("loaded the index.js script");

let app = new PIXI.Application({width:640, height:360});

//document.body.appendChild(app.view);
document.getElementsByClassName("canvas")[0].appendChild(app.view);

// let sprite = PIXI.Sprite.from('images/sample.png');

// app.stage.addChild(sprite);

// let elapsed = 0.0;

// app.ticker.add((delta) => {
//   elapsed += delta;
//   sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
// })

let frame = new PIXI.Graphics();
frame.beginFill(0x666666);
frame.lineStyle({color: 0xffffff, width: 4, alignment: 0});
frame.drawRect(0,0,208,208);
frame.position.set(320-100, 180-100);
app.stage.addChild(frame);

let mask = new PIXI.Graphics();
mask.beginFill(0xffffff);
mask.drawRect(0,0,200,200);
mask.endFill();

let maskContainer = new PIXI.Container();
maskContainer.mask = mask;
maskContainer.addChild(mask);
maskContainer.position.set(4,4);
frame.addChild(maskContainer);

let text = new PIXI.Text(
  "Some random text for testing?\n\nThis is where the main animation area is going to be.",
  {
    fontSize: 24,
    fill: 0x1010ff,
    wordWrap: true,
    wordWrapWidth: 180
  }
);
text.x = 10;
maskContainer.addChild(text);

let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta;
  text.y = 10 + -100.0 + Math.cos(elapsed/50.0) * 100.0;
})