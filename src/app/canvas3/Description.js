'use client';

import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const Description = forwardRef((props, ref) => {
  const [tool, setTool] = useState('text'); // 'pen', 'eraser', or 'text'
  const [lines, setLines] = useState([]); // 描画された線のリスト
  const [lineWidth, setLineWidth] = useState(1); // ペンや消しゴムの幅
  const [isTextMode, setIsTextMode] = useState(true); // Textモードかどうか
  const stageRef = useRef(null); // Stageの参照を保存
  const isDrawing = useRef(false); // 現在描画中かどうかのフラグ
  const textAreaRef = useRef(null); // Textareaの参照

  // 描画開始時のイベントハンドラー (タッチとマウスの両方をサポート)
  const handlePointerDown = (e) => {
    if (tool === 'pen') {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y], strokeWidth: lineWidth }]);
    } else if (tool === 'eraser') {
      const pos = e.target.getStage().getPointerPosition();
      const updatedLines = [...lines];
      for (let i = 0; i < updatedLines.length; i++) {
        const line = updatedLines[i];
        const points = line.points;
        for (let j = 0; j < points.length; j += 2) {
          const x = points[j];
          const y = points[j + 1];
          const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
          if (distance <= 8) {
            updatedLines.splice(i, 1); // 最初に見つけた線を削除
            setLines(updatedLines);
            return;
          }
        }
      }
    }
  };

  // 描画中のイベントハンドラー (タッチとマウスの両方をサポート)
  const handlePointerMove = (e) => {
    if (!isDrawing.current || tool === 'text') return;

    const pos = e.target.getStage().getPointerPosition();

    if (tool === 'pen') {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([pos.x, pos.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  // 描画終了時のイベントハンドラー (タッチとマウスの両方をサポート)
  const handlePointerUp = () => {
    if (tool === 'pen') {
      isDrawing.current = false;
    }
  };

  // ペンモードに変更
  const handlePenClick = () => {
    setTool('pen');
    setLineWidth(1); // ペン幅を1pxに設定
    setIsTextMode(false);
    textAreaRef.current.style.zIndex = -1;
  };

  // 消しゴムモードに変更
  const handleEraserClick = () => {
    setTool('eraser');
    setLineWidth(16); // 消しゴム幅を16pxに設定
    setIsTextMode(false);
    textAreaRef.current.style.zIndex = -1;
  };

  // テキストモードに変更
  const handleTextClick = () => {
    setTool('text');
    setIsTextMode(true);
    textAreaRef.current.style.zIndex = 1;
  };

  // 全消去
  const handleClearClick = () => {
    setLines([]);
    textAreaRef.current.value = ''; // テキストエリアの内容もクリア
  };

  // 外部からデータを取得できるようにする
  useImperativeHandle(ref, () => ({
    getData: () => ({
      text: textAreaRef.current.value,
      konva: lines
    })
  }));

  // textareaのサイズに基づいてcanvasのサイズを設定
  const textareaCols = 40;
  const textareaRows = 8;
  const canvasWidth = textareaCols * 10; // cols * 10px
  const canvasHeight = textareaRows * 20; // rows * 20px

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleTextClick}>Text</button>
        <button onClick={handlePenClick}>Pen</button>
        <button onClick={handleEraserClick}>Eraser</button>
        <button onClick={handleClearClick}>Clear</button>
      </div>

      <div style={{ position: 'relative' }}>
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: '1px solid black', backgroundColor: 'transparent' }}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchEnd={handlePointerUp}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.tool === 'pen' ? 'black' : 'white'}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
              />
            ))}
          </Layer>
        </Stage>

        <textarea
          ref={textAreaRef}
          rows={textareaRows} // rowsを設定
          cols={textareaCols} // colsを設定
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            backgroundColor: 'transparent',
            color: 'black',
            zIndex: isTextMode ? 1 : -1,
            border: 'none',
            outline: 'none',
            fontSize: '20px',
            resize: 'none',
            overflow: 'hidden',
          }}
          placeholder="Type here..."
        />
      </div>
    </div>
  );
});

export default Description;
