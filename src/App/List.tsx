import React from "react";
import Select from 'react-select';
import ShopListItem from './ShopListItem'
import Shop from './Shop'
import './List.scss'
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { askGeolocationPermission } from '../geolocation'
import * as turf from "@turf/turf"
import { selectStyles } from '../styles/selectStyles';

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
  const [options, setOptions] = React.useState<any[]>([]);
  const [time, setTime] = React.useState<any>(null);
  const [price, setPrice] = React.useState<any>(null);
  
  const [searchParams] = useSearchParams();
  
  // URLパラメータの取得
  const queryCategory = searchParams.get('category')
  const queryLevel = searchParams.get('level')
  const queryStyle = searchParams.get('style')

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

  const getOptionOptions = () => {
    const all = new Set<string>();
    props.data.forEach((item: any) => {
      if (item['オプション']) {
        item['オプション'].split(',').forEach((o: string) => all.add(o.trim()));
      }
    });
    return Array.from(all).map(v => ({ value: v, label: v }));
  };

  const getTimeOptions = () => [
    { value: 'モーニング', label: 'モーニング' },
    { value: 'ランチ', label: 'ランチ' },
    { value: 'ディナー', label: 'ディナー' },
    { value: 'カフェタイム', label: 'カフェタイム' },
  ];

  const getPriceOptions = () => [
    { value: '¥', label: '¥' },
    { value: '¥¥', label: '¥¥' },
    { value: '¥¥¥', label: '¥¥¥' },
    { value: '¥¥¥¥', label: '¥¥¥¥' },
    { value: '¥¥¥¥¥', label: '¥¥¥¥¥' },
  ];

  // フィルタリングとソートの実行
React.useEffect(() => {
  let filtered = props.data.filter((item: any) => {
    const targetCat = category ? category.value : queryCategory;
    const targetLvl = level ? level.value : queryLevel;
    
    const matchCat = !targetCat || item['カテゴリ'] === targetCat;
    const matchLvl = !targetLvl || item['ヴィーガンレベル'] === targetLvl;
    
    const matchStl = styles.length === 0 
      ? (!queryStyle || (item['スタイル'] && item['スタイル'].includes(queryStyle)))
      : styles.some((s: any) => item['スタイル'] && item['スタイル'].includes(s.value));
    
    // 👇追加① オプション（複数）
    const matchOpt = options.length === 0 ||
      options.some((o: any) =>
        item['オプション'] && item['オプション'].includes(o.value)
      );
    
    // 👇追加② 営業時間帯
    const matchTime = !time ||
      (item['営業時間帯'] && item['営業時間帯'].includes(time.value));
    
    // 👇追加③ 価格帯
    const matchPrice = !price ||
      item['価格帯'] === price.value;
    
    return matchCat && matchLvl && matchStl && matchOpt && matchTime && matchPrice;
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
  }, [
  props.data,
  category,
  level,
  styles,
  options,
  time,
  price,
  queryCategory,
  queryLevel,
  queryStyle
])

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
              placeholder="カテゴリ"
              isClearable 
              options={getOptions('カテゴリ')} 
              onChange={(selected) => setOptions(selected ? [...selected] : [])}
              styles={selectStyles}   // ←ここだけ変える
              isSearchable={false}
              />
          </div>
          <div style={{ flex: 1 }}>
            <Select 
              placeholder="ヴィーガンレベル" isClearable 
              options={getOptions('ヴィーガンレベル')} 
              onChange={setLevel} 
              styles={selectStyles} isSearchable={false}
            />
          </div>
        </div>
        <Select 
          isMulti placeholder="スタイルを選択" isClearable 
          options={getStyleOptions()} 
          onChange={setStyles} 
          styles={selectStyles} isSearchable={false}
        />
        {/* オプション */}
        <Select 
          isMulti
          placeholder="オプション"
          options={getOptionOptions()}
          onChange={(selected) => setOptions(selected ? [...selected] : [])}
          styles={selectStyles}
          isSearchable={false}
        />

        {/* 営業時間帯 & 価格帯 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <Select
              placeholder="営業時間帯"
              options={getTimeOptions()}
              onChange={setTime}
              styles={selectStyles}
              isClearable
              isSearchable={false}
            />
          </div>

          <div style={{ flex: 1 }}>
            <Select
              placeholder="価格帯"
              options={getPriceOptions()}
              onChange={setPrice}
              styles={selectStyles}
              isClearable
              isSearchable={false}
            />
          </div>
        </div>
        
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
