import { useReducer } from 'react';
import { specialDeductions, SpecialDeduction } from '../data/taxRates';

// 定义状态类型
interface DeductionState {
  deductions: Record<string, string>;
}

// 定义action类型
type DeductionAction =
  | { type: 'SET_DEDUCTION'; payload: { id: string; value: string } }
  | { type: 'RESET_DEDUCTIONS' }
  | { type: 'CLEAR_ALL_DEDUCTIONS' };

// 初始状态
const initialDeductionState: DeductionState = {
  deductions: specialDeductions.reduce((acc, deduction) => {
    acc[deduction.id] = '0';
    return acc;
  }, {} as Record<string, string>),
};

// Reducer函数
function deductionReducer(state: DeductionState, action: DeductionAction): DeductionState {
  switch (action.type) {
    case 'SET_DEDUCTION':
      return {
        ...state,
        deductions: {
          ...state.deductions,
          [action.payload.id]: action.payload.value,
        },
      };
    case 'RESET_DEDUCTIONS':
      return initialDeductionState;
    case 'CLEAR_ALL_DEDUCTIONS':
      return {
        ...state,
        deductions: Object.keys(state.deductions).reduce((acc, key) => {
          acc[key] = '0';
          return acc;
        }, {} as Record<string, string>),
      };
    default:
      return state;
  }
}

// 自定义Hook
export function useDeductionState() {
  const [state, dispatch] = useReducer(deductionReducer, initialDeductionState);

  // 工具函数，用于更新状态
  const setDeduction = (id: string, value: string) => {
    dispatch({ type: 'SET_DEDUCTION', payload: { id, value } });
  };

  const resetDeductions = () => {
    dispatch({ type: 'RESET_DEDUCTIONS' });
  };

  const clearAllDeductions = () => {
    dispatch({ type: 'CLEAR_ALL_DEDUCTIONS' });
  };

  // 计算总专项附加扣除金额
  const getTotalDeduction = (): number => {
    return Object.values(state.deductions).reduce(
      (sum, value) => sum + Number(value),
      0
    );
  };

  // 获取专项附加扣除摘要信息
  const getDeductionSummary = (): string => {
    const total = getTotalDeduction();
    return total > 0
      ? `已设置 ${total} 元/月`
      : "暂未设置专项附加扣除";
  };

  return {
    deductions: state.deductions,
    setDeduction,
    resetDeductions,
    clearAllDeductions,
    getTotalDeduction,
    getDeductionSummary,
  };
}
