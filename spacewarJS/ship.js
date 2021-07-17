

ray = function( pos, ori, len, mom )
{
    return {type:"ray",
	    pos:pos,
	    mom:mom || coord(0,0),
	    ori:ori,
	    charge:3,
	    len:len,
	    hbox:line(polarToCoord(ori,len)),
	    draw:function(){
		ctx.beginPath();
		ctx.strokeStyle = greyShade(this.len/150);
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(this.pos.x + this.hbox.endpoint.x, this.pos.y + this.hbox.endpoint.y);
		ctx.stroke();
		ctx.closePath();
	    },
	    update:function(frames){
		if(this.charge <= 0) despawn(this);
		this.charge = this.charge - 1;
		this.pos = this.pos.add(this.mom);
	    },
	    react:function(other)
	    {}
	   }
}

//Even 'composite' objects or object clusters must return something to be spawned!
explosion = function( pos )
{
    sndExplode.play();
    spawn( ray(pos, Math.PI * 1/8, 20));
    spawn( ray(pos, Math.PI * 2/8, 20));
    spawn( ray(pos, Math.PI * 3/8, 20));
    spawn( ray(pos, Math.PI * 4/8, 20));
    spawn( ray(pos, Math.PI * 5/8, 20));
    spawn( ray(pos, Math.PI * 6/8, 20));
    spawn( ray(pos, Math.PI * 7/8, 20));
    spawn( ray(pos, Math.PI * 8/8, 20));
    spawn( ray(pos, Math.PI * 9/8, 20));
    spawn( ray(pos, Math.PI * 10/8, 20));
    spawn( ray(pos, Math.PI * 11/8, 20));
    spawn( ray(pos, Math.PI * 12/8, 20));
    spawn( ray(pos, Math.PI * 13/8, 20));
    spawn( ray(pos, Math.PI * 14/8, 20));
    spawn( ray(pos, Math.PI * 15/8, 20));
    return ray(pos, Math.PI * 16/8, 20);            
}

laser = function(owner)
{
    return{
	charge:15,
	on:false,
	trigger:function()
	{
	    if(!this.on)
 {
		if(this.charge >= 5)
		    this.on = true;
	    }
	},
	update:function(){
	    if(this.charge <= 0)
	    {
		this.charge = 0;
		this.on = false;
	    } 

	    if(this.on)
	    {
		if(this.charge % 5 < 1)
		{
		    sndRay.play();
		    spawn(ray(owner.pos.add(polarToCoord(owner.ori, 20)),owner.ori,120,owner.mom));
		}
		this.charge -= 1;
	    }
	    else
	    {
		if(this.charge < 15)
		    this.charge += 0.9;
		else this.charge = 10;
	    }
	    

	}
    };
}

ctrl = function()
{
    if(keys[this.fire])
    {
	this.laser.trigger();
    }
    if(keys[this.lf])
	this.ori += 0.08;
    if(keys[this.rt])
	this.ori -= 0.08;
    if(keys[this.up])
    {
	this.mom = this.mom.add( polarToCoord( this.ori, 0.09 ));
    }    
}

update = function(frames)
{
    if(this.hp <= 0)
    {
	despawn(this)
	spawn(explosion(this.pos));
    }

    while(frames > 0)
    {
	this.ctrl();
	this.translate();
	this.laser.update();
	frames--;
    }

    if(this.pos.x < 0)
	this.pos.x = canvas.width;
    if(this.pos.x > canvas.width)
    	this.pos.x = 0;
    if(this.pos.y < 0)
    	this.pos.y = canvas.height;
    if(this.pos.y > canvas.height)
    	this.pos.y = 0;
}

translate = function()
{
    this.pos = this.pos.add(this.mom);
}

drawShip = function()
{
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.arc(this.pos.x, this.pos.y,12, this.ori + 1, this.ori + Math.PI);
    ctx.arc(this.pos.x,this.pos.y,3,this.ori, this.ori + 2 * Math.PI);
    ctx.arc(this.pos.x,this.pos.y,12, this.ori + Math.PI, this.ori - 1);
    ctx.stroke();
    ctx.closePath();
}



ship = function( pos, ori, up, lf, rt, fire )
{
    var ret = { type:"ship",
		pos:pos,
		mom:coord(0,0),
		ori:ori,
		mct:3,
		hp:100,
		up:up,
		lf:lf,
		rt:rt,
		fire:fire,
		ctrl:ctrl,
		hbox:circle(12),
		update:update,
		translate:translate,
		react:function(other)
		{
		    if(other.type == "ship")
			this.hp -= 10;
		    if(other.type == "ray")
		    {
			this.hp -= other.charge;
			sndExplode.play();
		    }
		},
		draw:drawShip};

    ret.laser = laser(ret);
    return ret;
}
