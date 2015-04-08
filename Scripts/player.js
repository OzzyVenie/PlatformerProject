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

	if(this.position.y <= 0 - (this.height / 2)){
		this.position.y = canvas.height + (this.height / 2);
	}else
	if(this.position.y >= canvas.height + (this.height / 2)){
		this.position.y = 0 - (this.height / 2);
	}else
	if(this.position.x <= 0 - (this.height / 2)){
		this.position.x = canvas.width + (this.height / 2);
	}else
	if(this.position.x >= canvas.width + (this.height / 2)){
		this.position.x = 0 - (this.height / 2);
	}
	
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
	//var nx = (this.position.x)%TILE; // true if player overlaps right
	//var ny = (this.position.y)%TILE; // true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellRight = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var cellDown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cellDiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);


}
Player.prototype.draw = function()
{
	ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.image, -this.width/2, -this.height/2);
	ctx.restore();
}
