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
    
    // スタイルの複数選択判定（OR検索：選択したスタイルのいずれかが含まれていれば表示）
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
        item['スタイル'].split(',').forEach((s: string) => allStyles.add(s.trim()));
      }
    });
    return Array.from(allStyles).map(v => ({ value: v, label: v }));
  };

  const getOptions = (key: string) => {
    const uniqueValues = Array.from(new Set(props.data.map((item: any) => item[key]).filter(Boolean)));
    return uniqueValues.map(v => ({ value: v, label: v }));
  };

  // react-select のカスタムスタイル設定（モノトーン・スタイリッシュ）
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '4px',
      border: state.isFocused ? '1px solid #333' : '1px solid #E0E0E0',
      boxShadow: 'none',
      minHeight: '32px',
      height: '32px',
      fontSize: '10px',
      fontWeight: '500',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      cursor: 'pointer',
      '&:hover': {
        border: '1px solid #999',
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 8px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#888',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
      padding: '0px',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '32px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '10px',
      backgroundColor: state.isSelected ? '#333' : state.isFocused ? '#F5F5F5' : 'white',
      color: state.isSelected ? 'white' : '#333',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#000',
      }
    }),
    multiValue: (
