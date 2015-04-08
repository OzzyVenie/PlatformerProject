var canvas = document.getElementById("gameCanvas");

var Player = function()
{
	this.image = document.createElement("img");
	
	this.position = new Vector2();
	this.position.set(canvas.width/2, canvas.height/2);
	
	this.width = 120;
	this.height = 104;
	
	this.offset = new Vector2();
	this.offset.set(-55, -87);
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	
	this.rotation = 0;
	this.shooting = false;

	this.flipPlayer = false;
	
	
	this.image.src = "Images/hero.png";
};


Player.prototype.update = function(deltaTime)
{	
	var acceleration = new Vector2();
	var playerAccel = 5000;
	var playerDrag = 20;
	var playerGrav = TILE * 9.8 * 6;
	
	acceleration.y = playerGrav;
	
	if(keyboard.isKeyDown(keyboard.KEY_W) )
	{
		acceleration.y -= playerAccel;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_S) )
	{
		acceleration.y += playerAccel;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_A) )
	{
		acceleration.x -= playerAccel;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_D) )
	{
		acceleration.x += playerAccel;
	}
	
	//aceleration = acceleration.subtract(this.velocity.multiplyScalar(playerDrag));
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	if(keyboard.isKeyDown(keyboard.KEY_SHIFT) )
	{
		this.shooting = true;
	}
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = this.position.x%TILE; // true if player overlaps right
	var ny = this.position.y%TILE; // true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellRight = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var cellDown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cellDiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	if (this.velocity.y > 0)
	{
		if ( (cellDown && !cell)||(cellDiag && !cellRight && nx) )
		{
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			ny = 0;
		}
	}
	else if ( this.velocity.y < 0)
	{
		if ( (cell && !cellDown) || (cellRight && !cellDiag && nx))
		{
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0;
			
			cell = cellDown;
			cellRight = cellDiag;
			cellDown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+2);
			cellDiag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+2);
			
			ny = 0;
		}
	}
	

	if (this.velocity.x > 0)
	{
		if ( (cellRight && !cell) || (cellDiag && !cellDown && ny) )
		{
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0)
	{
		if ( (cell && !cellRight) || (cellDown && !cellDiag && ny ) )
		{
			this.position.x = tileToPixel(tx+1);
			this.velocity.x = 0;
		}
	}
}
Player.prototype.draw = function()
{
	ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.image, -this.width/2, -this.height/2);
	ctx.restore();
}
