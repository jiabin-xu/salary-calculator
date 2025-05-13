import cities from '../data/cities.json';

// 定义城市原始数据类型
export interface RawCity {
  code: string;
  city: string;
  pinyin: string;
  province?: string;
  social_insurance: {
    upper_limit: number;
    lower_limit: number;
  };
  housing_fund: {
    upper_limit: number;
    lower_limit: number;
  };
}

// 定义应用中使用的转换后的城市类型
export interface City {
  id: string;
  code: string;
  city: string;
  pinyin: string;
  province?: string;
  socialInsurance: {
    minBase: number;
    maxBase: number;
  };
  housingFund: {
    minBase: number;
    maxBase: number;
    defaultRate: number;
  };
}

/**
 * 将原始城市数据转换为应用使用的城市对象
 */
const convertCity = (rawCity: RawCity): City => {
  return {
    id: rawCity.code,
    code: rawCity.code,
    city: rawCity.city,
    pinyin: rawCity.pinyin,
    province: rawCity.province,
    socialInsurance: {
      minBase: rawCity.social_insurance.lower_limit || 0,
      maxBase: rawCity.social_insurance.upper_limit || 0,
    },
    housingFund: {
      minBase: rawCity.housing_fund.lower_limit || 0,
      maxBase: rawCity.housing_fund.upper_limit || 0,
      defaultRate: 0.12, // 默认12%
    }
  };
};

/**
 * 根据城市代码获取城市对象
 *
 * @param cityCode 城市代码
 * @returns 城市对象或null
 */
export const getCityByCode = (cityCode: string): City | null => {
  // 断言cities类型为RawCity数组
  const citiesData = cities as RawCity[];

  // 1. 直接查找完全匹配的城市
  const exactCity = citiesData.find(city => city.code === cityCode);
  if (exactCity) {
    return convertCity(exactCity);
  }

  // 2. 返回广州作为默认城市
  const defaultCity = citiesData.find(city => city.code === '020');
  if (defaultCity) {
    return convertCity(defaultCity);
  }

  return null;
};



