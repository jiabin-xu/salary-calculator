import React from "react";
import { View, Text } from "@tarojs/components";

interface EarningsStatsProps {
  hourlyRate: number;
  minuteRate: number;
  secondRate: number;
}

const EarningsStats: React.FC<EarningsStatsProps> = ({
  hourlyRate,
  minuteRate,
  secondRate,
}) => {
  return (
    <View className="grid grid-cols-3 gap-4 mb-6">
      <View className="bg-gray-50 rounded-lg p-3 text-center">
        <Text className="text-blue-600 font-bold text-lg block">
          ¥{hourlyRate.toFixed(2)}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">时薪</Text>
      </View>
      <View className="bg-gray-50 rounded-lg p-3 text-center">
        <Text className="text-blue-600 font-bold text-lg block">
          ¥{minuteRate.toFixed(2)}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">分钟收入</Text>
      </View>
      <View className="bg-gray-50 rounded-lg p-3 text-center">
        <Text className="text-blue-600 font-bold text-lg block">
          ¥{secondRate.toFixed(3)}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">秒收入</Text>
      </View>
    </View>
  );
};

export default EarningsStats;
