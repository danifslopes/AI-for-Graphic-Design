//https://editor.p5js.org/czartacus/sketches/cSnxbWsFZ

let srcimg, dstimg, thresh;
let angles = [];

function sobelEdgeDetectionPreload() {
    srcimg = loadImage("assets/eu.jpeg"); // Load the image
}

function sobelEdgeDetectionSetup() {
    srcimg.resize(500, 0);
    pixelDensity(1);
    createCanvas(srcimg.width, srcimg.height);
    dstimg = createImage(srcimg.width, srcimg.height);
    thresh = 20;
}

function detectEdges_Sobel(_srcimg, _dstimg, _kernel) {
    _srcimg.filter(GRAY);
    let k1 = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
    ];
    let k2 = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
    ];
    _srcimg.loadPixels(); // convert the entire canvas to a pixel buffer
    _dstimg.loadPixels(); // convert the entire canvas to a pixel buffer

    let w = _srcimg.width;
    let h = _srcimg.height;
    for (let x = 0; x < w; x++) {
        angles[x] = [];
        for (let y = 0; y < h; y++) {
            // INDEX POSITION IN PIXEL LIST
            let ul = (((x - 1 + w) % w) + w * ((y - 1 + h) % h)) * 4; // location of the UPPER LEFT
            let uc = (((x - 0 + w) % w) + w * ((y - 1 + h) % h)) * 4; // location of the UPPER MID
            let ur = (((x + 1 + w) % w) + w * ((y - 1 + h) % h)) * 4; // location of the UPPER RIGHT
            let ml = (((x - 1 + w) % w) + w * ((y + 0 + h) % h)) * 4; // location of the LEFT
            let mc = (((x - 0 + w) % w) + w * ((y + 0 + h) % h)) * 4; // location of the CENTER PIXEL
            let mr = (((x + 1 + w) % w) + w * ((y + 0 + h) % h)) * 4; // location of the RIGHT
            let ll = (((x - 1 + w) % w) + w * ((y + 1 + h) % h)) * 4; // location of the LOWER LEFT
            let lc = (((x - 0 + w) % w) + w * ((y + 1 + h) % h)) * 4; // location of the LOWER MID
            let lr = (((x + 1 + w) % w) + w * ((y + 1 + h) % h)) * 4; // location of the LOWER RIGHT

            // green channel only
            let p0 = _srcimg.pixels[ul + 1] * k1[0][0]; // upper left
            let p1 = _srcimg.pixels[uc + 1] * k1[0][1]; // upper mid
            let p2 = _srcimg.pixels[ur + 1] * k1[0][2]; // upper right
            let p3 = _srcimg.pixels[ml + 1] * k1[1][0]; // left
            let p4 = _srcimg.pixels[mc + 1] * k1[1][1]; // center pixel
            let p5 = _srcimg.pixels[mr + 1] * k1[1][2]; // right
            let p6 = _srcimg.pixels[ll + 1] * k1[2][0]; // lower left
            let p7 = _srcimg.pixels[lc + 1] * k1[2][1]; // lower mid
            let p8 = _srcimg.pixels[lr + 1] * k1[2][2]; // lower right
            let r1 = p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8;

            p0 = _srcimg.pixels[ul + 1] * k2[0][0]; // upper left
            p1 = _srcimg.pixels[uc + 1] * k2[0][1]; // upper mid
            p2 = _srcimg.pixels[ur + 1] * k2[0][2]; // upper right
            p3 = _srcimg.pixels[ml + 1] * k2[1][0]; // left
            p4 = _srcimg.pixels[mc + 1] * k2[1][1]; // center pixel
            p5 = _srcimg.pixels[mr + 1] * k2[1][2]; // right
            p6 = _srcimg.pixels[ll + 1] * k2[2][0]; // lower left
            p7 = _srcimg.pixels[lc + 1] * k2[2][1]; // lower mid
            p8 = _srcimg.pixels[lr + 1] * k2[2][2]; // lower right
            let r2 = p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8;

            // 0 is the minimum value the sum could result in and 1414 is the maximum
            let result = map(sqrt(r1 * r1 + r2 * r2), 0, 1442, 0, 255);

            // write pixels into destination image:

            _dstimg.pixels[mc] = result;
            _dstimg.pixels[mc + 1] = result;
            _dstimg.pixels[mc + 2] = result;
            _dstimg.pixels[mc + 3] = 255;
            _dstimg.pixels[mc + 3] = 255;
            if (result > _kernel) {
                angles[x][y] = atan2(r1, r2);
            }
        }
    }

    _dstimg.updatePixels(); // update and display the pixel buffer
}

function getSobelEdgesPoints() {
    detectEdges_Sobel(srcimg, dstimg, thresh);

    let points = [];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let angle = angles[x][y];
            if (isNaN(angle) == false) points.push(createVector(x, y));
        }
    }

    return points
}

let sobelEdgeDetection = {
    preload: sobelEdgeDetectionPreload,
    setup: sobelEdgeDetectionSetup,
    get: getSobelEdgesPoints
}