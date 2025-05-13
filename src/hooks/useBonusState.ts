import { useReducer } from 'react';

// 定义状态类型
interface BonusState {
  bonusMonths: string;
  bonusMonth: string;
  bonusCalcType: string;
}

// 定义action类型
type BonusAction =
  | { type: 'SET_BONUS_MONTHS'; payload: string }
  | { type: 'SET_BONUS_MONTH'; payload: string }
  | { type: 'SET_BONUS_CALC_TYPE'; payload: string }
  | { type: 'RESET' };

// 初始状态
const initialBonusState: BonusState = {
  bonusMonths: '1',
  bonusMonth: '12',
  bonusCalcType: 'separate',
};

// Reducer函数
function bonusReducer(state: BonusState, action: BonusAction): BonusState {
  switch (action.type) {
    case 'SET_BONUS_MONTHS':
      return { ...state, bonusMonths: action.payload };
    case 'SET_BONUS_MONTH':
      return { ...state, bonusMonth: action.payload };
    case 'SET_BONUS_CALC_TYPE':
      return { ...state, bonusCalcType: action.payload };
    case 'RESET':
      return initialBonusState;
    default:
      return state;
  }
}

// 自定义Hook
export function useBonusState() {
  const [state, dispatch] = useReducer(bonusReducer, initialBonusState);

  // 工具函数，用于更新状态
  const setBonusMonths = (value: string) => {
    dispatch({ type: 'SET_BONUS_MONTHS', payload: value });
  };

  const setBonusMonth = (value: string) => {
    dispatch({ type: 'SET_BONUS_MONTH', payload: value });
  };

  const setBonusCalcType = (value: string) => {
    dispatch({ type: 'SET_BONUS_CALC_TYPE', payload: value });
  };

  const resetBonusState = () => {
    dispatch({ type: 'RESET' });
  };

  const getBonusSummary = () => {
    const months = Number(state.bonusMonths);
    if (months <= 0) return "无年终奖";
    return `${months}个月，${state.bonusMonth}月发放`;
  };

  return {
    ...state,
    setBonusMonths,
    setBonusMonth,
    setBonusCalcType,
    resetBonusState,
    getBonusSummary
  };
}
