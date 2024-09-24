'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const Description = ({ description, setDescription, konva, setKonva }) => {
  const [tool, setTool] = useState('text'); // 'pen', 'eraser', or 'text'
  const stageRef = useRef(null); // Save the reference of the Stage
  const textAreaRef = useRef(null); // Save the reference of the Textarea
  const isDrawing = useRef(false); // Flag to track if drawing is in progress

  // Event handler for the start of drawing (supports both touch and mouse)
  const handlePointerDown = (e) => {
    if (tool !== 'pen') return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLines = [...konva, { tool: 'pen', points: [pos.x, pos.y], strokeWidth: 1 }];
    setKonva(newLines); // Add line to konva
  };

  // Event handler for drawing (supports both touch and mouse)
  const handlePointerMove = (e) => {
    if (!isDrawing.current || tool !== 'pen') return;

    const pos = e.target.getStage().getPointerPosition();
    const lastLine = konva[konva.length - 1];
    lastLine.points = lastLine.points.concat([pos.x, pos.y]);

    const newLines = [...konva.slice(0, konva.length - 1), lastLine];
    setKonva(newLines); // Update the line being drawn
  };

  // Event handler for ending drawing
  const handlePointerUp = () => {
    if (tool !== 'pen') return;
    isDrawing.current = false;
  };

  // Update the state when the content of the textarea is changed
  const handleTextChange = (e) => {
    setDescription(e.target.value); // Update description (string type)
  };

  // Handle eraser mode: remove the line closest to the click position
  const handleEraserClick = (e) => {
    if (tool !== 'eraser') return;

    const pos = e.target.getStage().getPointerPosition();
    const updatedLines = konva.filter((line) => {
      const points = line.points;
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i + 1];
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance <= 8) {
          return false; // Remove the line if it is within the eraser's range
        }
      }
      return true;
    });

    setKonva(updatedLines); // Remove the line from konva
  };

  // Initialize textarea with the content passed from the App component
  useEffect(() => {
    textAreaRef.current.value = description;
  }, [description]);

  const textareaCols = 40;
  const textareaRows = 25;
  const canvasWidth = textareaCols * 10; // cols * 10px
  const canvasHeight = textareaRows * 20; // rows * 20px

  return (
    <div>
      <div className="btn-group" style={{ marginBottom: '10px' }}>
        <button className={tool === 'text' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setTool('text')}>Text</button>
        <button className={tool === 'pen' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setTool('pen')}>Pen</button>
        <button className={tool === 'eraser' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setTool('eraser')}>Eraser</button>
        <button className="btn btn-outline-dark" onClick={() => { setDescription(''); setKonva([]); }}>Clear</button> {/* Reset the state */}
      </div>

      <div style={{ position: 'relative' }}>
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: '1px solid black', backgroundColor: 'transparent' }}
          onMouseDown={tool === 'pen' ? handlePointerDown : tool === 'eraser' ? handleEraserClick : null}
          onTouchStart={tool === 'pen' ? handlePointerDown : tool === 'eraser' ? handleEraserClick : null}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchEnd={handlePointerUp}
          ref={stageRef}
        >
          <Layer>
            {konva.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="black"
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
              />
            ))}
          </Layer>
        </Stage>

        <textarea
          ref={textAreaRef}
          rows={textareaRows} // Set rows
          cols={textareaCols} // Set cols
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            backgroundColor: 'transparent',
            color: 'black',
            zIndex: tool === 'text' ? 1 : -1,
            border: 'none',
            outline: 'none',
            fontSize: '20px',
            resize: 'none',
            overflow: 'hidden',
          }}
          onChange={handleTextChange} // Reflect text changes
          placeholder="Type here..."
        />
      </div>
    </div>
  );
};

export default Description;
