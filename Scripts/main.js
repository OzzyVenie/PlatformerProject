var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

//setting up delta time variables
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

var hearts = [];
var heartImage = document.createElement("img")
heartImage.src = "Images/heart.png";

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var LAYER_COUNT = 3;

//SET THESE TO HOW BIG YOUR MAP IS tw is width and th is height
var MAP = { tw:60, th:20 }; 

var TILE = 35;
var TILESET_TILE = 70;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;

var tileset = document.createElement("img");
tileset.src = "Images/tileset.png";

var cells = [];

function initializeCollision()
{
	//loop through each layer
	for ( var layerIdx = 0 ; layerIdx < LAYER_COUNT ; ++layerIdx )
	{
		cells[layerIdx] = [];
		var idx = 0;
	
		//loop through each row
		for ( var y = 0 ; y < level1.layers[layerIdx].height ; ++y)
		{
			cells[layerIdx][y] = [];
		
			//loop through each cell
			for ( var x = 0 ; x < level1.layers[layerIdx].width ; ++x)
			{
				//if the tile for this cell is not empty
				if ( level1.layers[layerIdx].data[idx] != 0 )
				{
					//set the 4 cells around it to be colliders
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y][x+1] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y-1][x] = 1;
				}
				
				//if the cell hasn't already been set to 1, set it to 0
				else if (cells[layerIdx][y][x] != 1 )
				{
					cells[layerIdx][y][x] = 0;
				}
				
				++idx;
			}
		}
	}
	
	var bgMusic = new Howl({
			urls : ["Audio/background.ogg"],
			loop : true,
			buffer : true,
			volume : 0.5,
		});
	bgMusic.play();
	
	sfxFire = new Howl(
	{
		urls: ["Audio/fireEffect.ogg"],
		buffer: true,
		volume: 1,
		onend: function() 
		{
			isSfxPlaying = false;
		}
	});
}

function tileToPixel(tile_coord)
{
	return tile_coord * TILE;
}

function pixelToTile(pixel)
{
	return Math.floor(pixel / TILE);
}


function cellAtTileCoord(layer, tx, ty)
{
	//if off the top, left or right of the map
	if ( tx < 0 || tx > MAP.tw || ty < 0 )
	{
		return 1;
	}
	
	//if off the bottom of the map
	if ( ty >= MAP.th )
	{
		return 0;
	}
	
	return cells[layer][ty][tx];
}

function cellAtPixelCoord(layer, x, y)
{
	var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty);
}

function drawMap()
{
	var startX = -1;
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var tileX = pixelToTile(player.position.x);
	var offsetX = TILE + Math.floor(player.position.x%TILE);

	startX = tileX - Math.floor(maxTiles / 2);
	
	if(startX < -1)
	{
		startX = 0;
		offsetX = 0;
	}
	
	if(startX > MAP.tw - maxTiles)
	{
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	}
	
	worldOffsetX = startX * TILE + offsetX;

	for( var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++ )
	{
		for( var y = 0; y < level1.layers[layerIdx].height; y++ )
		{
		var idx = y * level1.layers[layerIdx].width + startX;
		for( var x = startX; x < startX + maxTiles; x++ )
			{
			if( level1.layers[layerIdx].data[idx] != 0 )
				{
					// the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile),
					// so subtract one from the tileset id to get the correct tile
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) *
					(TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) *
					(TILESET_TILE + TILESET_SPACING);
					ctx.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE,
					(x-startX)*TILE - offsetX, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
			idx++;
			}
		}
	}
}

var keyboard = new Keyboard();
var player = new Player();
var enemy = new Enemy();
var bullets = new Bullet();

var timer = 0;


function run()
{
	var deltaTime = getDeltaTime();
	
	timer += deltaTime;
	
	if (deltaTime > 0.03)
	{
		deltaTime = 0.03;
	}

	ctx.fillStyle = "#ccc";		
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	drawMap();
	
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,390,62);
	ctx.stroke();
	
	if ( player.health <= 0)
	{
		player.position.set(player.position.set)
		player.health = 100;
	}
	
	//enemy.update(deltaTime);
	//enemy.draw();
	
	//ctx.beginPath();
	//ctx.rect(player.position.x, player.position.y, TILE, TILE);
	//ctx.stroke();
	
	// score
	ctx.fillStyle = "white";
	ctx.font="30px Cooper Std Black";
	ctx.fillText("Score : " + player.score, 200, 40);
	
	
	for(var i=0; i<player.lives; ++i)
	{
		ctx.drawImage(heartImage, 20 + ((heartImage.width+2)*i), 10);
	}
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}	
	
	// draw the FPS
	ctx.fillStyle = "red";
	ctx.font="20px Cooper Std Black";
	ctx.fillText("FPS : " + fps,  892, 30);
	
	ctx.fillStyle = "red";
	ctx.font = "20px Cooper Std Black";
	ctx.fillText("Time : " + Math.floor(timer), 880, 50);
	
	if (!player.isDead && !enemy.isDead)
	{
		player.update(deltaTime);
		player.draw();
		
		enemy.update(deltaTime);
		enemy.draw();
	}
	else
	{
		var endGame = "Game over!";
		ctx.fillStyle = "white";
		ctx.font="50px Cooper Std Black";
		ctx.fillText(endGame, (canvas.width / 2) - ctx.measureText(endGame).width / 2, canvas.height / 2);
	}
	
	var hit=false;
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		if( bullets[i].position.x - worldOffsetX < 0 ||
		bullets[i].position.x - worldOffsetX > SCREEN_WIDTH)
		{
			hit = true;
		}
			for(var j=0; j<enemies.length; j++)
			{
				if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE,
				enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
				{
					// kill both the bullet and the enemy
					enemies.splice(j, 1);
					hit = true;
					// increment the player score
					score += 1;
					break;
				}
			}
		
		if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}
	}
	
}


initializeCollision();

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);