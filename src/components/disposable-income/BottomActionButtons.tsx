import React from "react";
import { View, Text } from "@tarojs/components";

interface BottomActionButtonsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const BottomActionButtons: React.FC<BottomActionButtonsProps> = ({
  onAddIncome,
  onAddExpense,
}) => {
  return (
    <View className="fixed bottom-6 left-0 right-0 flex justify-center">
      <View className="flex items-center bg-white rounded-full shadow-lg p-1">
        <View
          className="bg-green-500 text-white rounded-full px-4 py-2 mr-2"
          onClick={onAddIncome}
        >
          <Text className="text-sm">添加收入</Text>
        </View>
        <View
          className="bg-red-500 text-white rounded-full px-4 py-2"
          onClick={onAddExpense}
        >
          <Text className="text-sm">添加支出</Text>
        </View>
      </View>
    </View>
  );
};

export default BottomActionButtons;
