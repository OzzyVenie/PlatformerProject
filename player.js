var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var Player = function()
{
	this.image = document.createElement("img");
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.width = 159;
	this.height = 163;
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;
	this.image.src = "hero.png";
};


Player.prototype.update = function(deltaTime)
{
	if( typeof(this.rotation) == "undefined" )
	this.rotation = 0; // hang on, where did this variable come from!
	this.rotation += deltaTime;
}
Player.prototype.draw = function()
{
	ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.image, -this.width/2, -this.height/2);
	ctx.restore();
}
