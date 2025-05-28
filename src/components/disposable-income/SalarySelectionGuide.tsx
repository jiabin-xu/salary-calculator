import React from "react";
import { View, Text, Image } from "@tarojs/components";

interface FamilyFinanceGuideProps {
  onStart: () => void;
}

const FamilyFinanceGuide: React.FC<FamilyFinanceGuideProps> = ({ onStart }) => {
  return (
    <View className="flex flex-col items-center justify-center h-screen bg-blue-50 px-6">
      <Image
        src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        className="w-48 h-48 rounded-full object-cover mb-8"
      />
      <Text className="text-2xl font-bold text-blue-800 mb-3">
        智能记账助手
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        1分钟建立个人财务计划，轻松掌握收支状况，让每一分钱都花得值得。告别月光，从智能记账开始！
      </Text>
      <View
        className="bg-blue-600 text-white text-center p-4 rounded-lg w-full"
        onClick={onStart}
      >
        开启理财之旅
      </View>
      <Text className="text-xs text-gray-500 mt-4">
        一站式管理工资、投资、支出，让财务管理变得简单有趣
      </Text>
    </View>
  );
};

export default FamilyFinanceGuide;
