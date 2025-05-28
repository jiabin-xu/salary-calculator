import React from "react";
import { View, Text } from "@tarojs/components";

interface EarningsDisplayProps {
  workStartTime: string;
  workEndTime: string;
  currentEarnings: number;
}

const EarningsDisplay: React.FC<EarningsDisplayProps> = ({
  workStartTime,
  workEndTime,
  currentEarnings,
}) => {
  return (
    <View className="bg-white rounded-lg shadow-md p-6 mb-4">
      <View className="text-center mb-4">
        <Text className="text-gray-600 text-sm">
          今日工作时间：{workStartTime} - {workEndTime}
        </Text>
      </View>

      <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-6 relative overflow-hidden">
        <View className="relative z-10">
          <Text className="text-white text-lg opacity-90">当前已赚取</Text>
          <View className="flex items-center justify-center mt-2">
            <Text className="text-white text-2xl mr-1">¥</Text>
            <Text className="text-white text-5xl font-bold">
              {currentEarnings.toFixed(2)}
            </Text>
          </View>
        </View>
        <View className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-full scale-150 transform -translate-x-1/2 -translate-y-1/2" />
      </View>
    </View>
  );
};

export default EarningsDisplay;
