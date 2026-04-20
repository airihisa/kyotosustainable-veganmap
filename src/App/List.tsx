import React from "react";
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

const sortShopList = async (shopList: Pwamap.ShopData[]) => {
  const currentPosition = await askGeolocationPermission()
  if(currentPosition) {
    const from = turf.point(currentPosition);
    const sortingShopList = shopList.map((shop: any) => { // anyを追加
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

  const [searchParams] = useSearchParams();
  
  // URLから複数の検索条件を取得
  const queryCategory = searchParams.get('category')
  const queryLevel = searchParams.get('level')
  const queryStyle = searchParams.get('style')

  React.useEffect(() => {
    // 複数条件でのフィルタリングを実行
    let filtered = props.data.filter((item: any) => {
      const matchCat = !queryCategory || item['カテゴリ'] === queryCategory;
      const matchLvl = !queryLevel || item['ヴィーガンレベル'] === queryLevel;
      const matchStl = !queryStyle || item['スタイル'] === queryStyle;
      return matchCat && matchLvl && matchStl;
    });

    let isMounted = true
    const orderBy = process.env.REACT_APP_ORDERBY

    if (orderBy === 'distance') {
      sortShopList(filtered).then(sortedData => {
        if (isMounted) {
          setList(sortedData.slice(0, page))
          setData(sortedData)
        }
      })
    } else {
      setList(filtered.slice(0, page))
      setData(filtered)
    }

    return () => { isMounted = false }
  }, [props.data, queryCategory, queryLevel, queryStyle, page])


  // ここで「直接飛ばす」か「詳細パネルを出す」かを判定
  const popupHandler = (shop: any) => {
    if (shop['公式サイト'] && String(shop['公式サイト']).startsWith('http')) {
      window.open(shop['公式サイト'], '_blank', 'noreferrer');
    } else {
      setShop(shop)
    }
  }

  const closeHandler = () => {
    setShop(undefined)
  }

  const loadMore = () => {
    if (list.length >= data.length) {
      setHasMore(false);
      return;
    }
    setList([...list, ...data.slice(page, page + 10)])
    setPage(page + 10)
  }

  const loader = <div className="loader" key={0} style={{ width: '100%', height: '200px', textAlign: 'center', position: 'relative', top: '100px' }}>場所一覧を読み込み中です...</div>;

  return (
    <div id="shop-list" className="shop-list">
      {/* 検索中条件の表示（必要に応じて調整） */}
      {(queryCategory || queryLevel || queryStyle) && (
        <div className="shop-list-category">
          絞り込み中: {queryCategory} {queryLevel} {queryStyle}
        </div>
      )}

      <InfiniteScroll
        dataLength={list.length}
        next={loadMore}
        hasMore={hasMore}
        loader={loader}
        scrollableTarget="shop-list"
      >
        {
          list.map((item, index) => {
            return (<div key={index} className="shop">
              <ShopListItem
                data={item}
                popupHandler={() => popupHandler(item)} // ここで個別のshopデータを渡す
                queryCategory={queryCategory}
              />
            </div>)
          })
        }
      </InfiniteScroll>
      {shop ? <Shop shop={shop} close={closeHandler} /> : <></>}
    </div>
  );
};

export default Content;
