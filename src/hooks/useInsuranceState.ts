import { useReducer, useEffect } from 'react';
import { City } from '../utils/cityMapping';

// 定义状态类型
interface InsuranceState {
  socialInsuranceBaseType: string;
  socialInsuranceBase: string;
  housingFundBaseType: string;
  housingFundBase: string;
  housingFundRate: string;
}

// 定义action类型
type InsuranceAction =
  | { type: 'SET_SOCIAL_INSURANCE_BASE_TYPE'; payload: string }
  | { type: 'SET_SOCIAL_INSURANCE_BASE'; payload: string }
  | { type: 'SET_HOUSING_FUND_BASE_TYPE'; payload: string }
  | { type: 'SET_HOUSING_FUND_BASE'; payload: string }
  | { type: 'SET_HOUSING_FUND_RATE'; payload: string }
  | { type: 'UPDATE_SOCIAL_INSURANCE_BASE'; payload: { type: string; city: City | null; salary: string } }
  | { type: 'UPDATE_HOUSING_FUND_BASE'; payload: { type: string; city: City | null; salary: string } }
  | { type: 'RESET' };

// 初始状态
const initialInsuranceState: InsuranceState = {
  socialInsuranceBaseType: 'salary',
  socialInsuranceBase: '0',
  housingFundBaseType: 'salary',
  housingFundBase: '0',
  housingFundRate: '12',
};

// Reducer函数
function insuranceReducer(state: InsuranceState, action: InsuranceAction): InsuranceState {
  console.log('action', action);
  switch (action.type) {
    case 'SET_SOCIAL_INSURANCE_BASE_TYPE':
      return { ...state, socialInsuranceBaseType: action.payload };
    case 'SET_SOCIAL_INSURANCE_BASE':
      return { ...state, socialInsuranceBase: action.payload };
    case 'SET_HOUSING_FUND_BASE_TYPE':
      return { ...state, housingFundBaseType: action.payload };
    case 'SET_HOUSING_FUND_BASE':
      return { ...state, housingFundBase: action.payload };
    case 'SET_HOUSING_FUND_RATE': {
      // let rate = parseInt(action.payload) || 0;
      // // 限制范围在5-12之间
      // if (rate < 5) rate = 5;
      // else if (rate > 12) rate = 12;
      return { ...state, housingFundRate: action.payload };
    }
    case 'UPDATE_SOCIAL_INSURANCE_BASE': {
      const { type, city, salary } = action.payload;
      if (!city) return state;

      let newBase = state.socialInsuranceBase;
      const salaryValue = Number(salary);

      switch (type) {
        case 'min':
          newBase = String(city.socialInsurance.minBase);
          break;
        case 'salary':
          if (salaryValue < city.socialInsurance.minBase) {
            newBase = String(city.socialInsurance.minBase);
          } else if (salaryValue > city.socialInsurance.maxBase) {
            newBase = String(city.socialInsurance.maxBase);
          } else {
            newBase = salary;
          }
          break;
        case 'custom':
          // 自定义模式下保持当前值
          break;
      }
      return { ...state, socialInsuranceBase: newBase };
    }
    case 'UPDATE_HOUSING_FUND_BASE': {
      const { type, city, salary } = action.payload;
      if (!city) return state;

      let newBase = state.housingFundBase;
      const salaryValue = Number(salary);

      switch (type) {
        case 'min':
          newBase = String(city.housingFund.minBase);
          break;
        case 'salary':
          if (salaryValue < city.housingFund.minBase) {
            newBase = String(city.housingFund.minBase);
          } else if (salaryValue > city.housingFund.maxBase) {
            newBase = String(city.housingFund.maxBase);
          } else {
            newBase = salary;
          }
          break;
        case 'custom':
          // 自定义模式下保持当前值
          break;
      }
      return { ...state, housingFundBase: newBase };
    }
    case 'RESET':
      return initialInsuranceState;
    default:
      return state;
  }
}

// 自定义Hook
export function useInsuranceState(selectedCity: City | null, monthlySalary: string) {
  const [state, dispatch] = useReducer(insuranceReducer, initialInsuranceState);

  // 当选择的城市或月薪变化时，更新社保和公积金基数
  useEffect(() => {
    console.log('selectedCity', selectedCity);
    if (selectedCity) {
      updateSocialInsuranceBase(state.socialInsuranceBaseType);
      updateHousingFundBase(state.housingFundBaseType);
    }
  }, [selectedCity?.code, monthlySalary]);

  // 工具函数，用于更新状态
  const setSocialInsuranceBaseType = (value: string) => {
    dispatch({ type: 'SET_SOCIAL_INSURANCE_BASE_TYPE', payload: value });
  };

  const setSocialInsuranceBase = (value: string) => {
    dispatch({ type: 'SET_SOCIAL_INSURANCE_BASE', payload: value });
  };

  const setHousingFundBaseType = (value: string) => {
    dispatch({ type: 'SET_HOUSING_FUND_BASE_TYPE', payload: value });
  };

  const setHousingFundBase = (value: string) => {
    dispatch({ type: 'SET_HOUSING_FUND_BASE', payload: value });
  };

  const setHousingFundRate = (value: string) => {
    dispatch({ type: 'SET_HOUSING_FUND_RATE', payload: value });
  };

  const updateSocialInsuranceBase = (type: string) => {
    dispatch({
      type: 'UPDATE_SOCIAL_INSURANCE_BASE',
      payload: { type, city: selectedCity, salary: monthlySalary }
    });
  };

  const updateHousingFundBase = (type: string) => {
    dispatch({
      type: 'UPDATE_HOUSING_FUND_BASE',
      payload: { type, city: selectedCity, salary: monthlySalary }
    });
  };

  const resetInsuranceState = () => {
    dispatch({ type: 'RESET' });
  };

  // 获取社保公积金摘要信息
  const getInsuranceSummary = () => {
    if (!selectedCity) return "请先选择城市";
    console.log('state', state);
    return `社保:${state.socialInsuranceBaseType === "custom"
      ? "自定义"
      : state.socialInsuranceBaseType === "min"
        ? "最低基数"
        : "按工资"
      }, 公积金:${state.housingFundBaseType === "custom"
        ? "自定义"
        : state.housingFundBaseType === "min"
          ? "最低基数"
          : "按工资"
      } ${state.housingFundRate ? Number(state.housingFundRate) + "%" : "未设置"}`;
  };

  return {
    ...state,
    setSocialInsuranceBaseType,
    setSocialInsuranceBase,
    setHousingFundBaseType,
    setHousingFundBase,
    setHousingFundRate,
    updateSocialInsuranceBase,
    updateHousingFundBase,
    resetInsuranceState,
    getInsuranceSummary
  };
}
