import React from "react";
import { View, Text } from "@tarojs/components";
import { IncomeItem, ExpenseItem } from "../../hooks/useDisposableIncomeState";

interface FinancialListItemProps {
  item: IncomeItem | ExpenseItem;
  isIncome: boolean;
  getLabel: (type: string) => string;
  onDelete: (id: string) => void;
  onEdit?: (item: IncomeItem | ExpenseItem) => void;
}

const FinancialListItem: React.FC<FinancialListItemProps> = ({
  item,
  isIncome,
  getLabel,
  onDelete,
  onEdit,
}) => {
  const amount = Number(item.amount);

  // 处理点击事件，触发编辑功能
  const handleClick = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  // 根据类型获取图标
  const getTypeIcon = (type: string, isIncome: boolean) => {
    // 收入类型图标
    if (isIncome) {
      switch (type) {
        case "salary":
          return "💼"; // 工资
        case "bonus":
          return "🎁"; // 奖金
        case "investment":
          return "📈"; // 投资
        case "rent":
          return "🏠"; // 租金
        default:
          return "💰"; // 其他收入
      }
    }
    // 支出类型图标
    else {
      switch (type) {
        case "rent":
          return "🏢"; // 房租
        case "mortgage":
          return "🏦"; // 房贷
        case "utilities":
          return "💡"; // 水电
        case "food":
          return "🍲"; // 餐饮
        case "transport":
          return "🚌"; // 交通
        case "entertainment":
          return "🎮"; // 娱乐
        case "shopping":
          return "🛍️"; // 购物
        case "medical":
          return "💊"; // 医疗
        case "education":
          return "📚"; // 教育
        case "insurance":
          return "🔒"; // 保险
        case "loan":
          return "💳"; // 贷款
        default:
          return "📝"; // 其他支出
      }
    }
  };

  return (
    <View
      className="flex items-center justify-between p-4 bg-white rounded-lg mb-3 shadow-sm active:bg-gray-50"
      onClick={handleClick}
    >
      <View className="flex items-center">
        <View
          className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
            isIncome ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <Text className="text-2xl">{getTypeIcon(item.type, isIncome)}</Text>
        </View>
        <View>
          {item.description && (
            <Text className="text-gray-500 text-xs block mt-1">
              {item.description}
            </Text>
          )}
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
          {isIncome ? "+" : "-"}¥{amount.toFixed(0)}
        </Text>
        <Text className="text-xs text-gray-400 mt-1">点击编辑</Text>
      </View>
    </View>
  );
};

export default FinancialListItem;
