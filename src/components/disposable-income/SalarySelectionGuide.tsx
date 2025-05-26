import React from "react";
import { View, Text, Image } from "@tarojs/components";

interface SalarySelectionGuideProps {
  onSelectSalary: () => void;
}

const SalarySelectionGuide: React.FC<SalarySelectionGuideProps> = ({
  onSelectSalary,
}) => {
  return (
    <View className="flex flex-col items-center justify-center h-screen bg-blue-50 px-6">
      <Image
        src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        className="w-48 h-48 rounded-full object-cover mb-8"
      />
      <Text className="text-2xl font-bold text-blue-800 mb-3">
        开始您的财务规划
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        要开始使用可支配收入计算器，我们需要先了解您的工资收入情况。
      </Text>
      <View
        className="bg-blue-600 text-white text-center p-4 rounded-lg w-full"
        onClick={onSelectSalary}
      >
        选择工资收入
      </View>
      <Text className="text-xs text-gray-500 mt-4">
        您可以从薪资计算器中导入您的税后工资数据
      </Text>
    </View>
  );
};

export default SalarySelectionGuide;
