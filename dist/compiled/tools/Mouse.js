"use strict";

(function () {})();
/**
 * Created by apizzimenti on 7/15/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Game's mouse object.
 *
 * @param game {object} Current Phaser game instance.
 * @param map {Map} Game's Map object.
 * @param group {object} Sprite group.
 *
 * @property game {object} Game instance this mouse belongs to.
 * @property map {Map} Game's Map object.
 * @property group {object} Sprite group.
 * @property pos {object} Initial Isometric Point3.
 * @property twoD {object} Phaser 2d pointer position.
 * @property threeD {object} Derived 3d pointer position.
 * @property switch {boolean} Is selected mode on or off?
 * @property tile {object} Tiling system for the mouse pointer.
 * @property tile.center {sprite} Tile currently under the mouse pointer (when selected mode is on).
 * @property mouse {object} Phaser input object.
 *
 * @class {object} Mouse
 * @this Mouse
 * @constructor
 */

function Mouse(game, map, group) {

    this.game = game;
    this.map = map;
    this.group = group;
    this.pos = new Phaser.Plugin.Isometric.Point3();

    var x = this.game.input.mousePointer.x,
        y = this.game.input.mousePointer.y;

    this.twoD = new Phaser.Point(x, y);
    this.threeD = this.game.iso.unproject(this.twoD, this.pos);

    this.switch = false;

    this.tile = {};

    this.mouse = this.game.input;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Updates 2d (twoD) and 3d (threeD) positions as well as world boundaries.
 *
 * @property twoD.x {number} 2d x position.
 * @property twoD.y {number} 2d y position.
 * @property threeD.x {number} 3d x position.
 * @property threeD.y {number} 3d y position.
 * @property inBounds {boolean} Is the mouse pointer within the world boundaries?
 *
 * @this Mouse
 */

Mouse.prototype.update = function () {

    this.twoD.x = this.game.input.mousePointer.x;
    this.twoD.y = this.game.input.mousePointer.y;
    this.threeD = this.game.iso.unproject(this.twoD, this.pos);

    var backX = this.game.physics.isoArcade.bounds.backX,
        backY = this.game.physics.isoArcade.bounds.backY,
        frontX = this.game.physics.isoArcade.bounds.frontX,
        frontY = this.game.physics.isoArcade.bounds.frontY;

    this.inBounds = this.threeD.x > backX && this.threeD.x < frontX && this.threeD.y > backY && this.threeD.y < frontY;
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc If the mouse is in selected mode (i.e. <code>switch</code> is true), this determines the tile to animate.
 *
 * @this Mouse
 */

Mouse.prototype.selected = function () {
    var _this = this;

    if (this.inBounds) {

        this.group.forEach(function (tile) {

            if (tile.type === "tile") {
                var inside = tile.isoBounds.containsXY(_this.threeD.x + _this.map.tileSize, _this.threeD.y + _this.map.tileSize);

                if (inside) {

                    _this.tile = tile;

                    _this.row = _this.tile.row;
                    _this.col = _this.tile.col;

                    tile.tint = 0x98FB98;
                    tile.alpha = 1.3 + Math.sin(_this.game.time.now * 0.007);

                    _this.tween = _this.game.add.tween(tile).to({ isoZ: 5 }, 20, Phaser.Easing.Linear.None, true);
                    _this.tweened = true;
                } else {

                    if (_this.tweened) {
                        _this.tween.stop();
                        _this.tweened = !_this.tweened;
                        tile.isoZ = 0;
                    }
                    tile.discovered ? tile.tint = 0xFFFFFF : tile.tint = 0x571F57;
                    tile.alpha = 1;
                }
            }
        });
    } else {
        this.reset();
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Resets all tile sprites in the group.
 *
 * @this Mouse
 */

Mouse.prototype.reset = function () {
    var _this2 = this;

    this.group.forEach(function (tile) {

        if (tile.type === "tile") {
            tile.discovered ? tile.tint = 0xFFFFFF : tile.tint = 0x571F57;
            tile.alpha = 1;
            tile.isoZ = 0;
            _this2.game.canvas.style.cursor = "default";
        }
    });
};