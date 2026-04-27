import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";

import Home from './App/Home'
import List from './App/List'
import AboutUs from './App/AboutUs'
import Category from './App/Category'
import Tabbar from './App/Tabbar'

import config from "./config.json"; // 復活
import Papa from 'papaparse';     // 復活

const App = () => {
  const [shopList, setShopList] = React.useState<Pwamap.ShopData[]>([])

  React.useEffect(() => {
    fetch(config.data_url)
      .then((response) => {
        return response.ok ? response.text() : Promise.reject(response.status);
      })
      .then((data) => {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            const features = results.data as any[];
            const nextShopList: Pwamap.ShopData[] = [];
            
            for (let i = 0; i < features.length; i++) {
              const feature = features[i];
              // 必須項目チェック
              if (!feature['緯度'] || !feature['経度'] || !feature['スポット名']) {
                continue;
              }
              
              const shop = {
                index: i,
                ...feature
              };
              nextShopList.push(shop);
            }

            // 新着順にソート（ここで直接行うことで未使用エラーを回避）
            nextShopList.sort((item1: any, item2: any) => {
              return Date.parse(item2['タイムスタンプ']) - Date.parse(item1['タイムスタンプ']);
            });

            setShopList(nextShopList);
          }
        });
      })
      .catch(err => console.error("データ読み込みに失敗しました:", err));
  }, []);

  return (
    <div className="app">
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home data={shopList} />} />
          <Route path="/list" element={<List data={shopList} />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
      <div className="app-footer">
        <Tabbar />
      </div>
    </div>
  );
}

export default App;
