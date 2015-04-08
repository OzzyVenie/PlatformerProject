var canvas = document.getElementById("gameCanvas");

//SET VECTOR X AND Y
var Vector2 = function()
{
	this.x = 0;
	this.y = 0;
};

Vector2.prototype.set = function(x, y)
{
	this.x = x;
	this.y = y;
}

//FIND VECTOR LENGTH
Vector2.prototype.length = function ()
{
	var result = math.sqrt(this.x*this.x + this.y*this.y);
	
	return result;
}

//NORMALIZE THE VECTOR
Vector2.prototype.normalize = function ()
{
	this.x = this.x / len;
	this.y = this.y / len;
}

//ADD VECTORS
Vector2.prototype.add = function (other_vector)
{
	var result = new Vector2();
	
	result.x = this.x + other_vector.x
	result.y = this.y + other_vector.y
	
	return result;
}

//SUBTRACT VECTORS
Vector2.prototype.subtract = function (other_vector)
{
	var result = new Vector2();
	
	result.x = this.x - other_vector.x
	result.y = this.y - other_vector.y
	
	return result;
}

//MULTIPLY SCALAR BY INPUT NUMBER
Vector2.prototype.multiplyScalar = function ( scalar )
{
	var result = new Vector2();
	
	result.x = this.x * scalar;
	result.y = this.y * scalar;
	
	return result;
}
