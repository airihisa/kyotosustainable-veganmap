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
      borderRadius: '0px', // 完全に角を落としてグリッド感を強調
      border: 'none',
      borderBottom: state.isFocused ? '1.5px solid #000000' : '1.5px solid #000000', // 下線のみでミニマルに
      boxShadow: 'none',
      minHeight: '30px',
      height: '30px',
      fontSize: '9px',
      fontWeight: '700', // 雑誌のようにウェイトを重く
      backgroundColor: '#fafafa',
      cursor: 'pointer',
      letterSpacing: '0.05em',
      '&:hover': { borderBottom: '1.5px solid #da402e' } // ホバーでアクセント
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 4px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#000000',
      textTransform: 'uppercase', // 英語表記などがあれば大文字でスタイリッシュに
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#000000',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '9px',
      fontWeight: '700',
      backgroundColor: state.isSelected ? '#000000' : state.isFocused ? '#eeeeee' : '#fafafa',
      color: state.isSelected ? '#ffffff' : '#000000',
      cursor: 'pointer',
      padding: '12px 16px',
      borderBottom: '0.5px solid #eee',
      transition: 'all 0.2s ease',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#000000',
      borderRadius: '0px',
      margin: '2px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      fontSize: '8px',
      fontWeight: '700',
      padding: '2px 8px',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      '&:hover': { backgroundColor: '#da402e', color: '#ffffff' },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#fafafa',
      borderRadius: '0px',
      border: '1.5px solid #000000', // 枠線を太くして存在感を出す
      boxShadow: '8px 8px 0px rgba(0,0,0,0.05)', // フラットな影
      marginTop: '4px',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#000000',
      padding: '2px',
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: '#000000',
      padding: '2px',
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
