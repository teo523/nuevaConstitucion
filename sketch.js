// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/RUSvMxxm_Jo

//Giphy
var api = "https://api.giphy.com/v1/stickers/search?";
var apiKey = "&api_key=dc6zaTOxFJmzC";
var query = "&q=unicorn";
var url = api+apiKey+query;
let gifMenu = 0;
var blinkFirst = 1;
var counter = 0;
var trimmed;
var imgCreated = 0;
var userKey = "CE";
var letters = ['a','b','c','d','e','f',1 ,2,3,4,5,6,7,8,9,0];


var inp1;
var inpt;
var gifButton;
var saveButton;
var cl1;
var database;
let v = 1.0 / 9.0;

// kernel is the 3x3 matrix of normalized values
let kernel = [[ v, v, v ], [ v, v, v ], [ v, v, v ]]; 

var drawing = [];
var currentPath = [];
var isDrawing = false;
let img;
let preImg;
let fltImg;
let cutImg;
let c;
let bool = 0;
let blinkTxt;
let searchTxt;
let sendSearch;

function preload() {
  img = loadImage('assets/images/concrete.jpg');
  preImg = loadImage('assets/images/prev.jpg');

}

function setup() {
  if (windowWidth > windowHeight)
  canvas = createCanvas(windowWidth, windowHeight);

  else
  canvas = createCanvas(windowWidth, windowWidth);

  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);
  if (windowWidth > windowHeight)
    canvas.position(0,0);

  else {
    canvas.position(0,(windowHeight-height)/2);
  }

  img.resize(width,height);
  //preImg.resize(width,height);

  blinkTxt = select('#blinkText');
  blinkTxt.position(10,100);
  blinkTxt.hide();

  searchTxt = createInput('');
  searchTxt.hide();
  sendSearch = createButton("Buscar");
  sendSearch.hide();
  sendSearch.mousePressed(sendQuery); 
  
  inpt = createElement("textarea","");
  var ht = windowHeight;
  inp1 = createColorPicker('#ff0000');

  inp1.style("height","50");
   inp1.style("width","50");
     inp1.position(0,height-inp1.height);
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
 saveButton = select('#saveButton');
 saveButton.mousePressed(saveDrawing);
 saveButton.position(0,200);
 saveButton.style("z-index","1000");

  gifButton = select('#gifButton');
  gifButton.mousePressed(openGif);
  gifButton.style("z-index","1000");
  gifButton.style("height","50");
  gifButton.style("width","50");
  gifButton.position(inp1.width,height-gifButton.height);

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

function startPath() {
  if (mouseX > width/3 - width/20 && mouseX < 2*width/3 + width/20)
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
stroke(0);



background(img);

if(localStorage.uKey == undefined){
	saveButton.hide();
}

if(bool == 0){
//c = preImg.get(preImg.width/3,0,preImg.width/3-width/20,preImg.height);
d = get(2*width/3,0,width/3,height);
//c.resize(width/3-width/20,height);
d.resize(width/3,height);
//c.filter(BLUR,15);
d.filter(BLUR,15);

bool ++;
}

//blurred rectangle at the left
//image(c,0,0);
//blurred rect at right
image(d,2*width/3+width/20,0,width/3,height);
//previous image to be added at left
cutImg = preImg.get(preImg.width/3,0,preImg.width/3+50,preImg.height);
//image(cutImg,0,0);



if (imgRef != null && imgCreated == 0){
loadDrawing();
}

r = rect(0,0,width, 5000);
  colorMode(RGB, 1, 1, 1, 1);
  var col = color(inp1.color()._array[0],inp1.color()._array[1],inp1.color()._array[2],0.5);
  cl1 = col;
  var drip = random(10);
  var dmax = 0;

  if (isDrawing && (mouseX > width/3 - width/20 && mouseX < 2*width/3 + width/20)) {
    var point = {
      x: mouseX,
      y: mouseY,
      z: col,
      dr: drip,
      dm: dmax
    };
    currentPath.push(point);
  }

  stroke(255);
  strokeWeight(4);
  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];

    beginShape();
    for (var j = 0; j < path.length; j++) {
    	stroke(path[j].z);
     	vertex(path[j].x, path[j].y);
        if ( path[j].dm <  path[j].dr)
        	path[j].dm = path[j].dm + 0.1;
     	
     		stroke(path[j].z);
     		line(path[j].x, path[j].y,path[j].x, path[j].y + path[j].dm)
  		
    }
    endShape();
  }

if (gifMenu){
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

if (blinkFirst < 4 && counter < 50) {
push();
strokeWeight(2);
textSize(32);
textFont('Arial');
text("Muro de Claudia",cutImg.width/6,cutImg.height/2);
drawingContext.setLineDash([5, 15]);
strokeWeight(5);
fill(255,0,0,0);
rect(0,0,cutImg.width,cutImg.height);  
pop();
if (counter == 0)
blinkFirst++;
}

if (blinkFirst >= 4 && blinkFirst < 8 && counter < 50) {
push();
strokeWeight(2);
textSize(32);
textFont('Arial');
text("Tu Muro",cutImg.width + cutImg.width/6,cutImg.height/2);
drawingContext.setLineDash([5, 15]);
strokeWeight(5);
fill(100,0,255,0);
rect(width/3-width/20,0,width - 2 * (width/3-width/20),cutImg.height);  
pop();
if (counter == 0)
blinkFirst++;
}

if (blinkFirst >= 8 && blinkFirst < 12 && counter < 50) {
push();
strokeWeight(2);
textSize(32);
textFont('Arial');
text("Muro de tu invitad@",(width - (width/3-width/20)),cutImg.height/2);
drawingContext.setLineDash([5, 15]);
strokeWeight(5);
fill(0,0,255,0);
rect(width - (width/3),0,width/3,cutImg.height);  
pop();
if (counter == 0)
blinkFirst++;
}

counter++;
if (counter == 100)
counter = 0;
}

function loadDrawing() {
console.log(imgRef.src);
//Creates two images from the previous participant: 
//imgBlurred will take the central rectandle, blur it and put it in the left side of the screen
//imgVisible will take the central rectandle, and put it in the left side of the screen
let imgVisible=createImg(imgRef.src);
let imgBlurred=createImg(imgRef.src);

imgVisible.parent("#canvascontainer");
imgVisible.style("width",width);
imgVisible.style("height",height);
imgVisible.style("clip-path","inset(0% 30% 0% 30%)");
imgVisible.position(-width/3,0);

imgCreated = 1;
imgBlurred.parent("#canvascontainer");
imgBlurred.style("width",width);
imgBlurred.style("height",height);
imgBlurred.style("filter","blur(20px)");
imgBlurred.style("clip-path","inset(0% 38% 0% 30%)");
imgBlurred.position(-width/3,0);

}

//Saves userName and key to database and then saves canvas with the name "(userKey).jpg" in storageRef/images/
function saveDrawing() {

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
    parent: parent
  };

  localStorage.removeItem("uKey");
  localStorage.removeItem("uName");
  var result = ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status) {
    console.log(status);
  }

var storageRef = firebase.storage().ref();
var childRef = storageRef.child("/images/" + userKey + ".jpg");

var canvas0 = document.getElementById('defaultCanvas0');

canvas0.toBlob(function(blob) {
       // use the Blob or File API
childRef.put(blob).then(function(snapshot) {
  console.log('Uploaded a blob or file!');
});

});

alert("Gracias por aportar!! El código de tu dibujo es: " + userKey + ". COPIALO y envíaselo a tus amigos para que continúen tu muro")


saveButton.hide();



}

function gotData(data) {
  // clear the listing
  var elts = selectAll('.listing');
  for (var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
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
}

function errData(err) {
  console.log(err);
}






//----GIPHY STUFF (NOT YET IMPLEMENTED)----//
function openGif(){
//inpt.hide();
gifButton.hide();
inp1.hide();
//saveButton.hide();
gifMenu=1;
searchTxt.show();
searchTxt.position(10,100);
sendSearch.show();
sendSearch.position(10,130);
}

function sendQuery() {
  url = api+apiKey+"&q="+searchTxt.value();
  loadJSON(url, gotGiphy);
}

function gotGiphy(giphy){
  var absH = 130;
  console.log(giphy);
  for (var i = 0; i< 10; i++){
  createImg(giphy.data[i].images.original.url,imgG =>{
  console.log("height="+imgG.height);
  console.log("absH="+absH);
  

  imgG.position(10,absH);
  let r = imgG.height/imgG.width;
  console.log("r="+r);
  console.log("w="+width);
  imgG.style("width",JSON.stringify(floor(width/5)));
  console.log("width="+imgG.width);
  imgG.style("z-index","1000");
  imgG.style("opacity","0.7");
  imgG.class("images");
  dragElement(imgG.elt);
  
  absH = absH+imgG.width*r;

    });


}
}




