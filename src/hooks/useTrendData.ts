import { useState, useEffect } from 'react';

interface TrendDataPoint {
  label: string;
  income: number;
  expense: number;
  disposable: number;
}

/**
 * 获取示例趋势数据的钩子
 * 实际应用中，这应该从API或存储中获取真实数据
 */
export const useTrendData = () => {
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);

  // 模拟获取月度趋势数据
  useEffect(() => {
    // 在实际应用中，应该从后端获取真实数据
    // 这里生成模拟数据作为演示
    const mockData: TrendDataPoint[] = [
      {
        label: '1月',
        income: 12000,
        expense: 6500,
        disposable: 5500
      },
      {
        label: '2月',
        income: 13500,
        expense: 7200,
        disposable: 6300
      },
      {
        label: '3月',
        income: 11800,
        expense: 8000,
        disposable: 3800
      },
      {
        label: '4月',
        income: 15000,
        expense: 7500,
        disposable: 7500
      },
      {
        label: '5月',
        income: 14200,
        expense: 9000,
        disposable: 5200
      },
      {
        label: '6月',
        income: 16500,
        expense: 8500,
        disposable: 8000
      }
    ];

    setTrendData(mockData);
  }, []);

  // 添加新的月度数据点
  const addTrendDataPoint = (dataPoint: TrendDataPoint) => {
    setTrendData(prev => [...prev, dataPoint]);
  };

  // 获取最近几个月的数据
  const getRecentMonths = (months: number = 6) => {
    return trendData.slice(-months);
  };

  // 计算平均收入、支出和可支配收入
  const getAverages = () => {
    if (trendData.length === 0) return { avgIncome: 0, avgExpense: 0, avgDisposable: 0 };

    const totalIncome = trendData.reduce((sum, point) => sum + point.income, 0);
    const totalExpense = trendData.reduce((sum, point) => sum + point.expense, 0);
    const totalDisposable = trendData.reduce((sum, point) => sum + point.disposable, 0);

    return {
      avgIncome: totalIncome / trendData.length,
      avgExpense: totalExpense / trendData.length,
      avgDisposable: totalDisposable / trendData.length
    };
  };

  // 获取趋势(是否上升)
  const getTrends = () => {
    if (trendData.length < 2) {
      return {
        incomeUp: false,
        expenseUp: false,
        disposableUp: false
      };
    }

    const lastIndex = trendData.length - 1;
    const prevIndex = lastIndex - 1;

    return {
      incomeUp: trendData[lastIndex].income > trendData[prevIndex].income,
      expenseUp: trendData[lastIndex].expense > trendData[prevIndex].expense,
      disposableUp: trendData[lastIndex].disposable > trendData[prevIndex].disposable
    };
  };

  return {
    trendData,
    addTrendDataPoint,
    getRecentMonths,
    getAverages,
    getTrends
  };
};

export default useTrendData;
