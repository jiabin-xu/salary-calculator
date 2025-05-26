import React from "react";
import { View, Text, Image } from "@tarojs/components";
import { FinancialSummary } from "../../hooks/useDisposableIncomeState";

interface FinancialSummaryHeaderProps {
  summary: FinancialSummary;
  currentMonth: string;
  yearlyData: {
    income: number;
    expense: number;
    disposable: number;
  };
}

const FinancialSummaryHeader: React.FC<FinancialSummaryHeaderProps> = ({
  summary,
  currentMonth,
  yearlyData,
}) => {
  return (
    <View className="w-full bg-blue-500 relative overflow-hidden pb-4">
      <Image
        src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
        className="w-full h-full absolute inset-0 object-cover opacity-70"
      />
      <View className="absolute inset-0 bg-gradient-to-b from-blue-600/40 to-blue-900/60" />

      {/* 页面标题 */}
      <View className="absolute top-0 left-0 right-0 p-4">
        <Text className="text-white text-xl font-bold">可支配收入</Text>
        <Text className="text-blue-100 text-sm mt-1">管理您的收入与支出</Text>
      </View>

      {/* 本月财务概览 */}
      <View className="pt-20 px-4 relative z-10">
        <View className="flex justify-between items-end mb-4">
          <View>
            <Text className="text-white text-sm">
              {currentMonth} 可支配收入
            </Text>
            <Text className="text-white text-2xl font-bold block mt-1">
              ¥{summary.disposableIncome.toFixed(0)}
            </Text>
          </View>
          <View className="text-right">
            <Text className="text-white text-sm">全年可支配收入</Text>
            <Text className="text-white text-2xl font-bold block mt-1">
              ¥{yearlyData.disposable.toFixed(0)}
            </Text>
          </View>
        </View>

        <View className="w-full h-1 bg-white/30 rounded-full overflow-hidden mt-3">
          <View
            className="h-full bg-white"
            style={{
              width: `${Math.min(
                100,
                (1 - summary.totalExpense / Math.max(1, summary.totalIncome)) *
                  100
              )}%`,
            }}
          />
        </View>

        <View className="flex justify-between text-xs text-blue-100 mt-2">
          <Text>收入 ¥{summary.totalIncome.toFixed(0)}</Text>
          <Text>支出 ¥{summary.totalExpense.toFixed(0)}</Text>
        </View>
      </View>
    </View>
  );
};

export default FinancialSummaryHeader;
