import React from "react";
import { View, Text } from "@tarojs/components";

interface EarningsDisplayProps {
  workStartTime: string;
  workEndTime: string;
  currentEarnings: number;
  isWorkEnded: boolean;
  isBeforeWork: boolean;
}

const EarningsDisplay: React.FC<EarningsDisplayProps> = ({
  workStartTime,
  workEndTime,
  currentEarnings,
  isWorkEnded,
  isBeforeWork,
}) => {
  const getStatusColor = () => {
    if (isWorkEnded) return "from-green-500 to-green-600";
    if (isBeforeWork) return "from-gray-400 to-gray-500";
    return "from-blue-500 to-blue-600";
  };

  const getStatusText = () => {
    if (isWorkEnded) return "今日工作已结束 ✨";
    if (isBeforeWork) return "工作即将开始 ⏰";
    return `距离下班还有 ${workEndTime} 🌟`;
  };

  const getEarningsText = () => {
    if (isWorkEnded) return "今日总收入";
    if (isBeforeWork) return "准备开始";
    return "当前已赚取";
  };

  return (
    <View className="bg-white rounded-lg shadow-md p-6 mb-4">
      <View className="text-center mb-4">
        <Text className="text-gray-600 text-sm">
          今日工作时间：{workStartTime} - {workEndTime}
        </Text>
        <Text
          className={`${
            isWorkEnded
              ? "text-green-500"
              : isBeforeWork
              ? "text-gray-500"
              : "text-blue-500"
          } text-sm block mt-1`}
        >
          {getStatusText()}
        </Text>
      </View>

      <View
        className={`bg-gradient-to-r ${getStatusColor()} rounded-lg p-6 mb-6 relative overflow-hidden`}
      >
        <View className="relative z-10">
          <Text className="text-white text-lg opacity-90">
            {getEarningsText()}
          </Text>
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
