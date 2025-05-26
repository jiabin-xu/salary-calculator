import React from "react";
import { View, Text } from "@tarojs/components";
import { IncomeItem, ExpenseItem } from "../../hooks/useDisposableIncomeState";
import {
  getTypeIcon,
  getIncomeTypeLabel,
  getExpenseTypeLabel,
} from "../../utils/financialTypeUtils";

interface FinancialListItemProps {
  item: IncomeItem | ExpenseItem;
  isIncome: boolean;
  onDelete: (id: string) => void;
  onEdit?: (item: IncomeItem | ExpenseItem) => void;
}

const FinancialListItem: React.FC<FinancialListItemProps> = ({
  item,
  isIncome,
  onEdit,
}) => {
  const amount = Number(item.amount);

  // 处理点击事件，触发编辑功能
  const handleClick = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  // 获取类型标签
  const getLabel = (type: string) => {
    return isIncome ? getIncomeTypeLabel(type) : getExpenseTypeLabel(type);
  };

  // 获取背景色样式
  const getBgStyle = () => {
    return isIncome ? "from-green-50 to-green-100" : "from-red-50 to-red-100";
  };

  return (
    <View
      className={`flex items-center justify-between p-4 py-1 bg-gradient-to-r ${getBgStyle()} rounded-lg mb-3 shadow-sm active:bg-gray-50`}
      onClick={handleClick}
    >
      <View className="flex items-center">
        <View
          className={`w-12 h-12 rounded-full flex items-center justify-center mr-3`}
        >
          <Text className="text-2xl">{getTypeIcon(item.type, isIncome)}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-md block mt-1">
            {item.description || getLabel(item.type)}
          </Text>
          {/* {item.month && (
            <View className="flex items-center mt-1 px-2 py-0.5 bg-gray-100 rounded-full w-fit">
              <Text className="text-xs text-gray-600">{item.month}月</Text>
            </View>
          )} */}
        </View>
      </View>
      <View className="flex flex-col items-end">
        <Text
          className={`font-medium text-lg ${
            isIncome ? "text-green-600" : "text-red-600"
          }`}
        >
          {isIncome ? "+" : "-"}
          {amount.toFixed(0)}
        </Text>
      </View>
    </View>
  );
};

export default FinancialListItem;
