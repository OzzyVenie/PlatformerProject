var canvas = document.getElementById("gameCanvas");

var Bullets = function()
{
	this.image = document.createElement("img");
	
	this.x = Player.x;
	this.y = Player.y;
	this.width = 165;
	this.height = 125;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	
	this.rotation = player.rotation;
	
	this.isDead = false;
	
	this.image.src = "bullet.png";
}

Bullets.prototype.update = function(deltaTime)
{

	for (var j = 0; j < bullets.length; ++j)
	{
		if(bullets.isDead === false)
		{
			bullets.x += bullets.velocityX * deltaTime
			bullets.y += bullets.velocityY * deltaTime
			
			context.save();
			context.translate(bullets.x, bullets.y);
			context.rotate(player.rotation);
			context.drawImage(bullets.image, - bullets.image.width/2,
								- bullets.image.height/2);
			
			context.restore();
			
			for(var i = 0; i < enemy.length; i++)
			{
				var bHit = intersects(
								bullets.x - bullets.width / 2, bullets.y - bullets.height / 2,
								bullets.width, bullets.height,
								enemy.x - enemy.width / 2, enemy.y - enemy.height / 2,
								enemy.width, enemy.height);
				
			
				if (bHit === true )
				{
					bullets[j].isDead = true;
					enemy.isDead = true;
				
				}
			}
		}
		else
		{
			bullets.splice(j, 1);
		}
	}

/*
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) )
	{
		;
	}
*/
	
	for (var j = 0; j < bullets.length; ++j)
	{
		if(bullets[j].isDead === false)
		{		
			if(bullets[j].x > canvas.width || bullets[j].x < 0 || bullets[j].y > canvas.height || bullets[j].y < 0)
			{
				bullets[j].isDead = true;
			}
		}
		else
		{
			bullets.splice (j,1);
		}
	}
}