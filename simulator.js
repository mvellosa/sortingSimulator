var bars = []

var simulation = {
    width : 800,
    height : 400,
    numBars : 50,
    interval : null,
    step : null
}

var audioContext = new AudioContext()
function playNote(frequency, type) {
    var oscilator = audioContext.createOscillator()
    var gain = audioContext.createGain()
    oscilator.type = type
    oscilator.connect(gain)
    oscilator.frequency.value = frequency
    gain.connect(audioContext.destination)
    oscilator.start(0)
    gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.04);
}

var barsSvg = createNode("svg", { width: simulation.width, height: simulation.height})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createNode(shapeName, style) {
    let shape = document.createElementNS("http://www.w3.org/2000/svg", shapeName)
    for (let p in style)
      shape.setAttributeNS(null, p, style[p])

    return shape
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


var k = 0

function setup(){
    const step = Math.floor(simulation.height / simulation.numBars)
    simulation.step = step

    const barWidth = simulation.width / simulation.numBars

    let offset_x = 0

    document.body.appendChild(barsSvg)

    for (let i = 0; i < simulation.numBars; i++){
        const currHeight = (i + 1) * step
        bars.push(new Bar(barsSvg, barWidth, currHeight, "#2e2e2e", offset_x, simulation.height - currHeight))
        offset_x += barWidth
    }

    simulation.interval = setInterval(update, 20)

    window.addEventListener('keydown', function (e){
        clearInterval(simulation.interval)
    })
}




notes = [16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50, 29.14, 30.87,
        32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00, 51.91, 55.00, 58.27, 61.74,
        65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.8, 110.0, 116.5, 123.5,
        130.8, 138.6, 146.8, 155.6, 164.8, 174.6, 185.0, 196.0, 207.7, 220.0, 233.1, 246.9,
        261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 370.0, 392.0, 415.3, 440.0, 466.2, 493.9,
        523.3, 554.4, 587.3, 622.3, 659.3, 698.5, 740.0, 784.0, 830.6, 880.0, 932.3, 987.8,
        1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976,
        2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951,
        4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902
]


var currEla = 0
var currElb = 0

function map(value, inMin, inMax, outMin, outMax){
    let slope = (outMax - outMin) / (inMax - inMin)
    return outMin + ((value - inMin) * slope)
}

function mapNote(value){
    freq = map(value, simulation.step, simulation.height, 523.3, 987.8)

    let i = 0
    while (i < notes.length && freq > notes[i]){
        i++
    }
    console.log('mapped not : ' + notes[i])
    return freq
}

function swap(a, b){
    let A_currTransform = bars[a].svg.getAttribute('transform')
    let B_currTransform = bars[b].svg.getAttribute('transform')

    bars[currEla].changeColor('#2e2e2e')
    bars[currElb].changeColor('#2e2e2e')
    currEla = a
    currElb = b
    bars[a].changeColor('red')
    //bars[b].changeColor('red')
    
    //playNote(mapNote(bars[a].height) , 'square'); 
    playNote(mapNote(bars[b].height) , 'square'); 

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

function update(){

    if (k < bars.length - 1){
        swap(k, k + 1)
        k++
    }else{
        k = 0
    }
}