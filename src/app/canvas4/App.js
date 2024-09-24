'use client';

import React, { useState } from 'react';
import Description from './Description'; // Descriptionコンポーネントをインポート

const App = () => {
  const [description, setDescription] = useState(''); // textareaの内容（文字列型）
  const [konva, setKonva] = useState([]); // canvasの描画データ（線の配列）

  // Saveボタンが押されたときに、状態変数descriptionとkonvaをコンソールに出力
  const handleSaveClick = () => {
    console.log({ text: description, konva }); // descriptionとkonvaの内容をコンソールに出力
  };

  return (
    <div>
      {/* descriptionの状態とsetDescription、konvaの状態とsetKonvaをDescriptionコンポーネントに渡す */}
      <Description description={description} setDescription={setDescription} konva={konva} setKonva={setKonva} />
      <button onClick={handleSaveClick}>Save</button> {/* Saveボタン */}
    </div>
  );
};

export default App;
