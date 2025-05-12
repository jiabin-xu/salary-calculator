import cities from '../data/cities';
import provinces from '../data/provinces.json';

/**
 * 根据城市代码获取城市ID
 * 当省市选择器选择的城市在 cities 数据中找不到时，
 * 尝试找到该省份下的默认城市或相似城市
 *
 * @param cityCode 城市代码
 * @returns 城市ID
 */
export const getCityIdByCode = (cityCode: string): string | null => {
  // 1. 直接查找完全匹配的城市
  const exactCity = cities.find(city => city.code === cityCode);
  if (exactCity) {
    return exactCity.id;
  }

  // 2. 如果没有找到，尝试查找对应省份的省会城市
  const provinceCapitals: Record<string, string> = {
    '北京': 'beijing',
    '上海': 'shanghai',
    '天津': 'tianjin',
    '重庆': 'chongqing',
    '安徽': 'hefei',
    '福建': 'fuzhou',
    '甘肃': 'lanzhou',
    '广东': 'guangzhou',
    '广西': 'nanning',
    '贵州': 'guiyang',
    '海南': 'haikou',
    '河北': 'shijiazhuang',
    '河南': 'zhengzhou',
    '黑龙江': 'haerbin',
    '湖北': 'wuhan',
    '湖南': 'changsha',
    '吉林': 'changchun',
    '江苏': 'nanjing',
    '江西': 'nanchang',
    '辽宁': 'shenyang',
    '内蒙古': 'huhehaote',
    '宁夏': 'yinchuan',
    '青海': 'xining',
    '山东': 'jinan',
    '山西': 'taiyuan',
    '陕西': 'xian',
    '四川': 'chengdu',
    '西藏': 'lasa',
    '新疆': 'wulumuqi',
    '云南': 'kunming',
    '浙江': 'hangzhou',
  };

  console.log(Object.keys(provinceCapitals).join(','));

  // 从选择的城市代码中查找对应的省份
  const selectedCity = provinces.find(city => city.code === cityCode);
  if (selectedCity && selectedCity.province && provinceCapitals[selectedCity.province]) {
    return provinceCapitals[selectedCity.province];
  }

  // 3. 如果仍然找不到，返回广州作为默认城市
  return 'guangzhou';
};

/**
 * 根据城市代码获取城市对象
 */
export const getCityByCode = (cityCode: string) => {
  const cityId = getCityIdByCode(cityCode);
  if (cityId) {
    return cities.find(city => city.id === cityId) || null;
  }
  return null;
};
//  帮我检索如下省份社保缴纳范围，北京,上海,天津,重庆,安徽,福建,甘肃,广东,广西,贵州,海南,河北,河南,黑龙江,湖北,湖南,吉林,江苏,江西,辽宁,内蒙古,宁夏,青海,山东,山西,陕西,四川,西藏,新疆,云南,浙江，并 以如下json 格式返回
// const provinceSocialInsurance = {
//   "北京": {
//     "minBase": 6520,
//     "maxBase": 33891
//   }
// };