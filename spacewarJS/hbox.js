//hbox.js

//hitboxes are centered on the position of the object that owns them
//in other terms, every hbox is incomplete, you need to know the position
//of it's owning object to complete them. 

overlapping = function(hbox1, hbox2, offset)
{
    if(hbox1.type == "circle" && hbox2.type == "circle")
	return hbox1.radius + hbox2.radius > magnitude(offset);
    if(hbox1.type == "circle" && hbox2.type == "line")
    {
	//first, think of the line as the diameter of a circle to test if the two can touch at all
	if(magnitude(offset.add(hbox2.endpoint.scale(-(1.0/2.0)))) > magnitude(hbox2.endpoint.scale(1/2)) + hbox1.radius)
	    return false; 
	//     return false;
	
	//then, see if the circle overlaps one of the end points of the line
	// if(magnitude(offset) < hbox1.radius)
	//     return true;

	//far endpoint
	// if(magnitude(offset = hbox2.endpoint) < hbox1.radius)
	//     return true;


	//if it's within the larger circle but doesn't touch either end point, use the law of sines to determine
	//if a line perpendicular to the segment connecting the circle to the segment is shorter than the radius
	var b = Math.abs(Math.atan(slope(offset)) - Math.atan(slope(hbox2.endpoint)));
	var perplength = Math.sin(b) * magnitude(offset);
	return perplength < hbox1.radius;
    }

    if(hbox1.type == "line" && hbox2.type == "circle")
	return overlapping(hbox2, hbox1, offset.scale(-1));
}

circle = function(radius)
{
    return {type:"circle",
	    radius:radius};
}

line = function(endpoint)
{
    return {type:"line",
	    endpoint:endpoint};
}
