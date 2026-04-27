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

// 距離順ソート
const sortShopList = async (shopList: Pwamap.ShopData[]) => {
  const currentPosition = await askGeolocationPermission()
  if(currentPosition) {
    const from = turf.point(currentPosition);
    const sortingShopList = shopList.map((shop: any) => {
      const lng = parseFloat(shop['経度'])
      const lat = parseFloat(shop['緯度'])
      if(Number.isNaN(lng) || Number.isNaN(lat)) return shop
      const to = turf.point([lng, lat])
      const distance = turf.distance(from, to, {units: 'meters' as 'meters'});
      return { ...shop, distance }
    })
    sortingShopList.sort((a,b) => {
      if(typeof a.distance !== 'number') return 1
      if(typeof b.distance !== 'number') return -1
      return a.distance - b.distance
    })
    return sortingShopList
  }
  return shopList
}

const Content = (props: Props) => {
  const [shop, setShop] = React.useState<Pwamap.ShopData | undefined>()
  const [data, setData] = React.useState<Pwamap.ShopData[]>(props.data)
  const [list, setList] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(10);
  const [hasMore, setHasMore] = React.useState(true);

  const [category, setCategory] = React.useState<any>(null);
  const [level, setLevel] = React.useState<any>(null);
  const [styles, setStyles] = React.useState<any>([]);

  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category')
  const queryLevel = searchParams.get('level')
  const queryStyle = searchParams.get('style')

  // 🎨 デザイン（ここが重要）
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '0px',
      border: 'none',
      borderBottom: '1.5px solid #000000',
      boxShadow: 'none',
      minHeight: '34px',
      height: '34px',
      fontSize: '10px',
      fontWeight: '400',
      color: '#000000',
      backgroundColor: '#ffffff',
      letterSpacing: '0.08em',
      cursor: 'pointer',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 4px',
      alignItems: 'center',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#000000',
      opacity: 0.4,
      fontSize: '10px',
      fontWeight: '400',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#000000',
      fontSize: '10px',
      fontWeight: '400',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#CAAD5F',
      borderRadius: '2px',
      padding: '0 2px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      fontSize: '9px',
      fontWeight: '400',
      padding: '2px 4px',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#CAAD5F',
        opacity: 0.7,
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '10px',
      fontWeight: '400',
      backgroundColor: state.isSelected
        ? '#000000'
        : state.isFocused
        ? '#eeeeee'
        : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#000000',
      padding: '10px 14px',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#ffffff',
      border: '1px solid #000000',
      borderRadius: '0px',
      boxShadow: '6px 6px 0px rgba(0,0,0,0.05)',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#999999',
      transform: 'scale(0.8)',
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: '#999999',
      transform: 'scale(0.8)',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
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
    const uniqueValues = Array.from(
      new Set(props.data.map((item: any) => item[key]).filter(Boolean))
    );
    return uniqueValues.map(v => ({ value: v, label: v }));
  };

  // フィルタ処理
  React.useEffect(() => {
    let filtered = props.data.filter((item: any) => {
      const targetCat = category ? category.value : queryCategory;
      const targetLvl = level ? level.value : queryLevel;

      const matchCat = !targetCat || item['カテゴリ'] === targetCat;
      const matchLvl = !targetLvl || item['ヴィーガンレベル'] === targetLvl;

      const matchStl = styles.length === 0
        ? (!queryStyle || (item['スタイル'] && item['スタイル'].includes(queryStyle)))
        : styles.some((s: any) =>
            item['スタイル'] && item['スタイル'].includes(s.value)
          );

      return matchCat && matchLvl && matchStl;
    });

    let isMounted = true

    sortShopList(filtered).then(sortedData => {
      if (isMounted) {
        setData(sortedData)
        setList(sortedData.slice(0, 10))
        setPage(10)
        setHasMore(sortedData.length > 10)
      }
    })

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

  return (
    <div id="shop-list" className="shop-list">

      {/* フィルターUI */}
      <div style={{
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        borderBottom: '1px solid #eee',
        background: '#fff'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Select
            placeholder="カテゴリ"
            isClearable
            options={getOptions('カテゴリ')}
            onChange={setCategory}
            styles={customStyles}
            isSearchable={false}
          />
          <Select
            placeholder="ヴィーガンレベル"
            isClearable
            options={getOptions('ヴィーガンレベル')}
            onChange={setLevel}
            styles={customStyles}
            isSearchable={false}
          />
        </div>

        <Select
          isMulti
          placeholder="スタイルを選択"
          isClearable
          options={getStyleOptions()}
          onChange={setStyles}
          styles={customStyles}
          isSearchable={false}
        />

        <div style={{ fontSize: '10px', color: '#999' }}>
          該当件数: {data.length} 件
        </div>
      </div>

      <InfiniteScroll
        dataLength={list.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div style={{ padding: 20, textAlign: 'center' }}>読み込み中...</div>}
        scrollableTarget="shop-list"
      >
        {list.map((item, index) => (
          <div key={index}>
            <ShopListItem
              data={item}
              popupHandler={() => popupHandler(item)}
              queryCategory={category ? category.value : queryCategory}
            />
          </div>
        ))}
      </InfiniteScroll>

      {shop && <Shop shop={shop} close={() => setShop(undefined)} />}
    </div>
  );
};

export default Content;
