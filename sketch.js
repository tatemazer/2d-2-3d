let img;
let myModel;
let saveBtn1;
let generateBtn1;
let generateBtn2;
let generateBtn3;
let generateBtn4;
let generateBtn5;
let generateBtn6;
let generateBtn7;
let generateBtn8;
var generateBtn9;
var canvasWidth;
var canvasHeight;
var imgSize = 200;
var backgroundColor;
var activeFilter = "dark";

//3D box dimensions
var bWidth = 1;
var bHeight = 1;
var z;
var baseHeight = 0;
var heightRange = 10;

function preload() {
  // Load the bottom image from the canvas's assets directory.
  img = loadImage("circles.jpg");
}

function setup() {
  canvasWidth = imgSize * 2;
  canvasHeight = imgSize * 2;
  createCanvas(canvasWidth, canvasHeight, WEBGL);

  //bug: setting x and y to different sizes does not
  // seem to stretch the final 3D model
  img.resize(imgSize, imgSize);
  img.loadPixels();

  //convert the very long 1D array
  // to more intuitive rectangular array
  var imgArray = createImgArray(img);

  //run default filter
  darkness_filter(imgArray);

  //add buttons
  saveBtn1 = createButton("Save .stl");
  saveBtn1.mousePressed(function () {
    myModel.saveStl(activeFilter + ".stl", { binary: true });
  });
  saveBtn1.position(0, canvasHeight + 20);

  // Dark == HIGH
  generateBtn1 = createButton("dark");
  generateBtn1.mousePressed(function () {
    darkness_filter(imgArray);
  });

  // Light == HIGH
  generateBtn2 = createButton("light");
  generateBtn2.mousePressed(function () {
    lightness_filter(imgArray);
  });

  // red == HIGH (so does white)
  generateBtn3 = createButton("red");
  generateBtn3.mousePressed(function () {
    red_filter(imgArray);
  });

  // green == HIGH (so does white);
  generateBtn4 = createButton("green");
  generateBtn4.mousePressed(function () {
    green_filter(imgArray);
  });

  // blue == HIGH (so does white);
  generateBtn5 = createButton("blue");
  generateBtn5.mousePressed(function () {
    blue_filter(imgArray);
  });

  // Cyan == HIGH
  generateBtn6 = createButton("c");
  generateBtn6.mousePressed(function () {
    cyan_filter(imgArray);
  });

  // Magenta == HIGH
  generateBtn7 = createButton("m");
  generateBtn7.mousePressed(function () {
    magenta_filter(imgArray);
  });

  // yellow == HIGH
  generateBtn8 = createButton("y");
  generateBtn8.mousePressed(function () {
    yellow_filter(imgArray);
  });

  // black == HIGH
  generateBtn8 = createButton("k");
  generateBtn8.mousePressed(function () {
    black_filter(imgArray);
  });
}

function draw() {
  background(0);
  image(img, -canvasWidth / 2, -canvasHeight / 2);
  orbitControl();
  noStroke();
  lights();
  model(myModel);
}

function darkness_filter(array_in) {
  //convert to grayscale
  var array_grayscale = imgArrayGrayscale(array_in);

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_grayscale.length; x++) {
      for (var y = 0; y < array_grayscale[0].length; y++) {
        //grab a susbpixel and use this as the height of this box.
        z = ((255 - array_grayscale[x][y]) * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "dark";
}

function lightness_filter(array_in) {
  //convert to grayscale
  var array_grayscale = imgArrayGrayscale(array_in);

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_grayscale.length; x++) {
      for (var y = 0; y < array_grayscale[0].length; y++) {
        //grab a subpixel and use this as the height of this box.
        z = (array_grayscale[x][y] * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "light";
}

function red_filter(array_in) {
  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        //grab a subpixel and use this as the height of this box.
        z = (array_in[x][y][0] * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "red";
}

function green_filter(array_in) {
  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        //grab a subpixel and use this as the height of this box.
        z = (array_in[x][y][1] * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "green";
}

function blue_filter(array_in) {
  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        //grab a subpixel and use this as the height of this box.
        z = (array_in[x][y][2] * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "blue";
}

function cyan_filter(array_in) {
  var c;
  var k;
  var kInverse;

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        //calculate cmyk: https://www.codeproject.com/KB/applications/xcmyk.aspx
        k = min(
          1 - array_in[x][y][0],
          1 - array_in[x][y][1],
          1 - array_in[x][y][2]
        );
        kInverse = 1 - k;
        c = ((kInverse - array_in[x][y][0]) / kInverse) * 255;

        //grab a subpixel and use this as the height of this box.
        z = (c * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "cyan";
}

function magenta_filter(array_in) {
  var m;
  var k;
  var kInverse;

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        //calculate cmyk: https://www.codeproject.com/KB/applications/xcmyk.aspx
        k = min(
          1 - array_in[x][y][0],
          1 - array_in[x][y][1],
          1 - array_in[x][y][2]
        );
        kInverse = 1 - k;
        m = ((kInverse - array_in[x][y][1]) / kInverse) * 255;

        //grab a subpixel and use this as the height of this box.
        z = (m * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "magenta";
}

function yellow_filter(array_in) {
  var yell;
  var k;
  var kInverse;

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        k = min(
          1 - array_in[x][y][0],
          1 - array_in[x][y][1],
          1 - array_in[x][y][2]
        );
        kInverse = 1 - k;
        yell = ((kInverse - array_in[x][y][2]) / kInverse) * 255;

        //grab a subpixel and use this as the height of this box.
        z = (yell * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "yellow";
}

function black_filter(array_in) {
  var k;

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        k = min(
          255 - array_in[x][y][0],
          255 - array_in[x][y][1],
          255 - array_in[x][y][2]
        );

        //grab a subpixel and use this as the height of this box.
        z = (k * heightRange) / 255 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);

  activeFilter = "black";
}

// Converts a 1D to a cubic image array
// The 3 dimension are x, y, and subpixel,
// where subpixel is red,green,blue,alpha,cyan,magenta,yellow,black
// thus the output is always of size x,y,8
function createImgArray(img_in) {
  // iterator to move through 1D image array.
  var i = 0;
  var img_out = [];
  var c;
  var m;
  var y;
  var k;
  var kInverse;

  //loop through dimensions of output nested array
  for (let x = 0; x < img_in.width; x++) {
    img_out[x] = []; // create nested array
    for (let y = 0; y < img_in.height; y++) {
      img_out[x][y] = []; //create nexted array

      //create rgba subpixels
      for (var channel = 0; channel < 4; channel++) {
        img_out[x][y][channel] = img_in.pixels[i++];
      }
    }
  }
  return img_out;
}

//convert the rectangular array to grayscale.
// this results in converting the array of size (x,y,7)
// to size (x,y);
function imgArrayGrayscale(array_in) {
  var array_out = [];
  for (let x = 0; x < array_in.length; x++) {
    array_out[x] = []; // create nested array
    for (let y = 0; y < array_in[0].length; y++) {
      //generate the average of the three RGB channels
      array_out[x][y] =
        (array_in[x][y][0] + array_in[x][y][1] + array_in[x][y][2]) / 3;
    }
  }
  return array_out;
}

function makeBox(x_in, y_in, z_in) {
  push();
  translate(y_in, x_in, z_in / 2); //no clue why x/y are swapped...
  box(bWidth, bHeight, z_in);
  pop();
}
