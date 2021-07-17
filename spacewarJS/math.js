

coord = function(x,y)
{
    return {x:x,
	    y:y,
	    add:function(other){return coord(this.x + other.x, this.y + other.y);},
	    scale:function(scalar){return coord(this.x * scalar, this.y * scalar);}
	   };
}

magnitude = function(vec){return Math.sqrt(vec.x * vec.x + vec.y * vec.y);};

polarToCoord = function(theta, len)
{
    return coord(Math.cos(theta) * len, Math.sin(theta) * len);
}

slope = function(vec)
{
    return vec.y/vec.x;
}
