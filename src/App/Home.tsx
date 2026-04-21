import React from "react";
import Map from "./Map";
import Select from 'react-select';

type Props = {
  data: Pwamap.ShopData[];
}

const Content = (props: Props) => {
  const [category, setCategory] = React.useState<any>(null);
  const [level, setLevel] = React.useState<any>(null);
  const [styles, setStyles] = React.useState<any>([]); // 複数選択のため配列で管理

  // フィルタリング処理
  const filteredData = props.data.filter((shop: any) => {
    const matchCat = !category || shop['カテゴリ'] === category.value;
    const matchLvl = !level || shop['ヴィーガンレベル'] === level.value;
    
    // スタイルの複数選択判定
    // 選択されたスタイルのいずれかが、ショップの「スタイル」文字列に含まれているか確認
    const matchStl = styles.length === 0 || styles.some((s: any) => 
      shop['スタイル'] && shop['スタイル'].includes(s.value)
    );

    return matchCat && matchLvl && matchStl;
  });

  // スタイルの選択肢を生成（コンマ区切りを分解して重複を排除）
  const getStyleOptions = () => {
    const allStyles = new Set<string>();
    props.data.forEach((item: any) => {
      if (item['スタイル']) {
        // 「Eat-in, Shopping」を「Eat-in」と「Shopping」に切り分けてトリミング
        item['スタイル'].split(',').forEach((s: string) => allStyles.add(s.trim()));
      }
    });
    return Array.from(allStyles).map(v => ({ value: v, label: v }));
  };

  const getOptions = (key: string) => {
    const uniqueValues = Array.from(new Set(props.data.map((item: any) => item[key]).filter(Boolean)));
    return uniqueValues.map(v => ({ value: v, label: v }));
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '10px', left: '10px', right: '10px', 
        zIndex: 10, display: 'flex', gap: '5px', flexDirection: 'column'
      }}>
        <Select placeholder="カテゴリ" isClearable options={getOptions('カテゴリ')} onChange={setCategory} />
        <Select placeholder="ヴィーガンレベル" isClearable options={getOptions('ヴィーガンレベル')} onChange={setLevel} />
        
        {/* isMulti を追加して複数選択を可能にする */}
        <Select 
          isMulti 
          placeholder="スタイル（複数選択可）" 
          isClearable 
          options={getStyleOptions()} 
          onChange={setStyles} 
        />
      </div>

      <Map data={filteredData} />
    </div>
  );
};

export default Content;
