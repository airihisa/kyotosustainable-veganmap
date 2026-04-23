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

  // react-select のカスタムスタイル（モノトーン・スタイリッシュ）
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '2px', // よりシャープな角に
      border: state.isFocused ? '1px solid #000000' : '1px solid #E0E0E0',
      boxShadow: 'none',
      minHeight: '28px',
      height: '28px',
      fontSize: '9px',
      fontWeight: '600', // 文字を少し太くして視認性を確保
      backgroundColor: '#fafafa', // ベースカラーのオフホワイト
      cursor: 'pointer',
      '&:hover': { border: '1px solid #000000' }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 8px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#000000', // プレースホルダーも黒にして力強く
      opacity: 0.4,
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
      padding: '0px',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '28px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '9px',
      fontWeight: '500',
      // 選択時はアクセントカラーの赤、ホバー時は薄いグレー
      backgroundColor: state.isSelected ? '#da402e' : state.isFocused ? '#eeeeee' : '#fafafa',
      color: state.isSelected ? '#ffffff' : '#000000',
      cursor: 'pointer',
      padding: '10px 12px',
      '&:active': {
        backgroundColor: '#da402e',
      }
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#000000', // 選択されたチップは黒
      borderRadius: '0px', // チップも角を立てる
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#ffffff', // 黒背景に白文字
      fontSize: '8px',
      padding: '2px 6px',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#da402e', // 削除ホバー時は赤
        color: '#ffffff',
      },
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
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#fafafa',
      borderRadius: '0px',
      border: '1px solid #000000',
      boxShadow: '4px 4px 0px rgba(0,0,0,0.1)', // 建築ドローイングのような影
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
