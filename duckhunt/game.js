function draw(){	


//	Get the canvas
	var canvas = document.getElementById("game");
	var context = canvas.getContext("2d");
	canvas.width = 800;
	canvas.height = 600;
	
	
//	Load the sprite image
	var img = new Image();
	img.src = 'assets/duckhunt.png';

	
// 	Draw road
	img.onload = function(){

		
		context.fillStyle = "#87CEEB";	//the color of the sky
		context.fillRect(0,0,800,600);	//the skies
		
		context.fillStyle = "#C96A1B";	//the color for the dirt
		context.fillRect(0,500,800,600);	//the road
		
		context.drawImage(img,0,272,73,122,5,50,170,450);	//a tree		
		
		context.drawImage(img,0,700,800,200,0,400,800,200);	//dirt road + bushes
		
		context.drawImage(img,122,0,58,45,160,430,150,120);	//dog
		
		context.drawImage(img,41,155,35,35,185,300,75,75);	//bird1
		context.drawImage(img,168,116,35,35,285,50,75,75);	//bird2
		context.drawImage(img,260,195,35,35,405,400,75,75);	//bird3
		context.drawImage(img,261,153,35,35,485,150,75,75);	//bird4
		context.drawImage(img,77,194,35,35,685,285,75,75);	//bird5
												
		

	}


}