// Cadaver Exquisito de la Nueva Constitución de Chile
// Página Post Experience
// por Guillermo Montecinos
// Junio 2021

// Global variables
let tree = []
let snapshot;
let loaded = false
let font
// cuadrant aspect
const originAspect = 16 / 9
const aspectRatio = .74
const overlapAspect = 4 / 27
const canvasHeightPct = .75

// Firebase config data
const firebaseConfig = {
    apiKey: "AIzaSyBo4BBv2muAE4Y-yvJ90SYmn5fdwy5L84k",
    authDomain: "nueva-constitucion.firebaseapp.com",
    databaseURL: "https://nueva-constitucion-default-rtdb.firebaseio.com",
    projectId: "nueva-constitucion",
    storageBucket: "nueva-constitucion.appspot.com",
    messagingSenderId: "197438903025",
    appId: "1:197438903025:web:f7bb1385df1724038c0f50",
    measurementId: "G-VNK3XJS5Z5"
}


// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.firestore().enablePersistence();
const databaseRef = firebase.database().ref('drawings')

// Request database
// let inptKey = 'CE891b764b5'
let inptKey = localStorage.finalKey;

function preload(){
    font = loadFont('assets/OpenSans-Bold.ttf')
}

function setup(){
    databaseRef.on("value",getData,errorData);
    document.getElementById('code').innerHTML = inptKey

    textFont(font)

    // Mover este css a style.scss
    loadDiv = select("#loadDiv");
    loadDiv.elt.innerHTML="Cargando el muro final, espera unos segundos...";
    loadDiv.position(windowWidth/3,windowHeight*0.25);
    loadDiv.style("font-size","3vw");
    loadDiv.style("border","none")
    loadDiv.style("color","#525252");

    but = select("#feedback");
    but.position(10,0.25/2*height);

    saveC = createButton("save");
    saveC.mousePressed(guardar);

}

function guardar(){
    save("a.svg");
}


function getData(data){
    if(!loaded){
        snapshot = data;
        buildTree(inptKey, snapshot)   
        tree = tree.reverse()
        drawTree(tree)
    }
}

function errorData(err){
    console.log(err);
}

function buildTree(key, database){
    database.forEach(child => {
        // console.log(child.toJSON())
        const element = child.toJSON()
        if(element.userKey == key){
            const key = child.key
            const userKey = element.userKey
            const name = element.name
            let drawing = null
            if(element.drawing){
                drawing = element.drawing
            }
            let texts = null
            if(element.text){
                texts = element.text
            }
            // Tree will be filled backwards
            tree.push({key: key, userKey: userKey, name: name, drawing: drawing, texts: texts})
            if(element.parent){
                buildTree(element.parent, database)
            }
        }
    })
    loaded = true
}

function drawTree(data){
    console.log(data)
    if(data.length == 0){
        alert('ERROR, missing data.')
    }
    else {
        // Count how many quadrants with data we have
        let numQuadrants = 0
        data.forEach(element => {
            if(element.drawing) numQuadrants++
        })
        // Create Canvas
        const oneUserWidth = aspectRatio * windowHeight * canvasHeightPct
        // Note: canvas is longer because it still has the overlapped tails
        const cnv = createCanvas(oneUserWidth * numQuadrants, windowHeight * canvasHeightPct,SVG)
        cnv.parent('canvas-wrapper')
        background(0, 0)
        const originWidth = originAspect * height
        fill(0, 0, 0, 0)
        stroke(0)
        strokeWeight(height / 120)
        // Draw actual quadrants
        let currentQuadrant = 0
        data.forEach((quadrant) => {
            if(quadrant.drawing){
                const drawing = quadrant.drawing
                for(let pathID in drawing){
                    strokeWeight(height / 120);
                    const path = drawing[pathID]
                    for(let k = 0; k < Object.keys(path).length - 1; k++){
                        const x1 = originWidth * (path[k].x - .25) + currentQuadrant * (oneUserWidth + originWidth * (.25 - 1/3))
                        const y1 = path[k].y * height
                        const x2 = originWidth * (path[k + 1].x - .25) + currentQuadrant * (oneUserWidth + originWidth * (.25 - 1/3))
                        const y2 = path[k + 1].y * height
                        const y3 = (path[k].y + path[k].dm) * height
                        // Set stroke color using data stored in z
                        stroke(path[k].z.levels[0], path[k].z.levels[1], path[k].z.levels[2], path[k].z.levels[3])
                        // draw line
                        strokeWeight(path[k].s)
                        line(x1, y1, x2, y2)
                        line(x1,y1,x1,y3)
                    }
                }
                if(quadrant.texts){
                    const texts = quadrant.texts

                    for(let id in texts){
                        const textObj = texts[id]
                        const x = originWidth * (textObj.x - .25) + currentQuadrant * (oneUserWidth + originWidth * (.25 - 1/3))
                        const y = textObj.y * height
                        const w = originWidth * textObj.w
                        const h = textObj.h * height
                        // Draw text box 
                        fill('rgba(240, 240, 200,0.8)')
                        noStroke()
                        rect(x, y, w, h)
                        // Draw text
                        fill(0)
                        textSize(height / 55)
                        textStyle(BOLD)
                        text(textObj.text, x + 2, y + 2, w, h * 2)
                    }
                }
                currentQuadrant++
            }
        })
        addNames(data, oneUserWidth)
    }
    loadDiv.hide();
}

function addNames(data, userWidth){
    const namesContainer = document.createElement('div')
    namesContainer.className = 'names-container'
    namesContainer.style.height = .07 * height + 'px'
    data.forEach((quadrant) => {
        if(quadrant.drawing){
            const newName = document.createElement('div')
            newName.className = 'user-name'
            newName.innerHTML = quadrant.name
            namesContainer.appendChild(newName)
            newName.style.width = 7 * userWidth / 8 + 'px'
        }
    })
    document.getElementById('canvas-wrapper').appendChild(namesContainer)
}