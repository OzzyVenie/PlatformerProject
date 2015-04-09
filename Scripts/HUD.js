var HUD = function()
{
	
}

HUD.prototype.draw = function()
{
	context.fillStyle="white";
	
	context.font = "30px Cooper Std Black"
	context.fillText("SCORE : ", 20, 640);
	
	context.font = "30px Cooper Std Black"
	context.fillText("HEALTH : " + "%", 20, 680);
}