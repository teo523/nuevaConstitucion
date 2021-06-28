// Cadaver Exquisito de la Nueva Constitución de Chile
// Página Post Experience
// por Guillermo Montecinos
// Junio 2021

// Global variables
let tree = []
// cuadrant aspect
const aspectRatio = .77

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
const databaseRef = firebase.database().ref('drawings')

// Request database
let inptKey = 'CE959ad4171'

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
            // Tree will be filled backwards
            tree.push({key: key, userKey: userKey, name: name, drawing: drawing})
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
        // Note: here we have to include the overlapping between one quadrant and the next one
        createCanvas(windowHeight / 2 * aspectRatio * numQuadrants, windowHeight / 2)
        background(250)
        stroke(0)
        strokeWeight(2)
        // Draw actual quadrants
        let currentQuadrant = 0
        data.forEach((quadrant) => {
            if(quadrant.drawing){
                const drawing = quadrant.drawing
                for(let pathID in drawing){
                    const path = drawing[pathID]
                    for(let k = 0; k < Object.keys(path).length - 1; k++){
                        // TODO: offsets have been calculated manually and have to be based on the canvas size on draw.html
                        const x1 = (path[k].x - (1/3 - 1/20)) * aspectRatio * height + currentQuadrant * aspectRatio * height 
                        const y1 = path[k].y * height
                        const x2 = (path[k + 1].x - (1/3 - 1/20)) * aspectRatio * height + currentQuadrant * aspectRatio * height
                        const y2 = path[k + 1].y * height
                        // Set stroke color using data stored in z
                        stroke(path[k].z.levels[0], path[k].z.levels[1], path[k].z.levels[2], path[k].z.levels[3])
                        // draw line
                        line(x1, y1, x2, y2)
                    }
                }
                currentQuadrant++
            }
        })
    }
}