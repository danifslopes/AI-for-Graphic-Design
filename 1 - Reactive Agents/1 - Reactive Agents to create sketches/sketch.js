let drawing,
  points = [],
  agents = [],
  numAgents = 3;

let pointsSource = sobelEdgeDetection; // typePoints || sobelEdgeDetection


function preload() {
  pointsSource.preload();
}


function setup() {
  pointsSource.setup();
  drawing = createGraphics(width, height);
  points = pointsSource.get();
  for (let i = 0; i < numAgents; i++) agents.push(new Agent(random(width), random(height)));
}


function draw() {
  background(0);
  //drawPoints();

  for (let agent of agents) {
    agent.update();
    agent.visualise();
    agent.draw();
  }

  if (points.length == 0) {
    background(0);
    for (let agent of agents) agent.draw();
    alert("end");
    noLoop();
  }
}


function drawPoints() {
  fill(255, 0, 0);
  noStroke();
  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x, points[i].y, 2, 2);
  }
}




