var canvas = document.getElementById("gameCanvas");

var Bullets = function()
{
	this.image = document.createElement("img");
	
	this.x = Player.x;
	this.y = Player.y;
	this.width = 5;
	this.height = 18;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	
	this.rotation = Player.rotation;
	
	this.isDead = false;
	
	this.image.src = "Images/bullet.png";
}

Bullets.prototype.update = function(deltaTime)
{

	for (var j = 0; j < Bullets.length; ++j)
	{
		if(Bullets.isDead === false)
		{
			Bullets.x += Bullets.velocityX * deltaTime
			Bullets.y += Bullets.velocityY * deltaTime
			
			ctx.save();
			ctx.translate(Bullets.x, Bullets.y);
			ctx.rotate(Player.rotation);
			ctx.drawImage(Bullets.image, - Bullets.image.width/2,
								- Bullets.image.height/2);
			
			ctx.restore();
			
			for(var i = 0; i < enemy.length; i++)
			{
				var bHit = intersects(
								Bullets.x - Bullets.width / 2, Bullets.y - Bullets.height / 2,
								Bullets.width, Bullets.height,
								enemy.x - enemy.width / 2, enemy.y - enemy.height / 2,
								enemy.width, enemy.height);
				
			
				if (bHit === true )
				{
					Bullets.isDead = true;
					enemy.isDead = true;
				
				}
			}
		}
		else
		{
			Bullets.splice(j, 1);
		}
	}

/*
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) )
	{
		;
	}
*/
	
	for (var j = 0; j < Bullets.length; ++j)
	{
		if(Bullets[j].isDead === false)
		{		
			if(Bullets[j].x > canvas.width || Bullets[j].x < 0 || Bullets[j].y > canvas.height || Bullets[j].y < 0)
			{
				Bullets[j].isDead = true;
			}
		}
		else
		{
			Bullets.splice (j,1);
		}
	}
}

Bullets.prototype.draw = function()
{

	ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(Player.rotation);
		ctx.drawImage(this.image, -this.width/2, -this.height/2);
	ctx.restore();
}