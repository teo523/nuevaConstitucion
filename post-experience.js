// Cadaver Exquisito de la Nueva Constitución de Chile
// Página Post Experience
// por Guillermo Montecinos
// Junio 2021

// Global variables
let tree = []
// cuadrant aspect
const originAspect = 16 / 9
const aspectRatio = .74
const overlapAspect = 4 / 27
const canvasHeightPct = .85

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
//let inptKey = 'CE83b7a1102'
let inptKey = localStorage.finalKey;

function setup(){
    
    databaseRef.get().then(function(snapshot){
        buildTree(inptKey, snapshot)
        console.log(tree)
        tree = tree.reverse()
        drawTree(tree)
    })
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
}

function drawTree(data){
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
        createCanvas(oneUserWidth * numQuadrants, windowHeight * canvasHeightPct)
        background(250)
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
                    const path = drawing[pathID]
                    for(let k = 0; k < Object.keys(path).length - 1; k++){
                        const x1 = originWidth * (path[k].x - .25) + currentQuadrant * (oneUserWidth + originWidth * (.25 - 1/3))
                        const y1 = path[k].y * height
                        const x2 = originWidth * (path[k + 1].x - .25) + currentQuadrant * (oneUserWidth + originWidth * (.25 - 1/3))
                        const y2 = path[k + 1].y * height
                        // Set stroke color using data stored in z
                        stroke(path[k].z.levels[0], path[k].z.levels[1], path[k].z.levels[2], path[k].z.levels[3])
                        // draw line
                        line(x1, y1, x2, y2)
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
                        fill(0, 0, 0, 0)
                        stroke(0)
                        strokeWeight(2)
                        rect(x, y, w, h)
                        // Draw text
                        strokeWeight(1)
                        fill(0)
                        textSize(height / 45)
                        text(textObj.text, x + 2, y + 2, w, h)
                    }
                }
                currentQuadrant++
            }
        })
    }
}