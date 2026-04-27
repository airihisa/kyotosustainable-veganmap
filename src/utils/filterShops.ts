export const filterShops = (
  data: any[],
  {
    category,
    level,
    style,
    option,
    time,
    price,
    queryCategory,
    queryLevel,
    queryStyle
  }: any
) => {
  return data.filter((item: any) => {
    const targetCat = category ? category.value : queryCategory;
    const targetLvl = level ? level.value : queryLevel;

    const matchCat = !targetCat || item['カテゴリ'] === targetCat;
    const matchLvl = !targetLvl || item['ヴィーガンレベル'] === targetLvl;

    const matchStl = !style ||
      (item['スタイル'] || '').includes(style.value);

    const matchOpt = !option ||
      (item['オプション'] || '').includes(option.value);

    const matchTime = !time ||
      (item['営業時間帯'] || '').includes(time.value);

    const matchPrice = !price ||
      item['価格帯'] === price.value;

    return matchCat && matchLvl && matchStl && matchOpt && matchTime && matchPrice;
  });
};
