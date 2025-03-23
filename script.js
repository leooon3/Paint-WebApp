// Function to initialize the canvas for high resolution
var el = document.getElementById('c');
var ctx = el.getContext('2d');
function setupCanvas() {

  const dpr = window.devicePixelRatio || 1; // Get device pixel ratio
  const width = 800; // Your desired width
  const height = 500; // Your desired height

  // Set canvas width and height to dpr scaled size for better rendering
  el.width = width * dpr;
  el.height = height * dpr;

  // Scale the context for high-definition rendering
  ctx.scale(dpr, dpr);

  // Optional: Draw a grid to check the resolution
  drawGrid(ctx, 2);
}

// Call this function to set up the canvas with high resolution
setupCanvas();


var isDrawing = false;
// Set stroke properties for better visibility
ctx.strokeStyle = "black";  // Line color
ctx.lineWidth = 2;          // Line thickness
ctx.lineJoin = "round";     // Smooth joints
ctx.lineCap = "round";      // Rounded stroke edges
    // Rounded stroke edges

// Undo/Redo stacks
var undoStack = [];
var redoStack = [];



function drawGrid(ctx, size) {
  for (let x = 0; x < ctx.canvas.width; x += size) {
      for (let y = 0; y < ctx.canvas.height; y += size) {
          ctx.fillStyle = (x / size + y / size) % 2 === 0 ? "#ddd" : "#fff";
          ctx.fillRect(x, y, size, size);
      }
  }
}



function getMousePos(e) {
  var rect = el.getBoundingClientRect();
  var scaleX = el.width / rect.width;  // Scale factor in X (scaled canvas width)
  var scaleY = el.height / rect.height; // Scale factor in Y (scaled canvas height)

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

el.onmousedown = function(e) {
  isDrawing = true;
  let pos = getMousePos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  // Save the initial state when drawing starts
  saveStateToUndo();
};

el.onmousemove = function(e) {
  if (isDrawing) {
    let pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
};

el.onmouseup = function() {
  isDrawing = false;
};





const thicknessSlider = document.getElementById('thicknessSlider');
        // Update pencil thickness when slider changes
thicknessSlider.addEventListener('input', function () {
  ctx.lineWidth = parseInt(this.value, 10);
});






// Function to save the canvas state to the undo stack
function saveStateToUndo() {
  undoStack.push(el.toDataURL());  // Save current state as image
  if (undoStack.length > 10) {  // Limit the stack size (optional)
    undoStack.shift();  // Remove the oldest state if over limit
  }
  redoStack = [];  // Clear the redo stack on new action
}

// Undo functionality
function undo() {
  if (undoStack.length > 0) {
    let state = undoStack.pop();
    redoStack.push(el.toDataURL());  // Save current state for redo
    let img = new Image();
    img.src = state;
    img.onload = () => {
      ctx.clearRect(0, 0, el.width, el.height);  // Clear the canvas before drawing the previous state
      ctx.drawImage(img, 0, 0);  // Restore the previous state
    };
  }
}

// Redo functionality
function redo() {
  if (redoStack.length > 0) {
    let state = redoStack.pop();
    undoStack.push(el.toDataURL());  // Save current state for undo
    let img = new Image();
    img.src = state;
    img.onload = () => {
      ctx.clearRect(0, 0, el.width, el.height);  // Clear the canvas before drawing the next state
      ctx.drawImage(img, 0, 0);  // Restore the next state
    };
  }
}

// Function to clear the canvas
document.getElementById('clearBtn').onclick = function() {
  ctx.clearRect(0, 0, el.width, el.height);
  undoStack = [];  // Clear undo stack on reset
  redoStack = [];  // Clear redo stack on reset
  drawGrid(ctx,2);
};

// Undo button event
document.getElementById('undoBtn').onclick = function() {
  undo();
};

// Redo button event
document.getElementById('redoBtn').onclick = function() {
  redo();
};




var brushButton = document.getElementById("brushes_tab");
var brushDropdown = document.getElementById("brushDropdown");

// Toggle dropdown visibility
brushButton.onclick = function () {
    brushDropdown.style.display = (brushDropdown.style.display === "block") ? "none" : "block";
};

// Set brush size when clicking an option
document.querySelectorAll(".brush-option").forEach(button => {
    button.addEventListener("click", function () {
        let size = this.getAttribute("data-size");
        ctx.lineWidth = size; // Change brush size
        brushDropdown.style.display = "none"; // Hide dropdown after selection
    });
});
// Close dropdown if clicking outside
document.addEventListener("click", function (event) {
    if (!brushButton.contains(event.target) && !brushDropdown.contains(event.target)) {
        brushDropdown.style.display = "none";
    }
});



var downloadButton=document.getElementById("download_tab");
var downloadDropdown = document.getElementById("downloadDropdown");

downloadButton.onclick = function (){
  downloadDropdown.style.display = (downloadDropdown.style.display === "block") ? "none" : "block";
}
document.addEventListener("click", function (event) {
  if (!downloadButton.contains(event.target) && !downloadDropdown.contains(event.target)) {
      downloadDropdown.style.display = "none";
  }
});

document.querySelectorAll(".download-option").forEach(button => {
  button.addEventListener("click", function () {
      let format = this.getAttribute("value");
      document.getElementById("downloadBtn").addEventListener("click", function (){
        let link=document.createElement("a");
        link.download=`drawing.${format}`;
        link.href=el.toDataURL(`image/${format}`);
        link.click();
        downloadDropdown.style.display = "none";
      }); // Hide dropdown after selection
  });
});