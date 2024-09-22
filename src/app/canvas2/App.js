'use client';

import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const App = () => {
  const [tool, setTool] = useState('text'); // 'pen', 'eraser', or 'text'
  const [lines, setLines] = useState([]); // 描画された線のリスト
  const [lineWidth, setLineWidth] = useState(1); // ペンや消しゴムの幅
  const [cursorStyle, setCursorStyle] = useState('default'); // カーソルスタイル
  const [isTextMode, setIsTextMode] = useState(true); // Textモードかどうか
  const stageRef = useRef(null); // Stageの参照を保存
  const isDrawing = useRef(false); // 現在描画中かどうかのフラグ
  const textAreaRef = useRef(null); // Textareaの参照

  // 描画開始時のイベントハンドラー（ペンモード時）
  const handleMouseDown = (e) => {
    if (tool === 'pen') {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y], strokeWidth: lineWidth }]);
    } else if (tool === 'eraser') {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();

      // 線が消しゴム範囲内にあるかどうかを判断して最初の1本だけ消す
      const updatedLines = [...lines];
      for (let i = 0; i < updatedLines.length; i++) {
        const line = updatedLines[i];
        const points = line.points;
        for (let j = 0; j < points.length; j += 2) {
          const x = points[j];
          const y = points[j + 1];
          const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
          if (distance <= 8) {
            updatedLines.splice(i, 1); // 最初に見つけた線を削除
            setLines(updatedLines);
            return; // 1本だけ削除するのでループを抜ける
          }
        }
      }
    }
  };

  // 描画中のイベントハンドラー
  const handleMouseMove = (e) => {
    if (!isDrawing.current || tool === 'text') return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'pen') {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      // 描画中の線を更新
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  // 描画終了時のイベントハンドラー
  const handleMouseUp = () => {
    if (tool === 'pen') {
      isDrawing.current = false;
    }
  };

  // ペンモードに変更
  const handlePenClick = () => {
    setTool('pen');
    setLineWidth(1); // ペン幅を1pxに設定
    setCursorStyle('default'); // 通常のカーソルに戻す
    setIsTextMode(false); // Textモードを終了
    textAreaRef.current.style.zIndex = -1; // Textareaを後ろに
  };

  // 消しゴムモードに変更
  const handleEraserClick = () => {
    setTool('eraser');
    setLineWidth(16); // 消しゴム幅を16pxに設定
    setCursorStyle('none'); // カーソルを非表示にし、カスタムカーソルを使う
    setIsTextMode(false); // Textモードを終了
    textAreaRef.current.style.zIndex = -1; // Textareaを後ろに
  };

  // テキストモードに変更
  const handleTextClick = () => {
    setTool('text');
    setIsTextMode(true); // Textモードに設定
    textAreaRef.current.style.zIndex = 1; // Textareaを最前面に
  };

  // 全消去
  const handleClearClick = () => {
    setLines([]);
  };

  // 描画パスを保存
  const handleSaveClick = () => {
    const textData = textAreaRef.current.value; // textareaの内容を取得
    const jsonData = {
      text: textData,       // textareaの内容
      konva: lines          // canvas上の線のデータ
    };
    console.log(JSON.stringify(jsonData, null, 2)); // JSONを整形して出力
  };

  // カーソルの描画
  const handleCursorMove = (e) => {
    if (tool === 'eraser') {
      const cursor = document.getElementById('eraser-cursor');
      if (cursor) {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        cursor.style.left = `${point.x - 8}px`; // 消しゴムの中心にカーソルを合わせる
        cursor.style.top = `${point.y - 8}px`;
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleTextClick}>Text</button>
        <button onClick={handlePenClick}>Pen</button>
        <button onClick={handleEraserClick}>Eraser</button>
        <button onClick={handleClearClick}>Clear</button>
        <button onClick={handleSaveClick}>Save</button>
      </div>

      {/* Konva Stageを使って描画領域を作成 */}
      <div style={{ position: 'relative' }}>
        <Stage
          width={800}
          height={800}
          style={{ border: '1px solid black', backgroundColor: 'transparent', cursor: cursorStyle }}
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => { handleMouseMove(e); handleCursorMove(e); }}
          onMouseUp={handleMouseUp}
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

        {/* 消しゴムモードのときに円形のカーソルを表示 */}
        {tool === 'eraser' && (
          <div
            id="eraser-cursor"
            style={{
              position: 'absolute',
              width: '16px',
              height: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '50%',
              pointerEvents: 'none', // クリック操作を無効化
            }}
          ></div>
        )}

        {/* textareaをCanvasと重なるように配置 */}
        <textarea
          ref={textAreaRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '800px',
            height: '800px',
            backgroundColor: 'transparent',
            color: 'black',
            zIndex: isTextMode ? 1 : -1, // Textモードのときは最前面に表示
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
};

export default App;
