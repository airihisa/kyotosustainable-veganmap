import React from "react";
import Map from "./Map";
import Select from 'react-select'; // react-selectを使用

type Props = {
  data: Pwamap.ShopData[];
}

const Content = (props: Props) => {
  // それぞれの選択状態を管理するState
  const [category, setCategory] = React.useState<any>(null);
  const [level, setLevel] = React.useState<any>(null);
  const [style, setStyle] = React.useState<any>(null);

  // 3つの条件すべてに合致するデータだけを抽出（リアルタイム絞り込み）
  const filteredData = props.data.filter(shop => {
    const matchCat = !category || shop['カテゴリ'] === category.value;
    const matchLvl = !level || shop['ヴィーガンレベル'] === level.value;
    const matchStl = !style || shop['スタイル'] === style.value;
    return matchCat && matchLvl && matchStl;
  });

  // スプレッドシートの列から選択肢を自動生成する関数
  const getOptions = (key: string) => {
    const uniqueValues = Array.from(new Set(props.data.map(item => item[key]).filter(Boolean)));
    return uniqueValues.map(v => ({ value: v, label: v }));
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 画面上部のフィルターエリア（おでかけわんこ部風の配置） */}
      <div style={{
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        right: '10px', 
        zIndex: 10, 
        display: 'flex', 
        gap: '8px', // セレクトボックス同士の間隔
        flexWrap: 'wrap' // スマホで溢れたら改行
      }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <Select placeholder="カテゴリ" isClearable options={getOptions('カテゴリ')} onChange={setCategory} />
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <Select placeholder="レベル" isClearable options={getOptions('ヴィーガンレベル')} onChange={setLevel} />
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <Select placeholder="スタイル" isClearable options={getOptions('スタイル')} onChange={setStyle} />
        </div>
      </div>

      {/* 絞り込まれたデータだけをMapに渡す */}
      <Map data={filteredData} />
    </div>
  );
};

export default Content;
