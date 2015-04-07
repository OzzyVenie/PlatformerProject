var Enemy = function()
{
	this.image = document.createElement("img");
	
	this.x = 0;
	this.y = 0;
	this.width = 200;
	this.height = 130;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "enemy.png";
};


Enemy.prototype.update = function(deltaTime)
{

	/*
	if(this.y <= 0 - (this.height / 2))
	{
		this.y = canvas.height + (this.height / 2);
	}else
	if(this.y >= canvas.height + (this.height / 2))
	{
		this.y = 0 - (this.height / 2);
	}else
	if(this.x <= 0 - (this.height / 2))
	{
		this.x = canvas.width + (this.height / 2);
	}else
	if(this.x >= canvas.width + (this.height / 2))
	{
		this.x = 0 - (this.height / 2);
		
	*/
	
	if(keyboard.isKeyDown(keyboard.KEY_UP) )
	{
		this.y -= 5;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_DOWN) )
	{
		this.y += 5;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) )
	{
		this.x -= 5;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_RIGHT) )
	{
		this.x += 5;
	}
}

Enemy.prototype.draw = function()
{

	ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.image, -this.width/2, -this.height/2);
	ctx.restore();
}