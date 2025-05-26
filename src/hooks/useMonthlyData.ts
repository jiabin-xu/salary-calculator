import { useMemo } from "react";

export interface MonthlyData {
  name: string;
  number: number;
}

export const useMonthlyData = () => {
  // 获取当前月份
  const getCurrentMonth = useMemo(() => {
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    const months = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];
    return {
      name: months[monthIndex],
      number: monthIndex + 1,
    };
  }, []);

  // 获取所有月份
  const getAllMonths = useMemo(() => {
    const months = [
      { name: "一月", number: 1 },
      { name: "二月", number: 2 },
      { name: "三月", number: 3 },
      { name: "四月", number: 4 },
      { name: "五月", number: 5 },
      { name: "六月", number: 6 },
      { name: "七月", number: 7 },
      { name: "八月", number: 8 },
      { name: "九月", number: 9 },
      { name: "十月", number: 10 },
      { name: "十一月", number: 11 },
      { name: "十二月", number: 12 },
    ];
    return months;
  }, []);

  // 计算年度数据
  const calculateYearlyData = (
    monthlyIncome: number,
    monthlyExpense: number
  ) => {
    return {
      income: monthlyIncome * 12,
      expense: monthlyExpense * 12,
      disposable: (monthlyIncome - monthlyExpense) * 12,
    };
  };

  return {
    getCurrentMonth,
    getAllMonths,
    calculateYearlyData,
  };
};

export default useMonthlyData;
