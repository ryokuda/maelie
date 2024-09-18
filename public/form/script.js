// Create a Konva stage (canvas wrapper)
const stage = new Konva.Stage({
    container: 'container', // HTML container ID
    width: 800,
    height: 600
});

// Create a layer
const layer = new Konva.Layer();
stage.add(layer);

// Variables to store drawing state and lines
let isDrawing = false;
let isErasing = false;
let currentLine = null; // Initialization

// Initial setup: Disable text input mode
document.getElementById('textArea').style.pointerEvents = 'none';

// Add mousedown event listener to the stage
stage.on('mousedown', function() {
    if (isErasing) {
        // If in eraser mode, erase line on click
        eraseLineAtClick(stage.getPointerPosition());
        return;
    }

    if (!isDrawing) return; // Do nothing if not in drawing mode
    console.log('down');

    const pos = stage.getPointerPosition(); // Get current mouse position

    // Create a new line
    currentLine = new Konva.Line({
        stroke: 'black', // Line color
        strokeWidth: 1, // Line width
        points: [pos.x, pos.y], // Initial points
        lineCap: 'round',
        lineJoin: 'round'
    });

    // Add to layer
    layer.add(currentLine);
    layer.batchDraw(); // Redraw the layer
});

// Add mouseup event listener to the stage
stage.on('mouseup', function() {
    if (!isDrawing) return; // Do nothing if not in drawing mode
    console.log('up');
    currentLine = null; // Reset currentLine
});

// Add mousemove event listener to the stage
stage.on('mousemove', function() {
    if (isErasing) return; // Do nothing in eraser mode

    if (!isDrawing || !currentLine) return; // Do nothing if not in drawing mode or no currentLine

    const pos = stage.getPointerPosition(); // Get current mouse position
    const newPoints = currentLine.points().concat([pos.x, pos.y]); // Add points

    // Update line points
    currentLine.points(newPoints);
    layer.batchDraw(); // Redraw the layer
});

// Draw the layer
layer.draw();

// Function to enable text input mode
function enableTextMode() {
    const textArea = document.getElementById('textArea');
    textArea.style.pointerEvents = 'auto'; // Enable text area interaction
    textArea.focus(); // Focus on text area
    isDrawing = false; // Disable drawing mode
    isErasing = false; // Disable eraser mode
    stage.container().style.cursor = 'default'; // Reset cursor to default
}

// Function to enable drawing mode
function enableDrawMode() {
    const textArea = document.getElementById('textArea');
    textArea.style.pointerEvents = 'none'; // Disable text area interaction
    isDrawing = true; // Enable drawing mode
    isErasing = false; // Disable eraser mode
    stage.container().style.cursor = 'crosshair'; // Set cursor to crosshair
}

// Function to enable eraser mode
function enableEraserMode() {
    const textArea = document.getElementById('textArea');
    textArea.style.pointerEvents = 'none'; // Disable text area interaction
    isDrawing = false; // Disable drawing mode
    isErasing = true; // Enable eraser mode
    stage.container().style.cursor = 'pointer'; // Set cursor to pointer
}

// Function to erase the line at the clicked position
function eraseLineAtClick(pos) {
    // Get all line objects
    const shapes = Array.from(layer.getChildren()); // Convert to array
    shapes.forEach((shape) => {
        if (shape instanceof Konva.Line) {
            const box = shape.getClientRect(); // Get the bounding box of the line
            if (
                pos.x >= box.x &&
                pos.x <= box.x + box.width &&
                pos.y >= box.y &&
                pos.y <= box.y + box.height
            ) {
                shape.destroy(); // Delete the line
                layer.batchDraw(); // Redraw the layer
                return; // Stop after deleting one line
            }
        }
    });
}
