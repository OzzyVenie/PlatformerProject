var canvas = document.getElementById("gameCanvas");

var Player = function()
{
	this.image = document.createElement("img");
	
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.width = 165;
	this.height = 125;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	
	
	this.image.src = "hero.png";
};


Player.prototype.update = function(deltaTime)
{

	if(this.y <= 0 - (this.height / 2)){
		this.y = canvas.height + (this.height / 2);
	}else
	if(this.y >= canvas.height + (this.height / 2)){
		this.y = 0 - (this.height / 2);
	}else
	if(this.x <= 0 - (this.height / 2)){
		this.x = canvas.width + (this.height / 2);
	}else
	if(this.x >= canvas.width + (this.height / 2)){
		this.x = 0 - (this.height / 2);
	}

	/*
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) )
	{
		this.rotation += deltaTime;
	}
	else
	{
		this.rotation -= deltaTime;
	}
	*/
	
	if(keyboard.isKeyDown(keyboard.KEY_W) )
	{
		this.y -= 5;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_S) )
	{
		this.y += 5;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_A) )
	{
		this.x -= 5;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_D) )
	{
		this.x += 5;
	}

}
Player.prototype.draw = function()
{

	ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.image, -this.width/2, -this.height/2);
	ctx.restore();
}
