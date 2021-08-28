// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/RUSvMxxm_Jo

//Giphy
var api = "https://api.giphy.com/v1/stickers/search?";
var apiKey = "&api_key=dc6zaTOxFJmzC";
var query = "&q=unicorn";
var url = api + apiKey + query;
let gifMenu = 0;
var blinkFirst = 1;
var counter = 0;
var trimmed;
var imgCreated = 0;
var userKey = "CE";
var letters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
var d;
var inTxt;
var textA;
var drawings;
var myMap = new Map();
var leftMargin = 1/4;
var cueHeight = 1/16;
var rightDiv;
var rightText;
var osb;
var started = 0;
let slider;
let drawn = 0;


var inp1;
var inpt;
var gifButton;
var saveButton;
// let modeButton
var cl1;
var database;
let v = 1.0 / 9.0;


var drawing = [];
var currentPath = [];
var isDrawing = false;
var toDraw = 1;
let img;
let preImg;
let fltImg;
let c;
let bool = 0;
let searchTxt;
let sendSearch;
let mode = 'draw'
// let mode = 'text'
let textBox
let alice;

function preload() {
    img = loadImage('assets/images/brick2.jpeg');
    preImg = loadImage('assets/images/prev.jpg');
    
    myFont = loadFont("assets/OpenSans.ttf");
     //level = loadImage("assets/images/level.png");
    if (localStorage.uKey != "") 
    alice = createImg("assets/images/alice.gif");

}

function setup() {
    if (windowWidth / windowHeight >= 16 / 9)
        canvas = createCanvas(windowHeight*16/9, windowHeight);

    else
        canvas = createCanvas(windowWidth, windowWidth*9/16);

    canvas.parent('canvascontainer');

    if (windowWidth > windowHeight)
        canvas.position((windowWidth-width)/2, 0);

    else {
        canvas.position(0, (windowHeight - height) / 2);
    }

    img.resize(width, height);
    //preImg.resize(width,height);


  
    image(img,0,0,width, height,img.width/5,img.height,3*img.width/5,img.height);

    //inTxt = select("#txt");
    //inTxt.position(100,200);

    slider = createSlider(0, 255, 100);
    slider.position(leftMargin*width/2-slider.width/3+ (windowWidth-width)/2, height/2);
    slider.style('width', '80px');
    slider.hide();
    slider.style("color","#dc00dc");



    loading = createP("Estamos cargando el muro de tu amig@...Esto debería demorar, a lo más, uno o dos minutos. Paciencia! ");
    loading.style("font-size","3vw");
    loading.style("color","white");
    
  
    
    if (localStorage.uKey != "" && localStorage.uKey != undefined)
      alice.position((width - alice.width)/2,(height-alice.height)/2);

    searchTxt = createInput('');
    searchTxt.hide();
    sendSearch = createButton("Buscar");
    sendSearch.hide();
    sendSearch.mousePressed(sendQuery);

    //inpt = createElement("textarea", "");
    var ht = windowHeight;
    inp1 = createColorPicker('#ed225d');

    inp1.style("height", "50");
    inp1.style("width", "50");
    inp1.position(leftMargin*width/2-inp1.width/2+ (windowWidth-width)/2, height/2 - height/50 - inp1.height);
    inp1.style("border-color","#0000dc");


    inp1.style("border-width","0.1px");
    inp1.hide();
    //inpt.style("line-height", "4ch");
    //inpt.style("background-image", "linear-gradient(transparent, transparent calc(4ch - 1px), #E7EFF8 0px)");
    //inpt.style("background","transparent");
    //inpt.style("background-image","url('assets/images/patch.png')");

    //inpt.style("background-repeat","repeat-x");
    //inpt.style("background-size","auto 100%");
    //inpt.style("color","black");
    //min-height:50px;margin-top:-40px;padding-bottom:40px");
    //inpt.style("background-size","100% 4ch");
    // inpt.style("width", width);
    // inpt.style("height", "50px");
    // inpt.style("font-size", "20px");
    // if (windowWidth > windowHeight)
    // inpt.position(0,height - 50);

    // else
    // inpt.position(0,(windowHeight-height)/2+height - 50);


    //cursor('assets/images/curs.png');

    textButton = select('#textButton');
    textButton.style("z-index", "1000");
    textButton.style("height", "50");
    textButton.style("width", "50");
    textButton.position((windowWidth-width)/2+leftMargin*width/2-textButton.width/2, height/2 + height/20 );
    textButton.style("border-color","#0000dc");
    textButton.style("border-width","0.1px");
     textButton.style("color","#0000dc");
     textButton.style("background-color","#d2d2d2");
    textButton.hide();

    saveButton = select('#saveButton');
    saveButton.mousePressed(saveDrawing);
    saveButton.style("width","100");
    saveButton.position((windowWidth-width)/2+leftMargin*width/2-saveButton.width/2, height/2 + height/7 + textButton.height);
    saveButton.style("z-index", "1000");
    saveButton.style("border-color","#0000dc");
    saveButton.style("color","#0000dc");
    saveButton.style("border-width","0.1px");
    saveButton.style("background-color","#d2d2d2");

    saveButton.hide();


    rightDiv = select("#rightDiv");
    rightDiv.position(3*width/4 + (windowWidth-width)/2,0);
    
    rightDiv.style("width",width/4);
    rightDiv.style("height",height);
    rightDiv.style("border-color","#0000dc");
    rightDiv.style("border-style","solid");
    
    rightDiv.mousePressed(showDiv);
    //rightDiv.style("background-color","#04040444");
    rightDiv.style("background-color","#f2f2f2");
    rightDiv.hide();

    //rightDiv.mouseMoved(showDiv);
    //rightDiv.mouseOut(hideDiv);

    rightText = select("#rightText");
    //rightText.hide();


    leftDiv = select("#leftDiv");
    leftDiv.position((windowWidth-width)/2,0);
    leftDiv.style("width",width*leftMargin);
    leftDiv.style("height",height);
    leftDiv.style("background-color","#f2f2f2");
    leftDiv.style("border-color","#0000dc");
    leftDiv.style("border-style","solid");
    
    leftDiv.hide();

    greyDiv = select("#greyDiv");
    greyDiv.position(0,0);
    greyDiv.style("width",JSON.stringify((windowWidth-width)/2));
    greyDiv.style("height",height);
    greyDiv.style("background-color","rgb(120,120,120)");
    greyDiv.hide();


    ctrlDiv = select("#ctrlDiv");
    ctrlDiv.style("width",JSON.stringify(floor(width*leftMargin/2)));
    ctrlDiv.style("height",JSON.stringify((height-cueHeight*height)/2));
    ctrlDiv.position((windowWidth-width)/2+leftMargin*width/2-ctrlDiv.width/2,height/2 - height/20 - inp1.height );
    ctrlDiv.style("background-color","#transparent");
    ctrlDiv.style("border-color","#0000dc");
    ctrlDiv.style("border-radius","25px");
    ctrlDiv.hide();

    if (localStorage.uKey == "" || localStorage.uKey == undefined)
        drawPrevious()

    else {
        if (localStorage.uKey[0] != "C" || localStorage.uKey[1] != "E" || localStorage.uKey.length != 11){
            alert("Código incorrecto. El código debe comenzar con 'CE' y después contiene 9 números")
            window.location.href = "index.html";
        }
    
    

    }

    



    //NOT USED FOR NOW
    /*gifButton = select('#gifButton');
    gifButton.mousePressed(openGif);
    gifButton.style("z-index", "1000");
    gifButton.style("height", "50");
    gifButton.style("width", "50");
    gifButton.hide();
    

    gifButton.position(inp1.width , height - gifButton.height);

    */

   
    // Setup text/draw button, that calls changeMode on click
    // modeButton = createButton('Text')
    // modeButton.style("z-index", "1000");
    // modeButton.style("height", "50");
    // modeButton.style("width", "50");
    // modeButton.position(500, 500);

    /*firebaseConfig = {
       apiKey: "AIzaSyBo4BBv2muAE4Y-yvJ90SYmn5fdwy5L84k",
       authDomain: "nueva-constitucion.firebaseapp.com",
       databaseURL: "https://nueva-constitucion-default-rtdb.firebaseio.com",
       projectId: "nueva-constitucion",
       storageBucket: "nueva-constitucion.appspot.com",
       messagingSenderId: "197438903025",
       appId: "1:197438903025:web:f7bb1385df1724038c0f50",
       measurementId: "G-VNK3XJS5Z5"
     };
     // Initialize Firebase
     firebase.initializeApp(firebaseConfig);
     database = firebase.database();
     storageRef = firebase.storage().ref(); 
   
     var params = getURLParams();
     console.log(params);
     if (params.id) {
       console.log(params.id);
       showDrawing(params.id);
     }
   
     ref = database.ref('drawings');
     ref.on('value', gotData, errData);
   
   */


}

function draw() {

    stroke(0);


    let xx = select("#iTxt");
if (xx != undefined){
    xx.position(100,100);

}


    cursor('assets/images/Spray1.cur');
    //background(img);


    //If user key is incorrect, user can't save
    if (localStorage.uKey == undefined) {
        saveButton.hide();
    }

    //if the image was loead from storage, then put it in the canvas
    if (imgRef != null && imgCreated == 0) {
        loadDrawing();
    }

    drawDrip()

    //blurred rectangle at the left
    //image(c,0,0);
    //blurred rect at right
    if (d != undefined)
        image(d, 2 * width / 3 + width / 20, 0, width / 3, height);

    /*if (gifMenu){
    push();
    stroke(0);
    fill(255);
    var gifDiv = createDiv();
    gifDiv.position(0,0);
    gifDiv.id("gif");
    gifDiv.style("width","30");
    gifDiv.style("height","30");
    gifDiv.style("background-color","black");
    gifDiv.style("z-index","3000");
    gifDiv.parent("#canvascontainer");
    searchTxt.parent("#gif");
  
    gifMenu=0;
  
    //rect(0,0,width/3,height);
    pop();
    }
    */

    //TO ADD: INITIAL BLINK
    /*
    if (blinkFirst < 4 && counter < 50) {
    push();
    strokeWeight(2);
    textSize(32);
    textFont('Arial');
    text("Muro de Claudia",width/10,height/2);
    drawingContext.setLineDash([5, 15]);
    strokeWeight(5);
    fill(255,0,0,0);
    rect(0,0,width/3,height);  
    pop();
    if (counter == 0)
    blinkFirst++;
    }
  
    if (blinkFirst >= 4 && blinkFirst < 8 && counter < 50) {
    push();
    strokeWeight(2);
    textSize(32);
    textFont('Arial');
    text("Tu Muro",width/3 + width/10,height/2);
    drawingContext.setLineDash([5, 15]);
    strokeWeight(5);
    fill(100,0,255,0);
    rect(width/3-width/20,0,width - 2 * (width/3-width/20),height);  
    pop();
    if (counter == 0)
    blinkFirst++;
    }
  
    if (blinkFirst >= 8 && blinkFirst < 12 && counter < 50) {
    push();
    strokeWeight(2);
    textSize(32);
    textFont('Arial');
    text("Muro de tu invitad@",(width - (width/3-width/20)),height/2);
    drawingContext.setLineDash([5, 15]);
    strokeWeight(5);
    fill(0,0,255,0);
    rect(width - (width/3),0,width/3,height);  
    pop();
    if (counter == 0)
    blinkFirst++;
    }
  
    counter++;
    if (counter == 100)
    counter = 0;
  */
}

// Change UI state draw/text
function changeMode(){
    if(mode == 'text'){
        mode = 'draw'
    }
    else if(mode == 'draw'){
        mode = 'text'
        drawText()
    }
}

// Events to catch drawing gesture
function mousePressed(){
    if((started && mouseX > width*leftMargin && mouseX < 3*width/4) && mouseY < height && movingTxt == 0) startPath()

}

function mouseDragged(){
  
        if (isDrawing && (mouseX > width*leftMargin && mouseX < 3*width/4) && mouseY < height) {
            addPoint();
        }
    
  
    
}

function mouseReleased(){
    if(mode == 'draw') endPath()
}

function startPath() {
    
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}

function endPath() {
    isDrawing = false;
}

function addPoint() {
    colorMode(RGB, 1, 1, 1, 1);
    var col = color(inp1.color()._array[0], inp1.color()._array[1], inp1.color()._array[2], 0.8);
    cl1 = col;
    var drip = random(5);
    var dmax = 0;
    var point = {
        x: mouseX/width,  //NORMALIZED
        y: mouseY/height,   //NORMALIZED
        z: col,
        dr: (slider.value()/250)*drip/height,
        dm: dmax/height,
        s: slider.value()/50 + 0.2
    };
    currentPath.push(point);
    drawLastPoint()
}

// draws last point added to the shape, to be called by addPoint()
function drawLastPoint(){
    strokeWeight(4)
    noFill()

    const path = drawing[drawing.length - 1]

    if(path.length >= 2){
        // describe the last two points of the shape, to be drawn 
        const p1 = path[path.length - 2]
        const p2 = path[path.length - 1]
        stroke(p1.z)
        strokeWeight(p1.s)
        line(p1.x*width, p1.y*height, p2.x*width, p2.y*height)
    }
}

// draws drip. this function is called from draw()
function drawDrip(){
    strokeWeight(4)
    noFill()
    if(drawing.length >= 1) {
        drawing.forEach(path => {
            path.forEach(point => {
                if(point.dm * height < point.dr * height){
                    point.dm += .1/height
                    strokeWeight(point.s)
                    stroke(point.z)
                    line(point.x*width, point.y*height, point.x*width, point.y*height + point.dm* height)
                }
            })
        })
    }
}

// NOT USED: resets the current drawing and canvas, including drip. this function is called when other events happen, like dragging a textbox
function resetDrawToCurrent(){
    background(img)

    strokeWeight(4)
    noFill()

    if(drawing.length >= 1) {
        drawing.forEach(path => {
            if(path.length > 1){
                stroke(path[0].z)
                strokeWeight(path[0].s)
                for(let i = 0; i < path.length - 1; i++){
                    line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y)
                    line(path[i].x, path[i].y, path[i].x, path[i].y + path[i].dm)
                }
            }
        })
    }
}

//NOT USED
function drawText(){
    strokeWeight(2)
    stroke(0)
    rect(textBox.pos.x, textBox.pos.y, textBox.w, textBox.h)
    textSize(textBox.size)
    text(textBox.text, textBox.pos.x, textBox.pos.y, textBox.w, textBox.h)
}

function loadDrawing() {


    //c = preImg.get(preImg.width/3,0,preImg.width/3-width/20,preImg.height);
    //d = get(2 * width / 3, 0, width / 3, height);
    //c.resize(width/3-width/20,height);
    //d.resize(width / 3, height);
    //c.filter(BLUR,15);
    //d.filter(BLUR, 15);
    console.log(imgRef.src);
    imgCreated = 1;
    //Creates two images from the previous participant: 
    //imgBlurred will take the central rectandle, blur it and put it in the left side of the screen
    //imgVisible will take the central rectandle, and put it in the left side of the screen
    
    /*let imgVisible = createImg(imgRef.src);
    let imgBlurred = createImg(imgRef.src);

    imgVisible.parent("#canvascontainer");
    imgVisible.style("width", width);
    imgVisible.style("height", height);
    imgVisible.style("clip-path", "inset(0% 30% 0% 30%)");
    imgVisible.position(-width / 3, 0);

    imgCreated = 1;
    imgBlurred.parent("#canvascontainer");
    imgBlurred.style("width", width);
    imgBlurred.style("height", height);
    imgBlurred.style("filter", "blur(20px)");
    imgBlurred.style("clip-path", "inset(0% 42% 0% 30%)");
    imgBlurred.position(-width / 3, 0);
    */

}

//Saves userName and key to database and then saves canvas with the name "(userKey).jpg" in storageRef/images/
function saveDrawing() {

	//Create json with textarea info: x,y, width, height and text input
	var jsonTxt = {};
	textA = document.getElementsByClassName("text");
	var i;
	for (i = 0; i < textA.length; i++) {
		jsonTxt[i]={};
		jsonTxt[i].x = (textA[i].getBoundingClientRect().x - (windowWidth - width)/2)  / width;
		jsonTxt[i].y = textA[i].getBoundingClientRect().y / height;
		jsonTxt[i].w = textA[i].getBoundingClientRect().width / width;
		jsonTxt[i].h = textA[i].getBoundingClientRect().height /height;
		jsonTxt[i].text = textA[i].value;

	}

    //Create a random 9 char key
    for (let i = 0; i < 9; i++) {
        userKey = userKey + random(letters);
    }

    console.log(userKey);
    var userName = localStorage.uName;
    var parent = localStorage.uKey;
    var ref = database.ref('drawings');
    var data = {
        name: userName,
        userKey: userKey,
        parent: parent,
        drawing: drawing,
        text: jsonTxt
    };

    localStorage.removeItem("uKey");
    localStorage.removeItem("uName");
    localStorage.setItem("finalKey",userKey);
    var result = ref.push(data, dataSent);
    console.log(result.key);


    background(23);
    console.log("qq");
   
    saveButton.hide();
 
    leftDiv.hide();
    ctrlDiv.hide();
    rightDiv.hide();
    textButton.hide();
    inp1.hide();
    slider.hide();
    var areas = document.getElementsByTagName('textarea');
    for (var i = 0; i < areas.length; i++) {
   
    areas[i].style.display = "none";
    

}
    loading2 = createP("Estamos enviando tu muro...espera unos segundos...");
    
    loading2.style("width",JSON.stringify(floor(width/2)));
    loading2.position((windowWidth-width)/2 + width/2 - loading2.width/2,0);
    loading2.style("font-size","3vw");
    loading2.style("color","grey");

    function dataSent(err, status) {
        console.log(status);
        loading2.style.display = "none";
        alert("Gracias por aportar!! El código de tu dibujo es: " + userKey + ". COPIALO y envíaselo a tus amigos para que continúen tu muro.")
        window.location.href = "post-experience.html";
    }

    /*var storageRef = firebase.storage().ref();
    var childRef = storageRef.child("/images/" + userKey + ".jpg");

    var canvas0 = document.getElementById('defaultCanvas0');

    canvas0.toBlob(function (blob) {
        // use the Blob or File API
        childRef.put(blob).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
        });

    });*/

    localStorage.setItem('childKey', userKey);

    
    
 

}

function gotData(data) {

    if (userKey)
    // clear the listing
    var elts = selectAll('.listing');
    for (var i = 0; i < elts.length; i++) {
        elts[i].remove();
    }

    if (drawn == 0)
    drawings = data.val();


    var keys = Object.keys(drawings);
    for (var i = 0; i < keys.length; i++) {
        myMap.set(drawings[keys[i]].userKey,keys[i]);
        //console.log(key);
        /*var li = createElement('li', '');
        li.class('listing');
        var ahref = createA('#', key);
        ahref.mousePressed(showDrawing);
        ahref.parent(li);
    
        var perma = createA('?id=' + key, 'permalink');
        perma.parent(li);
        perma.style('padding', '4px');
    
        li.parent('drawinglist');*/
    }

   
   if (localStorage.uKey != "" && localStorage.uKey != undefined && drawn == 0){
   drawPrevious();
   drawn = 1;
}



}

function errData(err) {
    console.log(err);
}

function showDiv(){
     //rightDiv.style("background-color","#04040444");
     rightText.show();

}


function drawPrevious() {
  background(img);
  saveButton.show();
  textButton.show();
  inp1.show();
  leftDiv.show();
  ctrlDiv.show();
  slider.show();
  //to-do: include this level image beneath slider
  //image(level,leftMargin*width/2-slider.width/3+ (windowWidth-width)/2, height/2,leftMargin*width/2,height/100);
  if (localStorage.uKey != "") 
  alice.hide();

  loading.hide();
  rightDiv.show();
  started = 1;
  greyDiv.show();

//change for drawings[myMap.get(localStrage.uKey)].drawing

if (localStorage.uKey != "" && localStorage.uKey != undefined){
    colorMode(RGB, 1, 1, 1, 1);
    var prevDrawing = drawings[myMap.get(localStorage.uKey)].drawing;
    var prevText = drawings[myMap.get(localStorage.uKey)].text;
    var prevUser = drawings[myMap.get(localStorage.uKey)].name;
    for (let j = 0; j < prevDrawing.length; j++) {
            if (prevDrawing[j] != undefined){
    		  var col = color(prevDrawing[j][0].z._array[0], prevDrawing[j][0].z._array[1], prevDrawing[j][0].z._array[2], 0.8);
    		
    	       for (let i = 1; i < prevDrawing[j].length; i++) {
    			
    			
    			stroke(col);
    			let newX1 = prevDrawing[j][i].x - (1/3);
    			let newX2 = prevDrawing[j][i-1].x - (1/3);
    			if (newX1 > 0 && newX2 > 0){
                    strokeWeight(prevDrawing[j][i].s)
            		line(newX1*width, prevDrawing[j][i].y*height, newX2*width, prevDrawing[j][i-1].y*height);
            		line(newX1*width, prevDrawing[j][i].y*height, newX1*width, (prevDrawing[j][i].y)*height+prevDrawing[j][i].dm);


    			}
    	       }
           }

    }

if (prevText != undefined){
    //TEXTAREAS
    for (let j = 0; j < prevText.length; j++) {
        let x = createElement("textarea");
        canvascontainer.appendChild(x.elt);
       // if (prevText[j].x-(1/3)+(windowWidth - width)/(2*width)>0){
        if (true){
            x.position((prevText[j].x-(1/3)) * width +(windowWidth - width)/2 ,prevText[j].y * height);
            x.style("width",JSON.stringify(prevText[j].w*width));
            x.style("height",JSON.stringify(prevText[j].h*height));
            x.html(prevText[j].text);
            x.attribute("disabled","true");
            x.style("resize","none");
        }
        else {
        //x.hide();
        x.position(100,100);
        }
    }

}}
    //Dark left panel
    /*colorMode(RGB, 255)
    fill(33,33,43);
    noStroke();
    rect(0,0,width*leftMargin, height);*/
    //image(osb,0,0,width*leftMargin, height);
    //rect((1-leftMargin)*width,0,width*leftMargin, height);

    //Shades
    colorMode(RGB,255);
    noStroke();
    fill(33,33,43,130);
    rect(width*leftMargin,0,10,height);
    rect(3*width/4-10,0,10,height);
    


    //Menu bar at left
    noFill();
    stroke(0,0,200);
    let wd = width*leftMargin/2;
    let ht = height / 2;
    rect(leftMargin*width/2-wd/2,height/2 - ht/2,wd,ht,wd/10);
    fill(200,200,255);
    stroke(0,0,250);
    strokeWeight(1);


    //Upper bar
    /*rect(0,height-cueHeight*height,width/3,height);
    fill(250,250,255);
    rect(width/3,height-cueHeight*height,width/3,height);
    fill(220,220,255);
    rect(2*width/3,height-cueHeight*height,width/3,height);
*/

    //left side

    /*stroke(0,0,250);
    strokeWeight(3);
    line(5,2*cueHeight*height/3,width/3-5,2*cueHeight*height/3);
    line(5,2*cueHeight*height/3-5,5,2*cueHeight*height/3+5);
    line(width/3-5,2*cueHeight*height/3-5,width/3-5,2*cueHeight*height/3+5);*/


    /*
    noStroke();

    fill(0,0,250);
    textFont(myFont);
    textSize(width/70);
    text('Muro de tu amig@: ' + prevUser , 30, height-cueHeight*height/2);
    fill(0,0,250);
    text('Muro de ' + localStorage.uName + '(Tú)', width/3+20,height - cueHeight*height/2);
    text('Muro de tus invitad@s', 2*width/3+20,height - cueHeight*height/2);

    var inString = "Hola! Tu amig@ " + prevUser + " te invitó a participar en el Cadáver Exquisito Constituyente y te dio un pedacito de muro justo al lado del suyo!. Para poder ver el muro completo, raya tu pedacito. Puedes rayar, escribir o decir lo que quieras con respecto al proceso constituyente."
    rightText.elt.innerHTML=inString;

*/
    /*colorMode(RGB, 1, 1, 1, 1);
    translate(width/3,3*cueHeight*height/4);
    rotate(PI);
    image(arrow, 0, 0,60,20);*/


    
}



//----GIPHY STUFF (NOT YET IMPLEMENTED)----//
function openGif() {
    //inpt.hide();
    gifButton.hide();
    inp1.hide();
    //saveButton.hide();
    gifMenu = 1;
    searchTxt.show();
    searchTxt.position(10, 100);
    sendSearch.show();
    sendSearch.position(10, 130);
}

function sendQuery() {
    url = api + apiKey + "&q=" + searchTxt.value();
    loadJSON(url, gotGiphy);
}

function gotGiphy(giphy) {
    var absH = 130;
    console.log(giphy);
    for (var i = 0; i < 10; i++) {
        createImg(giphy.data[i].images.original.url, imgG => {
            console.log("height=" + imgG.height);
            console.log("absH=" + absH);


            imgG.position(10, absH);
            let r = imgG.height / imgG.width;
            console.log("r=" + r);
            console.log("w=" + width);
            imgG.style("width", JSON.stringify(floor(width / 5)));
            console.log("width=" + imgG.width);
            imgG.style("z-index", "1000");
            imgG.style("opacity", "0.7");
            imgG.class("images");
            dragElement(imgG.elt);

            absH = absH + imgG.width * r;

        });


    }
}




