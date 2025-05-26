import React from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import { IncomeItem, ExpenseItem } from "../../hooks/useDisposableIncomeState";
import FinancialListItem from "./FinancialListItem";

interface FinancialItemsListProps {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  filterType: "all" | "income" | "expense";
  getIncomeTypeLabel: (type: string) => string;
  getExpenseTypeLabel: (type: string) => string;
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  onEditIncome?: (item: IncomeItem) => void;
  onEditExpense?: (item: ExpenseItem) => void;
  onFilterChange: (type: "all" | "income" | "expense") => void;
}

const FinancialItemsList: React.FC<FinancialItemsListProps> = ({
  incomeItems,
  expenseItems,
  filterType,
  getIncomeTypeLabel,
  getExpenseTypeLabel,
  deleteIncome,
  deleteExpense,
  onEditIncome,
  onEditExpense,
  onFilterChange,
}) => {
  return (
    <View className="mt-4 mx-4">
      <View className="flex justify-between items-center mb-3">
        <Text className="text-gray-800 font-medium">收支明细</Text>
        <View className="flex">
          <Text
            className={`text-xs px-3 py-1 rounded-full mr-2 ${
              filterType === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => onFilterChange("all")}
          >
            全部
          </Text>
          <Text
            className={`text-xs px-3 py-1 rounded-full mr-2 ${
              filterType === "income"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => onFilterChange("income")}
          >
            收入
          </Text>
          <Text
            className={`text-xs px-3 py-1 rounded-full ${
              filterType === "expense"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-600"
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
          incomeItems.map((item) => (
            <FinancialListItem
              key={item.id}
              item={item}
              isIncome={true}
              getLabel={getIncomeTypeLabel}
              onDelete={deleteIncome}
              onEdit={onEditIncome}
            />
          ))}

        {/* 支出项目 */}
        {(filterType === "all" || filterType === "expense") &&
          expenseItems.map((item) => (
            <FinancialListItem
              key={item.id}
              item={item}
              isIncome={false}
              getLabel={getExpenseTypeLabel}
              onDelete={deleteExpense}
              onEdit={onEditExpense}
            />
          ))}

        {/* 无数据提示 */}
        {((filterType === "all" &&
          incomeItems.length === 0 &&
          expenseItems.length === 0) ||
          (filterType === "income" && incomeItems.length === 0) ||
          (filterType === "expense" && expenseItems.length === 0)) && (
          <View className="flex flex-col items-center justify-center py-10">
            <View className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Text className="text-gray-400 text-2xl">📊</Text>
            </View>
            <Text className="text-gray-400 text-sm">暂无收支记录</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FinancialItemsList;
