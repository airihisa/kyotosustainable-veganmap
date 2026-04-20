import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";

import Home from './App/Home'
import List from './App/List'
import AboutUs from './App/AboutUs'
import Category from './App/Category'
// import Images from './App/Images' // ← 1. この行を削除

import Tabbar from './App/Tabbar'
import config from "./config.json";
import Papa from 'papaparse'

// ... (sortShopList の定義はそのまま)

const App = () => {
  const [shopList, setShopList] = React.useState<Pwamap.ShopData[]>([])

  // ... (useEffect の fetch 処理はそのまま)

  return (
    <div className="app">
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home data={shopList} />} />
          <Route path="/list" element={<List data={shopList} />} />
          <Route path="/category" element={<Category data={shopList} />} />
          {/* 2. 下の Route 行を削除 */}
          {/* <Route path="/images" element={<Images data={shopList} />} /> */}
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
