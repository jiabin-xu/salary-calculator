import React from "react";
import { View, Text } from "@tarojs/components";

interface YearlyForecastCardProps {
  yearlyData: {
    income: number;
    expense: number;
    disposable: number;
  };
}

const YearlyForecastCard: React.FC<YearlyForecastCardProps> = ({
  yearlyData,
}) => {
  return (
    <View className="mx-4 -mt-6 bg-white rounded-lg shadow-md p-4 z-10 relative">
      <Text className="text-gray-800 font-medium mb-3">年度财务预测</Text>
      <View className="grid grid-cols-3 gap-2">
        <View className="text-center p-2 rounded-lg bg-blue-50">
          <Text className="text-xs text-gray-500">年收入</Text>
          <Text className="text-green-600 font-medium">
            ¥{yearlyData.income.toFixed(0)}
          </Text>
        </View>
        <View className="text-center p-2 rounded-lg bg-blue-50">
          <Text className="text-xs text-gray-500">年支出</Text>
          <Text className="text-red-600 font-medium">
            ¥{yearlyData.expense.toFixed(0)}
          </Text>
        </View>
        <View className="text-center p-2 rounded-lg bg-blue-50">
          <Text className="text-xs text-gray-500">年可支配</Text>
          <Text className="text-blue-600 font-medium">
            ¥{yearlyData.disposable.toFixed(0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default YearlyForecastCard;
