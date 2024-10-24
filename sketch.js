let img;
let myModel;
let saveBtn1;
let generateBtn1;
let generateBtn2;
let generateBtn3;
let generateBtn4;
let generateBtn5;
var canvasWidth = 800;
var canvasHeight = 800;
var backgroundColor;

//3D box dimensions
var bWidth = 1;
var bHeight = 1;
var z;
var baseHeight = 20;

function preload() {
  // Load the bottom image from the canvas's assets directory.
  img = loadImage("stanczak.png");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);

  //bug: setting x and y to different sizes does not
  // seem to stretch the final 3D model
  img.resize(400, 400);
  img.loadPixels();

  //convert the very long 1D array
  // to more intuitive rectangular array
  var imgArray = createImgArray(img);

  //run default filter
  brightness_filter(imgArray);

  //add buttons
  saveBtn1 = createButton("Save .stl");
  saveBtn1.mousePressed(function () {
    myModel.saveStl();
  });

  // Dark == HIGH
  generateBtn1 = createButton("brightness");
  generateBtn1.mousePressed(function () {
    brightness_filter(imgArray);
  });

  // Light == HIGH
  generateBtn2 = createButton("inverted brightness");
  generateBtn2.mousePressed(function () {
    inverted_brightness_filter(imgArray);
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
}

function draw() {
  background(0);
  image(img, -canvasWidth / 2, -canvasHeight / 2);
  orbitControl();
  noStroke();
  lights();
  model(myModel);
}

function brightness_filter(array_in) {
  //convert to grayscale
  var array_grayscale = imgArrayGrayscale(array_in);

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_grayscale.length; x++) {
      for (var y = 0; y < array_grayscale[0].length; y++) {
        //grab a susbpixel and use this as the height of this box.
        z = (255 - array_grayscale[x][y]) / 20 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);
}

function inverted_brightness_filter(array_in) {
  //convert to grayscale
  var array_grayscale = imgArrayGrayscale(array_in);

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_grayscale.length; x++) {
      for (var y = 0; y < array_grayscale[0].length; y++) {
        //grab a subpixel and use this as the height of this box.
        z = array_grayscale[x][y] / 20 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);
}

function red_filter(array_in) {

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        //grab a subpixel and use this as the height of this box.
        z = array_in[x][y][0] / 20 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);
}

function green_filter(array_in) {

  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        //grab a subpixel and use this as the height of this box.
        z = array_in[x][y][1] / 20 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);
}

function blue_filter(array_in) {
  
  //create 3D drawing
  myModel = buildGeometry(() => {
    //Loop through individual x,y pixels of array
    for (var x = 0; x < array_in.length; x++) {
      for (var y = 0; y < array_in[0].length; y++) {
        //grab a subpixel and use this as the height of this box.
        z = array_in[x][y][2] / 20 + baseHeight;
        makeBox(x, y, z);
      }
    }
  });
  model(myModel);
}

// Converts a 1D to a cubic image array
// The 3 dimension are x, y, and subpixel,
// where subpixel is red,green,blue,and alpha,
// thus the output is always of size x,y,4
function createImgArray(img_in) {
  // iterator to move through 1D image array.
  var i = 0;
  var img_out = [];

  //loop through dimensions of output nested array
  for (let x = 0; x < img_in.width; x++) {
    img_out[x] = []; // create nested array
    for (let y = 0; y < img_in.height; y++) {
      img_out[x][y] = []; //create nexted array
      for (let channel = 0; channel < 4; channel++) {
        img_out[x][y][channel] = img_in.pixels[i++];
      }
    }
  }
  return img_out;
}

//convert the rectangular array to grayscale.
// this results in converting the array of size (x,y,4)
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
  translate(x_in, y_in, z_in / 2);
  box(bWidth, bHeight, z_in);
  pop();
}