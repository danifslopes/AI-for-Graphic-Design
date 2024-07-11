let minSightDist = 50,
    maxSightDist = 200,
    sightDistInc = 1,
    drawingDist = 30,
    turningSpeedWhenAttracted = 0.1,
    maxTurningAngleWhenExploring = Math.PI / 16;

class Agent {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.doDraw = false;
        this.currentSignDist = minSightDist;
    }

    update() {
        //find the closest point in sight
        let closestDist = Infinity;
        let closestPoint = null;

        for (let i = 0; i < points.length; i++) {
            let d = p5.Vector.dist(this.pos, points[i]);
            if (d < this.currentSignDist && d < closestDist) {
                closestDist = d;
                closestPoint = points[i];
            }
        }

        //verify if should draw
        this.doDraw = closestDist < drawingDist;

        // If closestPoint is in sight, move towards it
        if (closestPoint != null) {
            let dir = closestPoint.copy().sub(this.pos); //find the direction of the closet point
            dir.setMag(1);
            this.vel.lerp(dir, turningSpeedWhenAttracted); //to decide how much to turn, find a vector in between, N% closer to vel then dir.
            //decrese sight dist
            if (this.currentSignDist > minSightDist) {
                this.currentSignDist -= sightDistInc;
                if (this.currentSignDist < minSightDist) this.currentSignDist = minSightDist
            }
        }
        //If closestPoint is NOT in sight, explore around
        else {
            if (random(0, 1) < 0.5) {
                let currentAngle = this.vel.heading();
                let randomIncAngle = random(-maxTurningAngleWhenExploring, maxTurningAngleWhenExploring); // Create a random inc angle
                let newAng = currentAngle + randomIncAngle;
                let dir = p5.Vector.fromAngle(newAng); // Set the magnitude of the direction vector
                dir.setMag(1);
                this.vel = dir;
            }
            //increase sight dist
            if (this.currentSignDist < maxSightDist) {
                this.currentSignDist += sightDistInc;
                if (this.currentSignDist > maxSightDist) this.currentSignDist = maxSightDist
            }
        }

        // If closestPoint is close enough, remove it
        if (closestDist < 5) {
            points.splice(points.indexOf(closestPoint), 1);
        }

        // If at the edge of the canvas, reflect velocity
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1;
            if (this.pos.x < 0) this.pos.x = 0;
            else if (this.pos.x > width) this.pos.x = width;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1;
            if (this.pos.y < 0) this.pos.y = 0; 
            else if (this.pos.y > height) this.pos.y = height; 
        }

        // Update position
        this.pos.add(this.vel);
    }

    visualise() {
        stroke(255);
        noFill(255);
        ellipse(this.pos.x, this.pos.y, this.currentSignDist * 2, this.currentSignDist * 2);
    }

    draw() {
        if (this.doDraw) {
            drawing.noStroke();
            drawing.fill(255);
            drawing.ellipse(this.pos.x, this.pos.y, 5);
        }
        image(drawing, 0, 0);
    }
}
