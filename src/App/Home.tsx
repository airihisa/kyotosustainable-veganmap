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
    
    const matchStl = styles.length === 0 || styles.some((s: any) => 
      shop['スタイル'] && shop['スタイル'].includes(s.value)
    );

    return matchCat && matchLvl && matchStl;
  });

  // スタイルの選択肢を生成
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

  // react-select のカスタムスタイル設定
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '30px', // カプセル型
      border: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)', // 立体感のある影
      padding: '2px 10px',
      fontSize: '13px',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255, 255, 255, 0.95)', // 地図が透ける透明感
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#333',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '13px',
      backgroundColor: state.isSelected ? '#da402e' : state.isFocused ? '#fdecea' : 'white',
      color: state.isSelected ? 'white' : '#333',
      '&:active': {
        backgroundColor: '#da402e',
      }
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#da402e', // チップの背景色
      borderRadius: '15px',
      padding: '2px 8px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'white',
      fontWeight: 'bold',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.1)',
        color: 'white',
      },
    }),
    indicatorSeparator: () => ({ display: 'none' }), // 区切り線を消してスッキリ
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 絞り込みコントロールエリア */}
      <div style={{
        position: 'absolute', top: '20px', left: '15px', right: '15px', 
        zIndex: 10, display: 'flex', gap: '10px', flexDirection: 'column'
      }}>
        
        {/* 上段：カテゴリとレベルを横並び */}
        <div style={{ display: 'flex', gap: '10px' }}>
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
              placeholder="レベル" 
              isClearable 
              options={getOptions('ヴィーガンレベル')} 
              onChange={setLevel} 
              styles={customStyles}
              isSearchable={false}
            />
          </div>
        </div>
        
        {/* 下段：スタイル（複数選択） */}
        <Select 
          isMulti 
          placeholder="スタイルを選択" 
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
