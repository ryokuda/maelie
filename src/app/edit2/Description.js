'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const Description = ({ description, setDescription, konva, setKonva }) => {
  const [tool, setTool] = useState('text'); // 'pen', 'eraser', or 'text'
  const stageRef = useRef(null); // Stageの参照を保存
  const textAreaRef = useRef(null); // Textareaの参照
  const isDrawing = useRef(false); // 現在描画中かどうかのフラグ

  // 描画開始時のイベントハンドラー (タッチとマウスの両方をサポート)
  const handlePointerDown = (e) => {
    if (tool !== 'pen') return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLines = [...konva, { tool: 'pen', points: [pos.x, pos.y], strokeWidth: 1 }];
    setKonva(newLines); // konvaに線を追加
  };

  // 描画中のイベントハンドラー (タッチとマウスの両方をサポート)
  const handlePointerMove = (e) => {
    if (!isDrawing.current || tool !== 'pen') return;

    const pos = e.target.getStage().getPointerPosition();
    const lastLine = konva[konva.length - 1];
    lastLine.points = lastLine.points.concat([pos.x, pos.y]);

    const newLines = [...konva.slice(0, konva.length - 1), lastLine];
    setKonva(newLines); // 描画中の線を更新
  };

  // 描画終了時のイベントハンドラー
  const handlePointerUp = () => {
    if (tool !== 'pen') return;
    isDrawing.current = false;
  };

  // テキストエリアの内容が変更されたときに状態を更新
  const handleTextChange = (e) => {
    setDescription(e.target.value); // description（文字列型）を更新
  };

  // Eraserボタンが押されたとき、クリック位置の近くの線を削除
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
          return false; // 削除対象の線を見つけて削除
        }
      }
      return true;
    });

    setKonva(updatedLines); // konvaから線を削除
  };

  // Appから渡されたdescriptionの内容でtextareaを初期化
  useEffect(() => {
    textAreaRef.current.value = description;
  }, [description]);

  const textareaCols = 40;
  const textareaRows = 8;
  const canvasWidth = textareaCols * 10; // cols * 10px
  const canvasHeight = textareaRows * 20; // rows * 20px

  return (
    <div>
      <div className="btn-group" style={{ marginBottom: '10px' }}>
        <button className={tool === 'text' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setTool('text')}>Text</button>
        <button className={tool === 'pen' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setTool('pen')}>Pen</button>
        <button className={tool === 'eraser' ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setTool('eraser')}>Eraser</button>
        <button className="btn btn-outline-dark" onClick={() => { setDescription(''); setKonva([]); }}>Clear</button> {/* 状態をリセット */}
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
            zIndex: tool === 'text' ? 1 : -1,
            border: 'none',
            outline: 'none',
            fontSize: '20px',
            resize: 'none',
            overflow: 'hidden',
          }}
          onChange={handleTextChange} // テキスト変更時に反映
          placeholder="Type here..."
        />
      </div>
    </div>
  );
};

export default Description;
