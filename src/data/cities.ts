export interface CityData {
  id: string;
  name: string;
  code?: string;
  province?: string;
  socialInsurance: {
    minBase: number;
    maxBase: number;
  };
  housingFund: {
    minBase: number;
    maxBase: number;
    defaultRate: number; // 默认缴纳比例
    minRate: number; // 最小缴纳比例
    maxRate: number; // 最大缴纳比例
  };
}

const cities: CityData[] = [
  {
    id: 'beijing',
    name: '北京',
    code: '010',
    province: '北京',
    socialInsurance: {
      minBase: 6520,
      maxBase: 32604
    },
    housingFund: {
      minBase: 3740,
      maxBase: 32604,
      defaultRate: 0.12,
      minRate: 0.05,
      maxRate: 0.12
    }
  },
  {
    id: 'shanghai',
    name: '上海',
    code: '021',
    province: '上海',
    socialInsurance: {
      minBase: 6000,
      maxBase: 30300
    },
    housingFund: {
      minBase: 2590,
      maxBase: 30300,
      defaultRate: 0.07,
      minRate: 0.05,
      maxRate: 0.07
    }
  },
  {
    id: 'guangzhou',
    name: '广州',
    code: '020',
    province: '广东',
    socialInsurance: {
      minBase: 2300,
      maxBase: 31140
    },
    housingFund: {
      minBase: 2300,
      maxBase: 31140,
      defaultRate: 0.08,
      minRate: 0.05,
      maxRate: 0.12
    }
  },
  {
    id: 'shenzhen',
    name: '深圳',
    code: '0755',
    province: '广东',
    socialInsurance: {
      minBase: 2200,
      maxBase: 35295
    },
    housingFund: {
      minBase: 2200,
      maxBase: 35295,
      defaultRate: 0.08,
      minRate: 0.05,
      maxRate: 0.12
    }
  },
  {
    id: 'hangzhou',
    name: '杭州',
    code: '0571',
    province: '浙江',
    socialInsurance: {
      minBase: 3321,
      maxBase: 26712
    },
    housingFund: {
      minBase: 3321,
      maxBase: 26712,
      defaultRate: 0.12,
      minRate: 0.05,
      maxRate: 0.12
    }
  }
];

export default cities;
