var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, framesPerRow, startFrame, endFrame, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.framesPerRow = framesPerRow;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

//TODO animation and CapGuy needs updating to walk other way

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.framesPerRow;
    yindex = Math.floor(frame / this.framesPerRow);

    console.log(frame + " " + xindex + " " + yindex);

    ctx.drawImage(this.spriteSheet,                             // image
        xindex * this.frameWidth, yindex * this.frameHeight,    // sx, sy
        this.frameWidth, this.frameHeight,                      // sw, sh
        x, y,                                                   // dx, dy
        this.frameWidth, this.frameHeight                       // dw, dh
    );
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function CapGuy(game, spritesheet) {
    this.animation = new Animation(spritesheet, 184, 325, 0.1, 16, 8, 0, 7, true, false);
    this.reverseAnimation = new Animation(spritesheet, 184, 325, .1, 8, 8, 8, 15, true, true);
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.reverse = false
}

CapGuy.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

CapGuy.prototype.update = function () {
    if (this.reverse) {
        this.x -= 4.5;

    } else {

    }
    this.x += 4.5;
    if (this.x >= 800) {
        this.x = -200;
    }
}


AM.queueDownload("./capguy-walk.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new CapGuy(gameEngine, AM.getAsset("./capguy-walk.png")));

    console.log("All Done!");
});