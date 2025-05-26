import React, { useState } from "react";
import { View, Text, ScrollView, Picker } from "@tarojs/components";
import { IncomeItem, ExpenseItem } from "../../hooks/useDisposableIncomeState";
import FinancialListItem from "./FinancialListItem";

interface FinancialItemsListProps {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  filterType: "all" | "income" | "expense";
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  onEditIncome?: (item: IncomeItem) => void;
  onEditExpense?: (item: ExpenseItem) => void;
  onFilterChange: (type: "all" | "income" | "expense") => void;
  onMonthChange?: (month: number | null) => void;
  selectedMonth: number | null;
}

const FinancialItemsList: React.FC<FinancialItemsListProps> = ({
  incomeItems,
  expenseItems,
  filterType,
  deleteIncome,
  deleteExpense,
  onEditIncome,
  onEditExpense,
  onFilterChange,
  onMonthChange,
  selectedMonth,
}) => {
  // 月份选项
  const monthOptions = [
    { label: "全部月份", value: null },
    ...Array.from({ length: 12 }, (_, i) => ({
      label: `${i + 1}月`,
      value: i + 1,
    })),
  ];

  // 根据月份筛选收入项目
  const filteredIncomeItems = selectedMonth
    ? incomeItems.filter((item) => item.month === selectedMonth)
    : incomeItems;

  // 根据月份筛选支出项目
  const filteredExpenseItems = selectedMonth
    ? expenseItems.filter((item) => item.month === selectedMonth)
    : expenseItems;

  // 处理月份选择
  const handleMonthChange = (e) => {
    const monthIndex = e.detail.value;
    const newMonth = monthOptions[monthIndex].value;
    if (onMonthChange) {
      onMonthChange(newMonth);
    }
  };

  // 找到当前选择的月份在选项中的索引
  const currentMonthIndex = selectedMonth
    ? monthOptions.findIndex((option) => option.value === selectedMonth)
    : 0;

  // 月份相关图标/季节样式
  const getMonthIcon = (month: number | null) => {
    if (month === null) return "📅"; // 日历图标表示全部月份

    // 根据季节返回不同图标
    if (month >= 3 && month <= 5) return "🌸"; // 春季
    if (month >= 6 && month <= 8) return "☀️"; // 夏季
    if (month >= 9 && month <= 11) return "🍂"; // 秋季
    return "❄️"; // 冬季
  };

  return (
    <View className="mt-4 mx-4">
      <View className="flex justify-between items-center mb-3">
        <Text className="text-gray-800 font-medium">收支明细</Text>
        <View className="flex items-center bg-gray-100 rounded-full p-1">
          <Text
            className={`text-xs px-3 py-1.5 rounded-full mr-1 ${
              filterType === "all"
                ? "bg-gray-800 text-white"
                : "bg-transparent text-gray-600"
            }`}
            onClick={() => onFilterChange("all")}
          >
            全部
          </Text>
          <Text
            className={`text-xs px-3 py-1.5 rounded-full mr-1 ${
              filterType === "income"
                ? "bg-green-600 text-white"
                : "bg-transparent text-gray-600"
            }`}
            onClick={() => onFilterChange("income")}
          >
            收入
          </Text>
          <Text
            className={`text-xs px-3 py-1.5 rounded-full ${
              filterType === "expense"
                ? "bg-red-600 text-white"
                : "bg-transparent text-gray-600"
            }`}
            onClick={() => onFilterChange("expense")}
          >
            支出
          </Text>
        </View>
      </View>

      <ScrollView scrollY className="max-h-96">
        {/* 收入项目 */}
        {(filterType === "all" || filterType === "income") &&
          filteredIncomeItems.map((item) => (
            <FinancialListItem
              key={item.id}
              item={item}
              isIncome={true}
              onDelete={deleteIncome}
              onEdit={onEditIncome}
            />
          ))}

        {/* 支出项目 */}
        {(filterType === "all" || filterType === "expense") &&
          filteredExpenseItems.map((item) => (
            <FinancialListItem
              key={item.id}
              item={item}
              isIncome={false}
              onDelete={deleteExpense}
              onEdit={onEditExpense}
            />
          ))}

        {/* 无数据提示 */}
        {((filterType === "all" &&
          filteredIncomeItems.length === 0 &&
          filteredExpenseItems.length === 0) ||
          (filterType === "income" && filteredIncomeItems.length === 0) ||
          (filterType === "expense" && filteredExpenseItems.length === 0)) && (
          <View className="flex flex-col items-center justify-center py-10">
            <View className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Text className="text-gray-400 text-2xl">
                {selectedMonth ? getMonthIcon(selectedMonth) : "📊"}
              </Text>
            </View>
            <Text className="text-gray-400 text-sm">
              {selectedMonth
                ? `${selectedMonth}月暂无${
                    filterType === "income"
                      ? "收入"
                      : filterType === "expense"
                      ? "支出"
                      : "收支"
                  }记录`
                : "暂无收支记录"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FinancialItemsList;
