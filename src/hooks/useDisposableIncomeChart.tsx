import { useMemo } from "react";
import { IncomeItem, ExpenseItem } from "./useDisposableIncomeState";
import { getExpenseTypeLabel } from "../utils/financialTypeUtils";

interface ChartDataItem {
  type: string;
  value: string;
  amount: number;
  isExpense: boolean;
}

/**
 * 封装收入支出图表逻辑的自定义Hook
 * @param incomeItems 收入项目列表
 * @param expenseItems 支出项目列表
 * @returns 返回图表数据和图表配置
 */
export const useDisposableIncomeChart = (
  incomeItems: IncomeItem[],
  expenseItems: ExpenseItem[]
) => {
  // 计算图表数据
  const chartData = useMemo(() => {
    // 计算总收入，用作百分比计算的分母
    const totalIncome = incomeItems.reduce(
      (sum, income) => sum + Number(income.amount),
      0
    );

    // 按类别分组并计算总和
    const expensesByCategory = expenseItems.reduce((acc, expense) => {
      const category = expense.description || getExpenseTypeLabel(expense.type);
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    // 计算总支出
    const totalExpense = Object.values(expensesByCategory).reduce(
      (sum, amount) => sum + amount,
      0
    );

    // 计算可支配收入（总收入 - 总支出）
    const disposableIncome = totalIncome - totalExpense;

    // 转换为饼图数据格式并计算百分比（以总收入为分母）
    const expensesData = Object.entries(expensesByCategory).map(
      ([category, amount]) => {
        const percentage =
          totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(2) : "0";
        return {
          type: category,
          value: percentage,
          amount: amount,
          isExpense: true,
        };
      }
    );

    console.log("expensesData :>> ", expensesData);

    // 添加可支配收入项
    const disposableIncomeItem = {
      type: "可支配收入",
      value:
        totalIncome > 0
          ? ((disposableIncome / totalIncome) * 100).toFixed(2)
          : "0",
      amount: disposableIncome,
      isExpense: false,
    };

    // 合并支出数据和可支配收入
    return [...expensesData, disposableIncomeItem];
  }, [expenseItems, incomeItems]);

  // 生成图表配置
  const chartSpec = useMemo(() => {
    // 构建颜色映射，为可支配收入使用绿色
    const colors = {};
    chartData.forEach((item) => {
      if (!item.isExpense) {
        colors[item.type] = "#4CAF50"; // 可支配收入使用绿色
      }
    });

    return {
      type: "pie",
      data: [
        {
          id: "expenses",
          values:
            chartData.length > 1
              ? chartData
              : [{ type: "暂无数据", value: "100" }],
        },
      ],
      outerRadius: 0.8,
      innerRadius: 0.5,
      padAngle: 0.6,
      valueField: "value",
      categoryField: "type",
      colorField: "type",
      colorMap: colors,
      pie: {
        style: {
          cornerRadius: 10,
          fillOpacity: (datum) => {
            return datum.isExpense ? 1 : 0.8;
          },
        },
        state: {
          hover: {
            outerRadius: 0.85,
            stroke: "#000",
            lineWidth: 1,
          },
          selected: {
            outerRadius: 0.85,
            stroke: "#000",
            lineWidth: 1,
          },
        },
      },
      title: {
        visible: true,
        text: "总收入分配",
      },
      label: {
        visible: true,
      },
      tooltip: {
        mark: {
          content: [
            {
              key: (datum) => datum["type"],
              value: (datum) => datum["value"] + "%",
            },
            {
              key: () => "金额",
              value: (datum) => `¥${datum["amount"].toFixed(2)}`,
            },
          ],
        },
      },
    };
  }, [chartData]);

  console.log("chartData :>> ", chartData);

  return {
    chartData,
    chartSpec,
  };
};
