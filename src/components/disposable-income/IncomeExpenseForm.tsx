import React from "react";
import { View, Text, Switch } from "@tarojs/components";
import Taro from "@tarojs/taro";
import FormField from "../FormField";
import Input from "../Input";
import {
  IncomeItem,
  ExpenseItem,
  INCOME_TYPES,
  EXPENSE_TYPES,
} from "../../hooks/useDisposableIncomeState";

interface IncomeExpenseFormProps {
  formType: "income" | "expense";
  newIncome: IncomeItem;
  newExpense: ExpenseItem;
  setNewIncome: (income: IncomeItem) => void;
  setNewExpense: (expense: ExpenseItem) => void;
  onAdd: () => void;
  onClose: () => void;
}

const IncomeExpenseForm: React.FC<IncomeExpenseFormProps> = ({
  formType,
  newIncome,
  newExpense,
  setNewIncome,
  setNewExpense,
  onAdd,
  onClose,
}) => {
  return (
    <View className="fixed inset-0 bg-black/50 flex items-end z-50">
      <View className="bg-white w-full rounded-t-2xl p-5 animate-slide-up">
        <View className="flex justify-between items-center mb-4">
          <Text className="text-gray-800 font-medium text-lg">
            {formType === "income" ? "添加收入" : "添加支出"}
          </Text>
          <View
            className="w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            <Text className="text-gray-500">✕</Text>
          </View>
        </View>

        {formType === "income" ? (
          <View>
            <FormField label="收入类型">
              <View className="grid grid-cols-3 gap-2">
                {INCOME_TYPES.map((type) => (
                  <View
                    key={type.value}
                    className={`text-center p-2 rounded-md text-sm ${
                      newIncome.type === type.value
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      setNewIncome({ ...newIncome, type: type.value })
                    }
                  >
                    {type.label}
                  </View>
                ))}
              </View>
            </FormField>

            <FormField label="金额">
              <Input
                type="digit"
                value={newIncome.amount}
                placeholder="请输入金额"
                onChange={(value) =>
                  setNewIncome({ ...newIncome, amount: value })
                }
              />
            </FormField>

            <FormField label="描述">
              <Input
                type="text"
                value={newIncome.description}
                placeholder="可选，如发放日期等"
                onChange={(value) =>
                  setNewIncome({ ...newIncome, description: value })
                }
              />
            </FormField>

            <FormField label="是否固定收入">
              <View className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <Text className="text-gray-700 text-sm">
                  {newIncome.isFixed ? "固定收入" : "临时收入"}
                </Text>
                <Switch
                  checked={newIncome.isFixed}
                  onChange={(e) =>
                    setNewIncome({ ...newIncome, isFixed: e.detail.value })
                  }
                  color="#10B981"
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                固定收入是每月固定发生的收入，临时收入是不定期发生的收入
              </Text>
            </FormField>

            <View
              className="bg-green-500 text-white text-center p-3 rounded-lg mt-6"
              onClick={onAdd}
            >
              确认添加
            </View>
          </View>
        ) : (
          <View>
            <FormField label="支出类型">
              <View className="grid grid-cols-3 gap-2">
                {EXPENSE_TYPES.map((type) => (
                  <View
                    key={type.value}
                    className={`text-center p-2 rounded-md text-sm ${
                      newExpense.type === type.value
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      setNewExpense({ ...newExpense, type: type.value })
                    }
                  >
                    {type.label}
                  </View>
                ))}
              </View>
            </FormField>

            <FormField label="金额">
              <Input
                type="digit"
                value={newExpense.amount}
                placeholder="请输入金额"
                onChange={(value) =>
                  setNewExpense({ ...newExpense, amount: value })
                }
              />
            </FormField>

            <FormField label="描述">
              <Input
                type="text"
                value={newExpense.description}
                placeholder="可选，如扣款日期等"
                onChange={(value) =>
                  setNewExpense({ ...newExpense, description: value })
                }
              />
            </FormField>

            <FormField label="是否固定支出">
              <View className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <Text className="text-gray-700 text-sm">
                  {newExpense.isFixed ? "固定支出" : "临时支出"}
                </Text>
                <Switch
                  checked={newExpense.isFixed}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      isFixed: e.detail.value,
                    })
                  }
                  color="#EF4444"
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                固定支出是每月固定发生的支出，临时支出是不定期发生的支出
              </Text>
            </FormField>

            <View
              className="bg-red-500 text-white text-center p-3 rounded-lg mt-6"
              onClick={onAdd}
            >
              确认添加
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default IncomeExpenseForm;
