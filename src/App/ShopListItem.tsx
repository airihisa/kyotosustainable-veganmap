import React from "react";

type Props = {
  data: Pwamap.ShopData;
  popupHandler: (shop: Pwamap.ShopData) => void;
  queryCategory: string | null;
};

const ShopListItem = (props: Props) => {
  const { data, popupHandler } = props;

  return (
    <div className="shop-list-item" onClick={() => popupHandler(data)}>
      {/* 左側：正方形の画像エリア */}
      <div className="item-image-container">
        {data['画像'] ? (
          <img src={data['画像']} alt={data['スポット名']} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      {/* 右側：コンテンツエリア */}
      <div className="item-content">
        <div className="item-category-tag">{data['カテゴリ']}</div>
        <h3 className="item-title">{data['スポット名']}</h3>
        {/* スプレッドシートに日付列などがあればここに追加できます */}
        <p className="item-date">{data['タイムスタンプ']?.split(' ')[0]}</p>
      </div>
    </div>
  );
};

export default ShopListItem;
