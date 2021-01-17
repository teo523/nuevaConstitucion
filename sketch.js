// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/RUSvMxxm_Jo
var inp1;
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
let c;
let bool = 0;

function preload() {
  img = loadImage('assets/images/concrete.jpg');
  preImg = loadImage('assets/images/prev.jpg');

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);
  canvas.position(0,0);

  


  var inpt = createElement("textarea","");
  var ht = windowHeight;
  inp1 = createColorPicker('#ff0000');
  inp1.position(0,0);
  //inpt.style("line-height", "4ch");
  //inpt.style("background-image", "linear-gradient(transparent, transparent calc(4ch - 1px), #E7EFF8 0px)");
  inpt.style("background","transparent");
  inpt.style("background-image","url('assets/images/patch.png')");
  
  inpt.style("background-repeat","repeat-x");
  inpt.style("background-size","auto 100%");
  inpt.style("color","black");
  //min-height:50px;margin-top:-40px;padding-bottom:40px");
  //inpt.style("background-size","100% 4ch");
  inpt.style("width", width);
  inpt.style("height", "50px");
  inpt.style("font-size", "20px");
  inpt.position(0,height - 50);


  //cursor('assets/images/curs.png');
  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);
  saveButton.position(0,100);
  saveButton.style("z-index","1000");

  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);

 var firebaseConfig = {
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

  var params = getURLParams();
  console.log(params);
  if (params.id) {
    console.log(params.id);
    showDrawing(params.id);
  }

  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);
}

function startPath() {
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





if(bool == 0){
c = preImg.get(preImg.width/3,0,preImg.width/3-100,preImg.height);
d = get(2*width/3,0,width/3,height);
c.filter(BLUR,20);
d.filter(BLUR,20);

bool ++;
}
let cutImg = preImg.get(preImg.width/3,0,preImg.width/3+100,preImg.height);
image(cutImg,0,0);
image(c,0,0);
image(d,2*width/3+100,0);

r = rect(0,0,width, 5000);
  colorMode(RGB, 1, 1, 1, 1);
  var col = color(inp1.color()._array[0],inp1.color()._array[1],inp1.color()._array[2],0.5);
  cl1 = col;
  var drip = random(10);
  var dmax = 0;

  if (isDrawing) {
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
}

function saveDrawing() {
  saveCanvas('myCanvas', 'jpg');
 /* var ref = database.ref('drawings');
  var data = {
    name: 'Dan',
    drawing: drawing
  };
  var result = ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status) {
    console.log(status);
  }*/
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
    var li = createElement('li', '');
    li.class('listing');
    var ahref = createA('#', key);
    ahref.mousePressed(showDrawing);
    ahref.parent(li);

    var perma = createA('?id=' + key, 'permalink');
    perma.parent(li);
    perma.style('padding', '4px');

    li.parent('drawinglist');
  }
}

function errData(err) {
  console.log(err);
}

function showDrawing(key) {
  //console.log(arguments);
  if (key instanceof MouseEvent) {
    key = this.html();
  }

  var ref = database.ref('drawings/' + key);
  ref.once('value', oneDrawing, errData);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
    //console.log(drawing);
  }
}

function clearDrawing() {
  drawing = [];
}
