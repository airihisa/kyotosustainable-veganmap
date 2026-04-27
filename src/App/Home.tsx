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
      // 選択中(hasValue)またはメニューが開いている(isFocused)時に芥子色、それ以外は黒
      borderBottom: (state.hasValue || state.isFocused) 
        ? '1.5px solid #CAAD5F' 
        : '1.5px solid #000000',
      boxShadow: 'none',
      minHeight: '34px',
      height: '34px',
      fontSize: '10px', // さらに小さく設定
      fontWeight: '400',
      backgroundColor: '#ffffff', // 背景色を指定
      letterSpacing: '0.10em', // 小さい文字を読みやすくするための広い字間
      cursor: 'pointer',
      transition: 'border-color 0.3s ease',
      '&:hover': {
        borderBottom: '1.5px solid #CAAD5F',
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 2px',
      height: '34px',
      display: 'flex',
      alignItems: 'center',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#000000',
      opacity: 0.5,
      fontSize: '10px',
      fontWeight: '400',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#000000',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
      padding: '0px',
      fontSize: '10px',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '34px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '9px',
      fontWeight: '700',
      backgroundColor: state.isSelected ? '#000000' : state.isFocused ? '#eeeeee' : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#000000',
      cursor: 'pointer',
      padding: '12px 16px',
      transition: 'all 0.2s ease',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#CAAD5F',
      borderRadius: '0px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      padding: '2px 6px',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      '&:hover': { backgroundColor: '#CAAD5F', color: '#ffffff' },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#fafafa',
      borderRadius: '0px',
      border: '1.5px solid #000000',
      boxShadow: '10px 10px 0px rgba(0,0,0,0.03)',
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
