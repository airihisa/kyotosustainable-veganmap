import React from "react";
import Map from "./Map";
import Select from 'react-select';

type Props = {
  data: Pwamap.ShopData[];
}

const Content = (props: Props) => {
  const [category, setCategory] = React.useState<any>(null);
  const [level, setLevel] = React.useState<any>(null);
  const [styles, setStyles] = React.useState<any>([]);

  // フィルタリング処理
  const filteredData = props.data.filter((shop: any) => {
    const matchCat = !category || shop['カテゴリ'] === category.value;
    const matchLvl = !level || shop['ヴィーガンレベル'] === level.value;
    const matchStl = styles.length === 0 || styles.some((s: any) => 
      shop['スタイル'] && shop['スタイル'].includes(s.value)
    );
    return matchCat && matchLvl && matchStl;
  });

  // スタイルの選択肢生成
  const getStyleOptions = () => {
    const allStyles = new Set<string>();
    props.data.forEach((item: any) => {
      if (item['スタイル']) {
        item['スタイル'].split(',').forEach((s: string) => allStyles.add(s.trim()));
      }
    });
    return Array.from(allStyles).map(v => ({ value: v, label: v }));
  };

  const getOptions = (key: string) => {
    const uniqueValues = Array.from(new Set(props.data.map((item: any) => item[key]).filter(Boolean)));
    return uniqueValues.map(v => ({ value: v, label: v }));
  };

  const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '0px',
    border: 'none',
    // 下線のみ、かつ細くして洗練させる
    borderBottom: state.isFocused ? '1px solid #000000' : '1px solid #E0E0E0',
    boxShadow: 'none',
    minHeight: '40px', // 高さを出して余白を確保
    fontSize: '11px',  // 9pxだと可読性が下がる場合があるため、少し上げてカーニング(letterSpacing)で調整
    fontWeight: '600',
    backgroundColor: 'transparent', // 透過させて地図や背景と馴染ませる
    letterSpacing: '0.1em', // 文字間隔を広げるのがBRUTUS風の鉄則
    cursor: 'pointer',
    '&:hover': {
      borderBottom: '1px solid #000000',
    }
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 4px',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#000000',
    opacity: 0.3, // 薄くして「背景」にする
  }),
  // ...（他はモノトーンを維持）
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#fafafa',
    borderRadius: '0px',
    border: '1px solid #000000',
    boxShadow: '10px 10px 0px rgba(0,0,0,0.03)', // よりフラットで大きな影
    zIndex: 100,
  }),
};

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '15px', left: '15px', right: '15px', 
        zIndex: 10, display: 'flex', gap: '8px', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <Select 
              placeholder="カテゴリ" 
              isClearable 
              options={getOptions('カテゴリ')} 
              onChange={setCategory} 
              styles={customStyles}
              isSearchable={false}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select 
              placeholder="ヴィーガンレベル" 
              isClearable 
              options={getOptions('ヴィーガンレベル')} 
              onChange={setLevel} 
              styles={customStyles}
              isSearchable={false}
            />
          </div>
        </div>
        <Select 
          isMulti 
          placeholder="スタイルを選択（複数可）" 
          isClearable 
          options={getStyleOptions()} 
          onChange={setStyles} 
          styles={customStyles}
          isSearchable={false}
        />
      </div>
      <Map data={filteredData} />
    </div>
  );
};

export default Content;
