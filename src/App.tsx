import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";

import Home from './App/Home'
import List from './App/List'
import AboutUs from './App/AboutUs'
import Category from './App/Category'
// import Images from './App/Images' // 削除済み

import Tabbar from './App/Tabbar'

// --- 以下の 2行を削除 (Line 12, 13 のエラー対策) ---
// import config from "./config.json";
// import Papa from 'papaparse'

// --- sortShopList は他で使っていないなら残しても良いですが、もし警告が出るならここも確認 ---
const sortShopList = async (shopList: Pwamap.ShopData[]) => {
  return shopList.sort(function (item1, item2) {
    return Date.parse(item2['タイムスタンプ']) - Date.parse(item1['タイムスタンプ'])
  });
}

const App = () => {
  // --- setShopList を削除 (Line 18 のエラー対策) ---
  // const [shopList, setShopList] = React.useState<Pwamap.ShopData[]>([])
  // ↓ このように書き換える（もし shopList しか使わない場合）
  const [shopList] = React.useState<Pwamap.ShopData[]>([]) 

  // ... (もし useEffect 内で Papa や config を使っている処理をすでに消しているなら、useEffect ごと削除してOKです)

  return (
    <div className="app">
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home data={shopList} />} />
          <Route path="/list" element={<List data={shopList} />} />
          <Route path="/category" element={<Category data={shopList} />} />
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
