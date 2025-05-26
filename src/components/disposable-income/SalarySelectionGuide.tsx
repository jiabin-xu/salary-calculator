import React from "react";
import { View, Text, Image } from "@tarojs/components";

interface FamilyFinanceGuideProps {
  onStart: () => void;
}

const FamilyFinanceGuide: React.FC<FamilyFinanceGuideProps> = ({ onStart }) => {
  return (
    <View className="flex flex-col items-center justify-center h-screen bg-blue-50 px-6">
      <Image
        src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        className="w-48 h-48 rounded-full object-cover mb-8"
      />
      <Text className="text-2xl font-bold text-blue-800 mb-3">
        家庭财务规划工具
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        帮助您全面了解家庭收支状况，合理规划家庭财务，实现家庭财富稳健增长。
      </Text>
      <View
        className="bg-blue-600 text-white text-center p-4 rounded-lg w-full"
        onClick={onStart}
      >
        开始使用
      </View>
      <Text className="text-xs text-gray-500 mt-4">
        您可以分别添加家庭成员的各项收入，包括工资、投资和其他收入来源
      </Text>
    </View>
  );
};

export default FamilyFinanceGuide;
