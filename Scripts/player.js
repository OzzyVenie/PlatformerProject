var LEFT = 0;
var RIGHT = 1;
var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_CLIMB = 6;
var ANIM_SHOOT_LEFT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 9;

var Player = function() 
{
	this.sprite = new Sprite("Images/ChuckNorris.png");
	this.sprite.buildAnimation(12, 8, 165, 126, 0.10, [0, 1, 2, 3, 4, 5, 6, 7]);//idle left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [8, 9, 10, 11, 12]);// LEFT_JUMP
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);//LEFT_WALK
	this.sprite.buildAnimation(12, 8, 165, 126, 0.10, [52, 53, 54, 55, 56, 57, 58, 59]);//RIGHT IDLE
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [60, 61, 62, 63, 64]);//RIGHT JUMP
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);//RIGHT WALK
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 51]);//climb
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);//shoot left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91]);//shoot right
	
	this.startPos = new Vector2();
	this.startPos.set(100, 400);
	
	this.position = new Vector2();
	this.position.set(this.startPos.x, this.startPos.y);
	
	this.velocity = new Vector2();
	
	this.width = 152;
	this.height = 136;
	this.jumping = false;
	this.falling = false;
	
	this.score = 100;
	this.health = 100;
	this.lives = 3;
	this.isDead = false;
	
	this.cooldownTimer = 0;
	
	this.fireRate = 2000;
	this.isShooting = false;
	
	this.bulletTimer = 0;
	this.bullets = [];
	
	for(var i=0; i<9; i++)
	{
		this.sprite.setAnimationOffset(i, -this.width/2 + 16, -this.height/2 - 16);
	}
	
	this.direction = LEFT;
	this.speed = 300;
	
	this.angularVelocity = 0;
	this.rotation = 0;
};

Player.prototype.update = function(deltaTime)
{
	if(!this.isDead)
	{
		this.sprite.update(deltaTime);
		this.bulletTimer -= deltaTime;

		var acceleration = new Vector2();
		var playerAccel = 4000;
		var playerDrag = 12;
		var playerGravity = TILE * 9.8 * 6;
		var jumpForce = 50000;
		
		if(player.position.y > canvas.height - 10){
			this.lives -= 1;
			this.position.set(this.startPos.x, this.startPos.y);
		}
		
		if(player.lives <= 0){
			this.isDead = true;
		}
		
		acceleration.y = playerGravity;
		
		if(keyboard.isKeyDown(keyboard.KEY_A) == true )
		{
			this.x -= this.speed * deltaTime;
			acceleration.x -= playerAccel;
			left = true;
			this.direction = LEFT;
			if(this.sprite.currentAnimation != ANIM_WALK_LEFT && this.jumping == false && this.falling == false)
			{	
				this.sprite.setAnimation(ANIM_WALK_LEFT);
			}
		}

		if(keyboard.isKeyDown(keyboard.KEY_D) == true )
		{
			this.x += this.speed * deltaTime;
			acceleration.x += playerAccel;
			right = true;
			this.direction = RIGHT;
			if(this.sprite.currentAnimation != ANIM_WALK_RIGHT && this.jumping == false && this.falling == false)
				this.sprite.setAnimation(ANIM_WALK_RIGHT);
		}
		if(this.cooldownTimer > 0)
		{
			this.cooldownTimer -= deltaTime;
		}
		
		if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true  && this.cooldownTimer <= 0)
		{
			if ( this.bulletTimer < 0 ){
				this.bullets.push(new Bullet(this.position.x, this.position.y, this.direction));
				this.bulletTimer = 0.25;
			}
			if(this.direction == LEFT){  
				if(this.sprite.currentAnimation != ANIM_SHOOT_LEFT){
					this.sprite.setAnimation(ANIM_SHOOT_LEFT);
				}	
			} else{
				if(this.sprite.currentAnimation != ANIM_SHOOT_RIGHT){
					this.sprite.setAnimation(ANIM_SHOOT_RIGHT);
				}	
			}
			
			sfxFire.play();
			this.cooldownTimer = 0.3;
		}
		
		if(this.jumping == false && this.falling == false && Math.abs(this.velocity.x) < 20)
		{
			if(this.direction == LEFT)
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
				this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}
			else
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
				this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
		}
		
		
		if(this.jumping || this.falling )
		{
			if(this.direction == LEFT)
			{
				if(this.sprite.currentAnimation != ANIM_JUMP_LEFT)
				this.sprite.setAnimation(ANIM_JUMP_LEFT);
			}
			else
			{
				if(this.sprite.currentAnimation != ANIM_JUMP_RIGHT)
				this.sprite.setAnimation(ANIM_JUMP_RIGHT);
			}
		}
		
		if ( this.velocity.y > 0 )
		{
			this.falling = true;
		}
		else
		{
			this.falling = false;
		}
		
		if ( keyboard.isKeyDown(keyboard.KEY_W) && !this.jumping && !this.falling )
		{
			acceleration.y -= jumpForce;
			this.jumping = true;
			if(this.direction == LEFT)
				this.sprite.setAnimation(ANIM_JUMP_LEFT)
			else
				this.sprite.setAnimation(ANIM_JUMP_RIGHT)
		}
		
		

		
		var dragVector = this.velocity.multiplyScalar(playerDrag);
		dragVector.y = 0;
		acceleration = acceleration.subtract(dragVector);
		
		this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
		this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
		
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);	
		var nx = this.position.x % TILE;
		var ny = this.position.y % TILE;
		
		
		var collOffset = new Vector2();
		collOffset.set(-TILE/2, 5);//this.height/2 - TILE);
		
		var collPos = this.position.add(collOffset);
			
		var tx = pixelToTile(collPos.x);
		var ty = pixelToTile(collPos.y);
		var nx = collPos.x % TILE;
		var ny = collPos.y % TILE;
		
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
		var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
		var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);
		
		//ACTUAL COLLISION!
		if ( this.velocity.y > 0 ) //if moving down
		{
			if ( (cell_down && !cell) || (cell_diag && !cell_right && nx) )
			{
				this.position.y = tileToPixel(ty) - collOffset.y;
				this.velocity.y = 0;
				ny = 0;
				this.jumping = false;
			}
		}
		else if (this.velocity.y < 0 ) //if moving up
		{
			if ( (cell && !cell_down) || (cell_right && !cell_diag && nx) )
			{
				this.position.y =  tileToPixel(ty + 1) - collOffset.y;
				this.velocity.y = 0;
				
				cell = cell_down;
				cell_right = cell_diag;
				
				cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+2);
				cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+2);
				
				ny = 0;
			}
		}
		
		if (this.velocity.x > 0 )//if we're moving right
		{
			if ( (cell_right && !cell) || (cell_diag && !cell_down && ny) )
			{
				this.position.x = tileToPixel(tx) - collOffset.x;
				this.velocity.x = 0;
			}
		}
		else if (this.velocity.x < 0) //if we're moving left
		{
			if ( (cell && !cell_right) || (cell_down && !cell_diag && ny) )
			{
				this.position.x = tileToPixel(tx+1) - collOffset.x;
				this.velocity.x = 0;
			}
		}
	}
	
	for ( var b = 0 ; b < this.bullets.length ; ++b)
	{
		this.bullets[b].update(deltaTime);
		
		if ( this.bullets[b].isDead )
		{
			this.bullets[b] = this.bullets[this.bullets.length-1];
			this.bullets.length -= 1;
		}
	}
}

Player.prototype.draw = function()
{
	if(!this.isDead)
	{
		this.sprite.draw(ctx, this.position.x - worldOffsetX, this.position.y);
		
		for (var b = 0; b < this.bullets.length; b++){
			this.bullets[b].draw();
		}
	
	/*
	ctx.fillStyle = "white";
	ctx.font = "30px Cooper Std Black";
	var textToDisplay = "HP : " + this.health;
	ctx.fillText(textToDisplay, 20, 85);
	*/
	}
}