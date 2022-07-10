import {createNode, shuffle} from './utils.js'
import {playNote, mapNote} from  './sounds.js'


var bars = []

var simulation = {
    width : 800,
    height : 400,
    numBars : 10,
    interval : null,
    step : null
}

class Bar {
    svgMaster
    height
    constructor(svgMaster, width, height, color, x, y) {
        this.svgMaster = svgMaster
        this.width = width
        this.height = height
        
        this.x = x
        this.y = y
        this.color = color

        this.svg = createNode("rect", { 
            width: this.width,
            height: this.height,
            fill: this.color,
            x: this.x,
            y: this.y,
            "stroke-width": 1,
            stroke : "#000000"
        })
        this.svgMaster.appendChild(this.svg)
    }

    changeColor(color){
        this.color = color
        this.svg.setAttribute('fill', color)
    }
}

var barsSvg = createNode("svg", { width: simulation.width, height: simulation.height})


function setup(){
    const step = Math.floor(simulation.height / simulation.numBars)
    simulation.step = step
    
    const barWidth = simulation.width / simulation.numBars
    
    let offset_x = 0
    
    document.body.appendChild(barsSvg)
    
    let randomHeights = []

    for (let i = 0; i < simulation.numBars; i++){
        const currHeight = (i + 1) * step
        randomHeights.push(currHeight)
    }

    shuffle(randomHeights)
    
    for (let i = 0; i < simulation.numBars; i++){
        const currHeight = randomHeights[i]
        bars.push(new Bar(barsSvg, barWidth, currHeight, "#2e2e2e", offset_x, simulation.height - currHeight))
        offset_x += barWidth
    }
    

    simulation.interval = setInterval(update, 0.001)
    
    window.addEventListener('keydown', function (e){
        clearInterval(simulation.interval)
    })
}

var currEla = 0
var currElb = 0

function swap(a, b){
    let A_currTransform = bars[a].svg.getAttribute('transform')
    let B_currTransform = bars[b].svg.getAttribute('transform')
    
    bars[currEla].changeColor('#2e2e2e')
    bars[currElb].changeColor('#2e2e2e')
    currEla = a
    currElb = b
    bars[a].changeColor('red')
    
    // playNote(mapNote(bars[b].height, simulation.step, simulation.height) , 'square')
    
    let A_currXOffset = 0
    let B_currXOffset = 0
    
    if (A_currTransform)
    A_currXOffset = parseInt(A_currTransform.split('(')[1].split(')')[0].split(',')[0])

    if (B_currTransform)
    B_currXOffset = parseInt(B_currTransform.split('(')[1].split(')')[0].split(',')[0])
    
    bars[a].svg.setAttribute('transform', 'translate(' + (bars[b].x - bars[a].x + B_currXOffset) + ',' + (bars[b].y - bars[a].y + bars[b].height - bars[a].height) + ')')
    bars[b].svg.setAttribute('transform', 'translate(' + (bars[a].x - bars[b].x + A_currXOffset) + ',' + (bars[a].y - bars[b].y + bars[a].height - bars[b].height) + ')')
    
    const temp = bars[a]
    bars[a] = bars[b]
    bars[b] = temp
}

var k = 0

function update(){

    if (k < bars.length - 1){
        if(bars[k].height > bars[k + 1].height)
            swap(k, k + 1)
        k++
    } else {
        k = 0
    }

}


setup()