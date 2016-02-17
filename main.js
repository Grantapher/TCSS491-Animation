var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, startFrame, loop, reverse, drawOutlines) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.startFrame = startFrame;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.drawOutlines = drawOutlines;
}

//TODO animation and CapGuy needs updating to walk other way

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var index = this.currentFrame();

    index = this.reverse ? this.frames - index - 1 : index;
    index += this.startFrame;
    var vindex = 0;
    if ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    ctx.drawImage(this.spriteSheet,                             // image
        index * this.frameWidth, vindex * this.frameHeight,     // sx, sy
        this.frameWidth, this.frameHeight,                      // sw, sh
        x, y,                                                   // dx, dy
        this.frameWidth, this.frameHeight                       // dw, dh
    );

    if (this.drawOutlines) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(x, y, this.frameWidth, this.frameHeight);
    }
};

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

function CapGuy(game, spritesheet) {
    this.animation = new Animation(spritesheet, 184, 325, 0.1, 8, 0, true, false);
    this.reverseAnimation = new Animation(spritesheet, 184, 325, .1, 8, 8, true, true);
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.reverse = false;
}

CapGuy.prototype.draw = function () {
    if (this.reverse) this.reverseAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
};

CapGuy.prototype.update = function () {
    if (this.reverse) {
        this.x -= 4.5;
        if (this.x <= -200) {
            this.y = 0;
            this.reverse = !this.reverse;
        }
    } else {
        this.x += 4.5;
        if (this.x >= 816) {
            this.y = 325;
            this.reverse = !this.reverse;
        }
    }
};

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