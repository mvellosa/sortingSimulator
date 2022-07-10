export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

export function createNode(shapeName, style) {
    let shape = document.createElementNS("http://www.w3.org/2000/svg", shapeName)
    for (let p in style)
      shape.setAttributeNS(null, p, style[p])

    return shape
}

export function map(value, inMin, inMax, outMin, outMax){
    let slope = (outMax - outMin) / (inMax - inMin)
    return outMin + ((value - inMin) * slope)
}