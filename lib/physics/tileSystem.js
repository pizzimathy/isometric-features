(function () {"use strict";})();
/**
 * Created by apizzimenti on 5/19/16.
 */


/*
    directions:


         ^
         1
    < 2    0 >
         3
         ˘
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Computes the direction and cross boundaries for the given sprite.
 *
 * @param Sprite {Animal | Player | Item} Object containing a Phaser sprite.
 *
 * @see Animal
 * @see Player
 */

function direction (Sprite) {

    var sprite = Sprite.sprite,
        x = sprite.body.frontX,
        y = sprite.body.frontY,
        tileMap = Sprite.map.tileMap,
        tileSize = Sprite.map.tileSize,
        row = Math.ceil(x / tileSize) >= tileMap.length - 1 ? tileMap.length - 1 : Math.ceil(x / tileSize),
        col = Math.ceil(y / tileSize) >= tileMap[0].length - 1 ? tileMap[0].length - 1 : Math.ceil(y / tileSize),
        dir = sprite.direction,
        r = determineTileRadius(tileMap.length, row),
        c = determineTileRadius(tileMap.length, col),
        rp = r.p,
        rm = r.m,
        cp = c.p,
        cm = c.m;

    sprite.row = row;
    sprite.col = col;
    
    sprite.tile.center = tileMap[row][col];
    
    switch (dir) {
        case 0:
            sprite.tile.top = tileMap[rp][col];
            sprite.tile.left = tileMap[row][cm];
            sprite.tile.right = tileMap[row][cp];
            sprite.tile.bottom = tileMap[rm][col];

            break;

        case 1:
            sprite.tile.top = tileMap[row][cm];
            sprite.tile.left = tileMap[rm][col];
            sprite.tile.right = tileMap[rp][col];
            sprite.tile.bottom = tileMap[row][cp];

            break;

        case 2:
            sprite.tile.top = tileMap[rm][col];
            sprite.tile.left = tileMap[row][cp];
            sprite.tile.right = tileMap[row][cm];
            sprite.tile.bottom = tileMap[rp][col];

            break;

        case 3:
            sprite.tile.top = tileMap[row][cp];
            sprite.tile.left = tileMap[rp][col];
            sprite.tile.right = tileMap[rm][col];
            sprite.tile.bottom = tileMap[row][cm];

            break;
    }
    
    sprite.loadTexture(Sprite.keys[dir]);

}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Determines whether a dimension is within a range.
 *
 * @param length {number} Length of containing array.
 * @param dim {number} Row or column number.
 *
 * @returns {{m: number, p: number}} Adjusted +/- dimensions.
 */

function determineTileRadius (length, dim) {

    return {
        m: dim > 0 ? dim -1 : dim,
        p: dim < length - 1 ? dim + 1 : dim
    };
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Takes in a sprite and a direction number, and sets the velocity accordingly.
 *
 * @param sprite {Player | Animal} Sprite's parent.
 * @param d {number} Randomized direction.
 */

function manipulateDirection (sprite, d) {

    var speed = 20,
        s = sprite.sprite;

    switch (d) {
        case 0:
            s.body.velocity.x = speed;
            s.body.velocity.y = 0;
            s.direction = 0;

            break;

        case 1:
            s.body.velocity.x = 0;
            s.body.velocity.y = -speed;
            s.direction = 1;

            break;

        case 2:
            s.body.velocity.x = -speed;
            s.body.velocity.y = 0;
            s.direction = 2;

            break;

        case 3:
            s.body.velocity.x = 0;
            s.body.velocity.y = speed;
            s.direction = 3;

            break;
    }
}