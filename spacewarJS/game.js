//main game code

//Broken As is
//In process of 'Object-Orienting' the spaceship code to make it general enough to incorporate other objects

var canvas = document.getElementById("game_canvas");
var ctx    = canvas.getContext("2d");
ctx.font = "13px Courier New";
ctx.fillStyle = "white";
nil = undefined;

/*list holds objects for ease and efficiency of insert and filter*/
cons = function(car,cdr)
{
    return {car:car, cdr:cdr}
}

filter = function(ls,pred)
{
    if(ls == nil)
	return nil;
    if(pred(ls.car))
	return filter(ls.cdr, pred);
    return cons(ls.car, filter(ls.cdr, pred));
}

forEach = function(ls,f)
{
    if(ls != nil)
    {	f(ls.car);
	forEach(ls.cdr, f);
    }
}

spawn = function(obj)
{
    objects = cons(obj, objects);
}

despawn = function(obj)
{
    obj.filterThis = true;
}

charToHex = function(ch)
{
    
}

greyShade = function(intensity)
{
    if(intensity <= 1 && intensity >= 0)
    {
	hexVal = charToHex(intensity * 255);
	return '#' + hexVal + hexVal + hexVal;
    }
    return '#FFFFFF';
}

var objects = nil;

spawn(ship(coord(50,250), 0,
	   38, 39, 37, 80 ));
spawn(ship(coord(550,250), Math.PI,
	   87, 68, 65, 86));

var keys = [];

var sndExplode = new sound("hit1.wav");
var sndRay     = new sound("ray.wav");

//add event listeners to detect keyboard input
document.addEventListener('keydown', function(e)
			  {
			      keys[e.keyCode] = true;
			  });

document.addEventListener('keyup', function(e)
			  {
			      keys[e.keyCode] = false;
			  });



redraw = function()
{
    ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillText("P1: Arrows + P, P2: WASD + V", 5, 30);
    forEach(objects,function(obj){obj.draw();})

}


//finds the relative offset and figures out if the hitboxes are overlapping
touching = function(obj1, obj2)
{
    return overlapping(obj1.hbox, 
		       obj2.hbox,
		       obj1.pos.add(obj2.pos.scale(-1)));
}

tickGame = function()
{
    redraw();

    //update all objects
    forEach(objects, function(obj){ obj.update(1); });

    //remove any objects that need to be removed
    objects = filter(objects, function(obj){ return obj.filterThis; });
    
    //test collisions between all objects
    i = nil;
    j = nil;
    for(i = objects; i != nil; i = i.cdr)
    {
    	for(j = i.cdr; j != nil; j = j.cdr)
    	{
    	    if(touching(i.car, j.car))
	    {
    		i.car.react(j.car);
		j.car.react(i.car);
	    }
    	}
    }
}

//initiate main loop 
setInterval(tickGame,1000/40);
