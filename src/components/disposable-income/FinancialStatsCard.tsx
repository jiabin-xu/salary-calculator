import React from "react";
import { View, Text } from "@tarojs/components";
import { FinancialSummary } from "../../hooks/useDisposableIncomeState";

interface FinancialStatsCardProps {
  title: string;
  summary: {
    value: number;
    total: number;
    color: string;
    bgColor: string;
  };
}

const FinancialStatsCard: React.FC<FinancialStatsCardProps> = ({
  title,
  summary,
}) => {
  return (
    <View className="bg-white rounded-lg shadow p-3">
      <Text className="text-gray-600 text-xs mb-1">{title}</Text>
      <Text className={`${summary.color} font-medium text-lg`}>
        ¥{summary.value.toFixed(0)}
      </Text>
      <View className="w-full h-1 bg-gray-100 rounded-full mt-2">
        <View
          className={`h-full ${summary.bgColor} rounded-full`}
          style={{
            width: `${
              summary.total > 0 ? (summary.value / summary.total) * 100 : 0
            }%`,
          }}
        />
      </View>
    </View>
  );
};

export const FinancialStatsSummary: React.FC<{
  summary: FinancialSummary;
}> = ({ summary }) => {
  return (
    <View className="mx-4 mt-4 grid grid-cols-2 gap-3">
      <FinancialStatsCard
        title="固定收入"
        summary={{
          value: summary.fixedIncome,
          total: summary.totalIncome,
          color: "text-green-600",
          bgColor: "bg-green-500",
        }}
      />

      <FinancialStatsCard
        title="临时收入"
        summary={{
          value: summary.temporaryIncome,
          total: summary.totalIncome,
          color: "text-emerald-600",
          bgColor: "bg-emerald-500",
        }}
      />

      <FinancialStatsCard
        title="固定支出"
        summary={{
          value: summary.fixedExpense,
          total: summary.totalExpense,
          color: "text-red-600",
          bgColor: "bg-red-500",
        }}
      />

      <FinancialStatsCard
        title="临时支出"
        summary={{
          value: summary.temporaryExpense,
          total: summary.totalExpense,
          color: "text-orange-600",
          bgColor: "bg-orange-500",
        }}
      />
    </View>
  );
};

export default FinancialStatsCard;
