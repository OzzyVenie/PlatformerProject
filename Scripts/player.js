

var Player = function()
{
	this.image = document.createElement("img");
	
	this.position = new Vector2();
	this.position.set(100, 500);
	
	this.velocity = new Vector2();
	
	this.width = 152;
	this.height = 136;
	this.jumping = false;
	this.falling = false;
	
	this.flipPlayer = false;
	
	this.angularVelocity = 0;
	this.rotation = 0;
	this.image.src = "Images/Lunk.png";
};

Player.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var playerAccel = 6000;
	var playerDrag = 12;
	var playerGravity = TILE * 9.8 * 6;
	var jumpForce = 50000;
	
	acceleration.y = playerGravity;
	
	if ( keyboard.isKeyDown(keyboard.KEY_A) )
	{
		acceleration.x -= playerAccel;
		this.flipPlayer = false;
	}
	if ( keyboard.isKeyDown(keyboard.KEY_D) )
	{
		acceleration.x += playerAccel;
		this.flipPlayer = true;
	}
	
	if ( this.velocity.y > 0 )
	{
		this.falling = true;
	}
	else
	{
		this.falling = false;
	}
	
	if ( keyboard.isKeyDown(keyboard.KEY_SPACE) && !this.jumping && !this.falling )
	{
		acceleration.y -= jumpForce;
		this.jumping = true;
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
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);
	
	//ACTUAL COLLISION!
	if ( this.velocity.y > 0 ) //if moving down
	{
		if ( (cell_down && !cell) || (cell_diag && !cell_right && nx) )
		{
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			ny = 0;
			this.jumping = false;
		}
	}
	else if (this.velocity.y < 0 ) //if moving up
	{
		if ( (cell && !cell_down) || (cell_right && !cell_diag && nx) )
		{
			this.position.y =  tileToPixel(ty + 1);
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
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0) //if we're moving left
	{
		if ( (cell && !cell_right) || (cell_down && !cell_diag && ny) )
		{
			this.position.x = tileToPixel(tx+1);
			this.velocity.x = 0;
		}
	}
}

Player.prototype.draw = function(){
	if(this.flipPlayer == true){
		ctx.save();
			ctx.translate(this.width, 0);
			ctx.translate(this.position.x, this.position.y);
			ctx.scale(-1, 1);
			ctx.drawImage(this.image, +this.width/2, -this.height + TILE);
		ctx.restore();
	}else{
		ctx.save();
			ctx.translate(this.position.x, this.position.y);
			ctx.rotate(this.rotation);
			ctx.drawImage(this.image, -this.width/2 + TILE, -this.height + TILE);
		ctx.restore();
	}
}