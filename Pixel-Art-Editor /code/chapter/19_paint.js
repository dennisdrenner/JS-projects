var Picture = class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  //make an empty picture of a single color. this is one long
  //array and all the elements are the color in hex
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

  //return the array element at x,y, which is a color code in hex
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }


  //pixels in this case is an array of pixel objects
  //with x,y and color properties. the pixels array
  //just has updated pixels 
  draw(pixels) {
    //this just makes a copy of pixels
    let copy = this.pixels.slice();
    //this is changing just the changed pixels from the tools
    //like draw 
    for (let {x, y, color} of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

//first assign current state to the empty object
//then apply action object (which has changes to the 
//state) to the state, then return the updated state 

function updateState(state, action) {
   return Object.assign({}, state, action);
  }

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

var scale = 10;

//Make a new canvas.  pointerDown is the callback function
//

//var i = 0 ; 
var PictureCanvas = class PictureCanvas {
  constructor(picture, doneList, pointerDown) {
  //  i +=1; 
   // console.log('doneList ', i, doneList);
   //this.doneList = doneList; 
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    //everytime we make a new canvas we syncState
    this.syncState(picture);

    //console.log("this.syncState...new canvas")
  }

  //If the picture hasn't changed do nothing
  //picture is the object created by the picture class
  //with width, height and the array of colors for all x,y
  //pixeleditor syncstate fxn calls this function and also the 
  //syncstate function for all of the controls 
  syncState(picture, doneList) {
    //console.log("Done List", doneList);

    if (this.picture == picture) return;
    if (saving == true) {
        this.picture = picture;
        drawPicture(this.picture, this.dom, scale);
       }
    else {
        this.picture = picture;
        drawPicture(this.picture, this.dom, scale);

       // drawPictureEfficient(this.picture, this.dom, scale, doneList);
        //console.log('running syncState...drawPictureEfficient');
          }
  }
}

//Draw a new canvas
//cx.fillStyle gets the color from the Picture 
//cx.fillRect fills scale sized square with the color 
function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

var drawnPixels = 0; 
var drawnPixelsNoList = 0; 

function drawPictureEfficient(picture, canvas, scale, doneList) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");
  //console.log(doneList);
  if (doneList) {
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
           if (picture.pixel(x,y) != doneList[0].pixel(x,y)) {   
              cx.fillStyle = picture.pixel(x, y);
              cx.fillRect(x * scale, y * scale, scale, scale);
              drawnPixels +=1; 
      }
    }
  }
  console.log('drawnPixels', drawnPixels); 
} 
  

  else {
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
           cx.fillStyle = picture.pixel(x, y);
           cx.fillRect(x * scale, y * scale, scale, scale);
           drawnPixelsNoList +=1; 
            }
    }
  }
  console.log('drawnPixelsNoList', drawnPixelsNoList);
}

//Function to handle the mouse button being pushed when the 
//point is over the canvas.  
PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  //button = 0 is the main/left mouse button so this is making
  //sure that onmousedown is not referring to another mouse button
  if (downEvent.button != 0) return;
  //this function (defined below) takes the mouse event 
  //and returns position in the picture canvas
  //returns {x: y:} object 
  let pos = pointerPosition(downEvent, this.dom);

  //onDown is a function passed in above, optionally
  let onMove = onDown(pos);

  //if there is no onDown function, return? 
  if (!onMove) return;

//this is an event listener on mousemove which would pass the
//event to this function. so that's what moveEvent is and how
//the function understands moveEvent.buttons 

  let move = moveEvent => {
    //note this is buttons plural, not button
    //0 means no button or un-initialized 
    //so if a mouseup occurs, the eventListener is deactivated here?
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);

    //if the mouse goes down calculate new position
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      //i think this is if the mouse goes down but does not move,
      //then don't do anything 
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      //otherwise calculate the new position and run the 
      //onMove handler that was passed in as an argument 
      pos = newPos;
      onMove(newPos);
    }
  };
  // add an eventListener for a mousemove 
  this.dom.addEventListener("mousemove", move);
};

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale),
          y: Math.floor((pos.clientY - rect.top) / scale)};
}

PictureCanvas.prototype.touch = function(startEvent,
                                         onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0],
                                 this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};

var i = 0; 
//this is the application?
var PixelEditor = class PixelEditor {
  constructor(state, config) {
    let {tools, controls, dispatch} = config;
    this.state = state;
    //console.log('config', config);
    //console.log('tools', tools);

//PictureCanvas class takes a picture and a pointerDown fxn
    this.canvas = new PictureCanvas(state.picture, this.state.done, pos => {
      let tool = tools[this.state.tool];
      //i+=1; 
      //console.log('i>>', i, this.state);
      //console.log('tool', this.state.tool);

      //console.log('state', state);

      let onMove = tool(pos, this.state, dispatch);

      //this is the move handler 
      if (onMove) return pos => onMove(pos, this.state);
    });

   // console.log("controls before", controls); 

   //console.log('before', controls);

    this.controls = controls.map(
      Control => new Control(state, config));
    
    //console.log(this.controls);

    // console.log("this.controls after", this.controls); 

    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                   ...this.controls.reduce(
                     (a, c) => a.concat(" ", c.dom), []));


   this.dom.tabIndex = '0';

  this.dom.addEventListener("keydown", event => {
     // console.log(event.key);
      if (event.key == "f") {
           this.state.tool = 'fill';
           }
       if (event.key == "d") {
            this.state.tool = 'draw';
             }
       if (event.key == "r") {
              this.state.tool = 'rectangle';
             }
       if (event.key == "p") {
              this.state.tool = 'pick';
             }

       if (event.key == "c") {
              this.state.tool = 'circle';
             }

        if (event.key == "z" && event.ctrlKey ) {
          this.state = historyUpdateState(state, {undo: true});
             }
       this.syncState(this.state);
    }); 
  }

  syncState(state) {
    this.state = state;
    //console.log('state...line 265', state); 
    this.canvas.syncState(state.picture, state.done);
    //console.log('this.canvas.syncState', this.canvas.syncState );
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}  //end of PixelEditor class

//Create the tool select menu 
var ToolSelect = class ToolSelect {
  constructor(state, {tools, dispatch}) {
    this.select = elt("select", {
      onchange: () => dispatch({tool: this.select.value})
    }, ...Object.keys(tools).map(name => elt("option", {
      selected: name == state.tool
    }, name)));
    this.dom = elt("label", null, "Tool: ", this.select);
  }
  syncState(state) { this.select.value = state.tool; }
}

//Create color selector
var ColorSelect = class ColorSelect {
  constructor(state, {dispatch}) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({color: this.input.value})
    });
    this.dom = elt("label", null, "Color: ", this.input);
  }
  syncState(state) { this.input.value = state.color; }
}

/// Dispatches action to change pointed at pixel
// to currently selected color 
//Written as function inside function because the
//dispatch fxn will change depending on tool? 
//drawPixel is returned so it keeps on drawing
// as the mouse moves
function draw(pos, state, dispatch) {
  function drawPixel({x, y}, state) {
    let drawn = {x, y, color: state.color};
    //I think this is updating the state of the picture
    // but not actually drawing on the screen 
    dispatch({picture: state.picture.draw([drawn])});

  }
  drawPixel(pos, state);
  return drawPixel;
}

//Draw and fill a rectangle
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawRectangle(start);
  return drawRectangle;
}

var around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
                {dx: 0, dy: -1}, {dx: 0, dy: 1}];

function fill({x, y}, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{x, y, color: state.color}];
  for (let done = 0; done < drawn.length; done++) {
    for (let {dx, dy} of around) {
      let x = drawn[done].x + dx, y = drawn[done].y + dy;
      if (x >= 0 && x < state.picture.width &&
          y >= 0 && y < state.picture.height &&
          state.picture.pixel(x, y) == targetColor &&
          !drawn.some(p => p.x == x && p.y == y)) {
        drawn.push({x, y, color: state.color});
      }
    }
  }
  dispatch({picture: state.picture.draw(drawn)});
}

function pick(pos, state, dispatch) {
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
}

//Draw a circle... 

function circle(start, state, dispatch) {
  
  function drawCircle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let radius2 = Math.sqrt((Math.pow((xEnd - xStart), 2) + Math.pow((yEnd - yStart), 2)));
    let radius = xEnd - xStart; 
    console.log('radius2', radius2);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        console.log("xstart, ystart, xend, yend, radius", xStart, yStart, xEnd, yEnd, radius);
        console.log(radius2 == Math.sqrt(Math.pow((xEnd - xStart), 2) + Math.pow((yEnd - yStart), 2)));
        if (Math.pow(radius2,2) <= (Math.pow((xEnd - xStart), 2) + Math.pow((yEnd - yStart), 2))){
          drawn.push({x, y, color: state.color});
        }
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawCircle(start);
  return drawCircle;
}

var saving = false; 

var SaveButton = class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt("button", {
      onclick: () => this.save()
    }, "Save");
  }
  save() {
    let canvas = elt("canvas");
    saving = true; 
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
    saving = false; 
  }
  syncState(state) { this.picture = state.picture; }
}


var LoadButton = class LoadButton {
  constructor(_, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => startLoad(dispatch)
    }, "Load");
  }
  syncState() {}
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () => dispatch({
        picture: pictureFromImage(image)
      }),
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}

function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", {width, height});
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let {data} = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

function historyUpdateState(state, action) {
  if (action.undo == true) {
    //if there's nothing in the done array, then just return
    //otherwise return the first item in the done array which
    //(i assume) is the latest saved version of the image
    //done now equals the same array with the first item removed
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
      
    });
  // wtf is action.picture? 
  //if we are updating the state and not with an undo
  //and if more than a second has passed
  //save the latest version 
  } else if (action.picture &&
             state.doneAt < Date.now() - 1000) {
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    });

  //we are updating the state, not with an undo
  //and less than a second has passed just do the 
  //action but don't bother saving the picture 

  } else {
    return Object.assign({}, state, action);
  }
}

var UndoButton = class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => dispatch({undo: true}),
      disabled: state.done.length == 0
    }, "Undo");
  }

  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}

var startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0
};

var baseTools = {draw, fill, rectangle, pick, circle};

var baseControls = [
  ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton
];

function startPixelEditor({state = startState,
                           tools = baseTools,
                           controls = baseControls}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    }
  });
  return app.dom;
}
