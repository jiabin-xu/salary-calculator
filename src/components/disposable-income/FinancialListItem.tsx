import React from "react";
import { View, Text } from "@tarojs/components";
import { IncomeItem, ExpenseItem } from "../../hooks/useDisposableIncomeState";

interface FinancialListItemProps {
  item: IncomeItem | ExpenseItem;
  isIncome: boolean;
  getLabel: (type: string) => string;
  onDelete: (id: string) => void;
}

const FinancialListItem: React.FC<FinancialListItemProps> = ({
  item,
  isIncome,
  getLabel,
  onDelete,
}) => {
  const amount = Number(item.amount);

  return (
    <View className="flex items-center justify-between p-4 bg-white rounded-lg mb-3 shadow-sm">
      <View className="flex items-center">
        <View
          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            isIncome
              ? item.isFixed
                ? "bg-green-100"
                : "bg-emerald-100"
              : item.isFixed
              ? "bg-red-100"
              : "bg-orange-100"
          }`}
        >
          <Text
            className={`text-lg ${
              isIncome
                ? item.isFixed
                  ? "text-green-600"
                  : "text-emerald-600"
                : item.isFixed
                ? "text-red-600"
                : "text-orange-600"
            }`}
          >
            {isIncome ? "+" : "-"}
          </Text>
        </View>
        <View>
          <Text className="text-gray-800 font-medium">
            {getLabel(item.type)}
            <Text className="text-xs ml-2 text-gray-500">
              {item.isFixed ? "(固定)" : "(临时)"}
            </Text>
          </Text>
          {item.description && (
            <Text className="text-gray-500 text-xs block mt-1">
              {item.description}
            </Text>
          )}
        </View>
      </View>
      <View className="flex items-center">
        <Text
          className={`font-medium mr-4 ${
            isIncome
              ? item.isFixed
                ? "text-green-600"
                : "text-emerald-600"
              : item.isFixed
              ? "text-red-600"
              : "text-orange-600"
          }`}
        >
          {isIncome ? "+" : "-"}¥{amount.toFixed(0)}
        </Text>
        <View
          className="bg-gray-100 p-2 rounded-full"
          onClick={() => onDelete(item.id)}
        >
          <View className="w-4 h-4 flex items-center justify-center">
            <Text className="text-gray-500 text-xs">✕</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FinancialListItem;
