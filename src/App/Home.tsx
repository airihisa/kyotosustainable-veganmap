import React from "react";
import Map from "./Map";
import Select from 'react-select';

type Props = {
  data: Pwamap.ShopData[];
}

const Content = (props: Props) => {
  const [category, setCategory] = React.useState<any>(null);
  const [level, setLevel] = React.useState<any>(null);
  const [style, setStyle] = React.useState<any>(null);

  // フィルタリング処理： shopをany型と明示してエラーを回避
  const filteredData = props.data.filter((shop: any) => {
    const matchCat = !category || shop['カテゴリ'] === category.value;
    const matchLvl = !level || shop['ヴィーガンレベル'] === level.value;
    const matchStl = !style || shop['スタイル'] === style.value;
    return matchCat && matchLvl && matchStl;
  });

  // 選択肢の生成： itemをany型と明示してエラーを回避
  const getOptions = (key: string) => {
    const uniqueValues = Array.from(new Set(props.data.map((item: any) => item[key]).filter(Boolean)));
    return uniqueValues.map(v => ({ value: v, label: v }));
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* おでかけわんこ部風のフィルター配置 */}
      <div style={{
        position: 'absolute', top: '10px', left: '10px', right: '10px', 
        zIndex: 10, display: 'flex', gap: '5px', flexDirection: 'column'
      }}>
        <Select placeholder="カテゴリ" isClearable options={getOptions('カテゴリ')} onChange={setCategory} />
        <Select placeholder="ヴィーガンレベル" isClearable options={getOptions('ヴィーガンレベル')} onChange={setLevel} />
        <Select placeholder="スタイル" isClearable options={getOptions('スタイル')} onChange={setStyle} />
      </div>

      {/* フィルタ後のデータをMapに渡す */}
      <Map data={filteredData} />
    </div>
  );
};

export default Content;
