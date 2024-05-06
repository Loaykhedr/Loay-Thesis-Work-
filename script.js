var container = document.getElementById("container");
var world = document.getElementById('world');

var map = [
//	 xPos, yPos, zPos, xRot, yRot, zRot, Width, Height
// floor
	[0, 100 ,0, 90, 0, 0, 2000, 2000, "url('IMG/floor.jpg')"],
//wall1
	[0, 0 ,-1000, 0, 0, 0, 2000, 200, "orange"],
//wall2
    [0, 0 ,1000, 0, 0, 0, 2000, 200, "orange"],
//right wall 
	[1000, 0 ,0, 0, 90, 0, 2000, 200, "yellow"],
//left wall 
	[-1000, 0 ,0, 0, -90, 0, 2000, 200, "green"]
];

function createMap(){
	for(let i = 0; i < map.length; i++){
		let newElement = document.createElement("div");
		newElement.id = "figure1";
		newElement.className = "myFigures";
		newElement.style.width =`${map[i][6]}px`;
		newElement.style.height = `${map[i][7]}px`;
		newElement.style.background = map[i][8];
		newElement.style.opacity = 0.5;
		newElement.style.transform = `translate3d(
		${
			parseInt(getComputedStyle(world).width,10)/2 - map[i][6]/2 + map[i][0]
		}px, 
		${
			parseInt(getComputedStyle(world).height,10)/2 - map[i][7]/2 + map[i][1]
		}px, 
		${
			map[i][2]
		}px) 
		rotateX(${map[i][3]}deg) 
		rotateY(${map[i][4]}deg) 
		rotateZ(${map[i][5]}deg)`;
		world.append(newElement);
	}
}

createMap();

function mySelf(xPos, yPos, zPos, xRot, yRot, zRot){
	this.xPos = xPos;
	this.yPos = yPos;
	this.zPos = zPos;
	this.xRot = xRot;
	this.yRot = yRot;
	this.zRot = zRot;
	this.vX = 3;
	this.vY = 5;
	this.vZ = 3;
}

var me = new mySelf(0,0,0,0,0,0);

var deg = Math.PI/180;
var lock = false;
var canlock = true; 

var fwd = 0;
var bcwd = 0; 
var lft = 0;
var rght = 0;
var mouseX = 0;
var mouseY = 0;
var dx = dy = dz = 0;
var g = 0.1;
var onGround = false;
var PressUp = 0;

function move(ev, vel){
	if(ev.keyCode == 87){
		fwd = vel;
	}
	if(ev.keyCode == 83){
		bcwd = vel;
	}
	if(ev.keyCode == 65){
		lft = vel;
	}
	if(ev.keyCode == 68){
		rght = vel;
	}
	if(ev.keyCode == 32){
		PressUp = vel;
	}
}

document.addEventListener("keydown", (event) => {this.move(event, 5)});
document.addEventListener("keyup", (event) => {this.move(event, 0)});
document.addEventListener("mousemove", (event)=>{
	mouseX = event.movementX;
	mouseY = event.movementY;
});

document.addEventListener("pointerlockchange", (event)=>{
	lock = !lock;
});

container.onclick = function(){
	if (!lock && canlock) container.requestPointerLock();
};




function drawWorld(){
	
    //dz = fwd - bcwd;
	//dx = lft - rght;
    //dx = xx * COS - yy * SIN

    dx = (rght - lft) * Math.cos(me.yRot*deg) - (fwd - bcwd) * Math.sin(me.yRot*deg);
	dz = - (rght - lft) * Math.sin(me.yRot*deg) - (fwd - bcwd) * Math.cos(me.yRot*deg);

	dy = dy + g;
	console.log (onGround);
	console.log(dy); 
	if (onGround){
		dy = 0;
		if (PressUp){
			dy = - PressUp*me.vY;
			onGround = false;
		}
	};

	dry = -mouseX;
	drx =  mouseY;

	mouseX = mouseY = 0;

	collision();
	
	me.xPos += dx;
	me.zPos += dz;

	if (lock) {
        me.yRot += dry;
		me.xRot += drx;
		
		if (me.xRot < -35){
			me.xRot = -35
		}
		if (me.xRot > 35){
			me.xRot = 35
		}

    };

	//world.style.transform = `translate3d(
     world.style.transform = `
		    translateZ(600px) 
		
		    rotateX(${
			        -me.xRot

		    }deg)
		    rotateY(${
			        -me.yRot

		    }deg) 
		    rotateZ(${
			         me.zRot

		    }deg)

	    	translate3d(
	    	${
			         -me.xPos
		    }px, 
	    	${

			         -me.yPos
		    }px, 
		    ${
			         -me.zPos
		    }px) 
        
	        `;
}

game = setInterval(drawWorld, 10);

function collision(){
  
	onGround = false;
	
	for(let i = 0; i < map.length; i++){
	  
	  
	  let x0 = (me.xPos - map[i][0]);
	  let y0 = (me.yPos - map[i][1]);
	  let z0 = (me.zPos - map[i][2]);
	  
	  if ((x0**2 + y0**2 + z0**2 + dx**2 + dy**2 + dz**2) < (map[i][6]**2 + map[i][7]**2)){
	  
		let x1 = x0 + dx;
		let y1 = y0 + dy;
		let z1 = z0 + dz;
	  
		let point0 = coorTransform(x0,y0,z0,map[i][3],map[i][4],map[i][5]);
		let point1 = coorTransform(x1,y1,z1,map[i][3],map[i][4],map[i][5]);
		let normal = coorReTransform(0,0,1,map[i][3],map[i][4],map[i][5]);
	  
	  
		if (Math.abs(point1[0])<(map[i][6]+90)/2 && Math.abs(point1[1])<(map[i][7]+90)/2 && Math.abs(point1[2]) < 50){
		  point1[2] = Math.sign(point0[2])*50;
		  let point2 = coorReTransform(point1[0],point1[1],point1[2],map[i][3],map[i][4],map[i][5]);
		  let point3 = coorReTransform(point1[0],point1[1],0,map[i][3],map[i][4],map[i][5]);
		  dx = point2[0] - x0;
		  dy = point2[1] - y0;
		  dz = point2[2] - z0;
		  if (Math.abs(normal[1]) > 0.8){
			if (point3[1] > point2[1]) onGround = true;
		  }
		  else dy = y1 - y0;
		}
		
	  }
	};
  }

  function coorTransform(x0,y0,z0,rxc,ryc,rzc){
	let x1 =  x0;
	let y1 =  y0*Math.cos(rxc*deg) + z0*Math.sin(rxc*deg);
	let z1 = -y0*Math.sin(rxc*deg) + z0*Math.cos(rxc*deg);
	let x2 =  x1*Math.cos(ryc*deg) - z1*Math.sin(ryc*deg);
	let y2 =  y1;
	let z2 =  x1*Math.sin(ryc*deg) + z1*Math.cos(ryc*deg);
	let x3 =  x2*Math.cos(rzc*deg) + y2*Math.sin(rzc*deg);
	 let y3 = -x2*Math.sin(rzc*deg) + y2*Math.cos(rzc*deg);
	let z3 =  z2;
	return [x3,y3,z3];
  }

  function coorReTransform(x3,y3,z3,rxc,ryc,rzc){
	let x2 =  x3*Math.cos(rzc*deg) - y3*Math.sin(rzc*deg);
	let y2 =  x3*Math.sin(rzc*deg) + y3*Math.cos(rzc*deg);
	let z2 =  z3
	let x1 =  x2*Math.cos(ryc*deg) + z2*Math.sin(ryc*deg);
	let y1 =  y2;
	let z1 = -x2*Math.sin(ryc*deg) + z2*Math.cos(ryc*deg);
	let x0 =  x1;
	let y0 =  y1*Math.cos(rxc*deg) - z1*Math.sin(rxc*deg);
	let z0 =  y1*Math.sin(rxc*deg) + z1*Math.cos(rxc*deg);
	return [x0,y0,z0];
  };