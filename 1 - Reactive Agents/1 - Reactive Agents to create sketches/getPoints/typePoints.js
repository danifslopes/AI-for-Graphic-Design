let caslon, txtSize = 250, txt = "Agents";

function typePointsPreload() {
    caslon = loadFont('assets/BigCaslon.otf');
}

function typePointsSetup() {
    createCanvas(1000, 600); 
}

function getTypePoints() {
    textSize(txtSize);
    textFont(caslon);

    points = caslon.textToPoints(txt, width / 2, height / 2, txtSize, { //x, y, foont size
        sampleFactor: 0.1,
        simplifyThreshold: 0
    });

    //just to translate to center
    let upperCaseHeight = txtSize * 0.7;
    let txtWidth = textWidth(txt);
    points = points.map(p => createVector(p.x - txtWidth / 2, p.y + upperCaseHeight / 2));

    return points;

}

let typePoints = {
    preload: typePointsPreload,
    setup: typePointsSetup,
    get: getTypePoints
}