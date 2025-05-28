import React, { useState } from "react";
import { View, Text, ScrollView, Picker } from "@tarojs/components";
import { IncomeItem, ExpenseItem } from "../../hooks/useDisposableIncomeState";
import FinancialListItem from "./FinancialListItem";

interface FinancialItemsListProps {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  filterType: "all" | "income" | "expense";
  onEditIncome: (item: IncomeItem) => void;
  onEditExpense: (item: ExpenseItem) => void;
  onFilterChange: (type: "all" | "income" | "expense") => void;
}

const FinancialItemsList: React.FC<FinancialItemsListProps> = ({
  incomeItems,
  expenseItems,
  filterType,

  onEditIncome,
  onEditExpense,
  onFilterChange,
}) => {
  // 根据月份筛选收入项目
  const filteredIncomeItems = incomeItems;

  // 根据月份筛选支出项目
  const filteredExpenseItems = expenseItems;

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
              <Text className="text-gray-400 text-2xl">{"📊"}</Text>
            </View>
            <Text className="text-gray-400 text-sm">
              {"开始记录您的第一笔收支吧！"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FinancialItemsList;
