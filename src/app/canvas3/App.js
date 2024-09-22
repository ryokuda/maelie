'use client';

import React, { useState, useRef } from 'react';
import Description from './Description'; // 新しく作成するDescriptionコンポーネントをインポート

const App = () => {
  const descriptionRef = useRef(null); // Descriptionコンポーネントの参照を保存

  // Saveボタンが押されたときに、Descriptionコンポーネントからデータを取得してJSONを作成
  const handleSaveClick = () => {
    const descriptionData = descriptionRef.current.getData(); // Descriptionからデータを取得
    const jsonData = {
      text: descriptionData.text,  // textareaの内容
      konva: descriptionData.konva // canvas上の線のデータ
    };
    console.log(JSON.stringify(jsonData, null, 2)); // JSONを整形して出力
  };

  return (
    <div>
      <Description ref={descriptionRef} /> {/* Descriptionコンポーネントを呼び出し */}
      <button onClick={handleSaveClick}>Save</button> {/* Saveボタン */}
    </div>
  );
};

export default App;
