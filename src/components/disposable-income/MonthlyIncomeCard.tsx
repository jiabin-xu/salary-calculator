import React from "react";
import { View, Text } from "@tarojs/components";

interface MonthlySalaryData {
  salary: number;
  preTaxSalary: number;
  withBonus: boolean;
  bonusAmount: number;
  bonusAfterTax: number;
}

interface MonthlyIncomeCardProps {
  monthName: string;
  monthlySalary: MonthlySalaryData;
}

const MonthlyIncomeCard: React.FC<MonthlyIncomeCardProps> = ({
  monthName,
  monthlySalary,
}) => {
  if (monthlySalary.salary <= 0) {
    return null;
  }

  return (
    <View className="mb-4">
      <Text className="text-gray-800 font-medium mb-3 block">本月工资收入</Text>
      <View className="bg-white rounded-lg p-4 shadow-sm">
        <View className="flex justify-between items-center">
          <View className="flex items-center">
            <View className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Text className="text-blue-600 text-lg">¥</Text>
            </View>
            <View>
              <Text className="text-gray-800 font-medium">{monthName}工资</Text>
              <Text className="text-xs text-gray-500 block mt-1">税后收入</Text>
            </View>
          </View>
          <Text className="text-blue-600 font-medium">
            ¥{monthlySalary.salary.toFixed(0)}
          </Text>
        </View>

        {monthlySalary.withBonus && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <View className="flex justify-between items-center">
              <View className="flex items-center">
                <View className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <Text className="text-green-600 text-sm">奖</Text>
                </View>
                <Text className="text-gray-800">年终奖</Text>
              </View>
              <Text className="text-green-600 font-medium">
                ¥{monthlySalary.bonusAfterTax.toFixed(0)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MonthlyIncomeCard;
