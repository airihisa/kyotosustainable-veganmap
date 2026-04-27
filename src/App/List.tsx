import React from "react";
import Select from 'react-select';
import ShopListItem from './ShopListItem'
import Shop from './Shop'
import './List.scss'
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { askGeolocationPermission } from '../geolocation'
import * as turf from "@turf/turf"

type Props = {
  data: Pwamap.ShopData[];
}

// 距離順ソートロジック
const sortShopList = async (shopList: Pwamap.ShopData[]) => {
  const currentPosition = await askGeolocationPermission()
  if(currentPosition) {
    const from = turf.point(currentPosition);
    const sortingShopList = shopList.map((shop: any) => {
      const lng = parseFloat(shop['経度'])
      const lat = parseFloat(shop['緯度'])
      if(Number.isNaN(lng) || Number.isNaN(lat)) {
        return shop
      } else {
        const to = turf.point([lng, lat])
        const distance = turf.distance(from, to, {units: 'meters' as 'meters'});
        return { ...shop, distance }
      }
    })
    sortingShopList.sort((a,b) => {
      if(typeof a.distance !== 'number' || Number.isNaN(a.distance)) {
        return 1
      } else if (typeof b.distance !== 'number' || Number.isNaN(b.distance)) {
        return -1
      } else {
        return a.distance - b.distance
      }
    })
    return sortingShopList
  } else {
    return shopList
  }
}

const Content = (props: Props) => {
  const [shop, setShop] = React.useState<Pwamap.ShopData | undefined>()
  const [data, setData] = React.useState<Pwamap.ShopData[]>(props.data)
  const [list, setList] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(10);
  const [hasMore, setHasMore] = React.useState(true);

  // 絞り込み用の状態
  const [category, setCategory] = React.useState<any>(null);
  const [level, setLevel] = React.useState<any>(null);
  const [styles, setStyles] = React.useState<any>([]);

  const [searchParams] = useSearchParams();
  
  // URLパラメータの取得
  const queryCategory = searchParams.get('category')
  const queryLevel = searchParams.get('level')
  const queryStyle = searchParams.get('style')

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '0px',
      border: 'none',
      // 選択中(hasValue)またはメニューが開いている(isFocused)時に赤、それ以外は黒
      borderBottom: (state.hasValue || state.isFocused) 
        ? '1.5px solid #da402e' 
        : '1.5px solid #000000',
      boxShadow: 'none',
      minHeight: '34px',
      height: '34px',
      fontSize: '8px', // さらに小さく設定
      fontWeight: '700',
      backgroundColor: '#fafafa', // 背景色を指定
      letterSpacing: '0.12em', // 小さい文字を読みやすくするための広い字間
      cursor: 'pointer',
      transition: 'border-color 0.3s ease',
      '&:hover': {
        borderBottom: '1.5px solid #da402e',
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 4px',
      height: '34px',
      display: 'flex',
      alignItems: 'center',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#000000',
      opacity: 0.5,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#000000',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
      padding: '0px',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '34px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '9px',
      fontWeight: '700',
      backgroundColor: state.isSelected ? '#000000' : state.isFocused ? '#eeeeee' : '#fafafa',
      color: state.isSelected ? '#ffffff' : '#000000',
      cursor: 'pointer',
      padding: '12px 16px',
      transition: 'all 0.2s ease',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#000000',
      borderRadius: '0px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      fontSize: '8px',
      fontWeight: '700',
      padding: '2px 6px',
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

  // オプション生成
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

  // フィルタリングとソートの実行
  React.useEffect(() => {
    let filtered = props.data.filter((item: any) => {
      const targetCat = category ? category.value : queryCategory;
      const targetLvl = level ? level.value : queryLevel;
      
      const matchCat = !targetCat || item['カテゴリ'] === targetCat;
      const matchLvl = !targetLvl || item['ヴィーガンレベル'] === targetLvl;
      
      // スタイルの判定（URLパラメータ or セレクトボックス）
      const matchStl = styles.length === 0 
        ? (!queryStyle || (item['スタイル'] && item['スタイル'].includes(queryStyle)))
        : styles.some((s: any) => item['スタイル'] && item['スタイル'].includes(s.value));

      return matchCat && matchLvl && matchStl;
    });

    let isMounted = true
    const orderBy = process.env.REACT_APP_ORDERBY

    if (orderBy === 'distance') {
      sortShopList(filtered).then(sortedData => {
        if (isMounted) {
          setData(sortedData)
          setList(sortedData.slice(0, 10))
          setPage(10)
          setHasMore(sortedData.length > 10)
        }
      })
    } else {
      setData(filtered)
      setList(filtered.slice(0, 10))
      setPage(10)
      setHasMore(filtered.length > 10)
    }

    return () => { isMounted = false }
  }, [props.data, category, level, styles, queryCategory, queryLevel, queryStyle])

  const popupHandler = (shop: any) => {
    if (shop['公式サイト'] && String(shop['公式サイト']).startsWith('http')) {
      window.open(shop['公式サイト'], '_blank', 'noreferrer');
    } else {
      setShop(shop)
    }
  }

  const loadMore = () => {
    if (list.length >= data.length) {
      setHasMore(false);
      return;
    }
    const nextItems = data.slice(page, page + 10);
    setList([...list, ...nextItems]);
    setPage(page + 10);
  }

  const loader = <div className="loader" key={0} style={{ padding: '20px', textAlign: 'center' }}>読み込み中です...</div>;

  return (
    <div id="shop-list" className="shop-list">
      {/* 検索窓セクション */}
      <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid #eee', background: '#fff' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <Select 
              placeholder="カテゴリ" isClearable 
              options={getOptions('カテゴリ')} 
              onChange={setCategory} 
              styles={customStyles} isSearchable={false}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select 
              placeholder="ヴィーガンレベル" isClearable 
              options={getOptions('ヴィーガンレベル')} 
              onChange={setLevel} 
              styles={customStyles} isSearchable={false}
            />
          </div>
        </div>
        <Select 
          isMulti placeholder="スタイルを選択" isClearable 
          options={getStyleOptions()} 
          onChange={setStyles} 
          styles={customStyles} isSearchable={false}
        />
        <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
          該当件数: {data.length} 件
        </div>
      </div>

      <InfiniteScroll
        dataLength={list.length}
        next={loadMore}
        hasMore={hasMore}
        loader={loader}
        scrollableTarget="shop-list"
      >
        {list.map((item, index) => (
          <div key={index} className="shop">
            <ShopListItem
              data={item}
              popupHandler={() => popupHandler(item)}
              queryCategory={category ? category.value : queryCategory}
            />
          </div>
        ))}
      </InfiniteScroll>
      {shop ? <Shop shop={shop} close={() => setShop(undefined)} /> : <></>}
    </div>
  );
};

export default Content;
