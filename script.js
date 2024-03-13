var container = document.getElementById("container");
var world = document.getElementById('world');

var map = [
//	 xPos, yPos, zPos, xRot, yRot, zRot, Width, Height
// floor
	[0, 100 ,0, 90, 0, 0, 2000, 2000, "grey"],
//walls
	[0, 0 ,-1000, 0, 0, 0, 2000, 200, "orange"],
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
}

var me = new mySelf(0,0,0,0,0,0);

var fwd = 0;
var bcwd = 0; 
var lft = 0;
var rght = 0;
var mouseX = 0;
var mouseY = 0;
var dx = dy = dz = 0;

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
}

document.addEventListener("keydown", (event) => {this.move(event, 5)});
document.addEventListener("keyup", (event) => {this.move(event, 0)});
document.addEventListener("mousemove", (event)=>{
	mouseX = event.movementX;
	mouseY = event.movementY;
	console.log(mouseX, mouseY);
});




function drawWorld(){
	//let dz = fwd - bcwd;
	//let dx = lft - rght;
    dz = fwd - bcwd;
	dx = lft - rght;

	dry = -mouseX;

	mouseX = mouseY = 0;

	me.xPos += dx;
	me.zPos += dz;

	me.yRot += dry;

	//world.style.transform = `translate3d(
     world.style.transform = `
		    translateZ(600px) 
		
		    rotateX(${
			         me.xRot

		    }deg)
		    rotateY(${
			        -me.yRot

		    }deg) 
		    rotateZ(${
			         me.zRot

		    }deg)

	    	translate3d(
	    	${
			         me.xPos
		    }px, 
	    	${

			         me.yPos
		    }px, 
		    ${
			         me.zPos
		    }px) 
        
	        `;
}

game = setInterval(drawWorld, 10);