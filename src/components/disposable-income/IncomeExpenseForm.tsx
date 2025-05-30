import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import FormField from "../FormField";
import Input from "../Input";
import { IncomeItem, ExpenseItem } from "../../hooks/useDisposableIncomeState";
import { INCOME_TYPES, EXPENSE_TYPES } from "../../utils/financialTypeUtils";

interface IncomeExpenseFormProps {
  formType: "income" | "expense";
  newIncome?: IncomeItem;
  newExpense?: ExpenseItem;
  selectedItem?: IncomeItem | ExpenseItem;
  onSubmit: (data: IncomeItem | ExpenseItem) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const IncomeExpenseForm: React.FC<IncomeExpenseFormProps> = ({
  formType,
  newIncome,
  newExpense,
  selectedItem,
  onSubmit,
  onClose,
  onDelete,
}) => {
  // 本地状态，用于跟踪表单中的数据变化
  const [formData, setFormData] = useState<IncomeItem | ExpenseItem>(
    formType === "income"
      ? (selectedItem as IncomeItem) ||
          newIncome || {
            id: "",
            type: "salary",
            amount: "",
            description: "",
            isFixed: true,
          }
      : (selectedItem as ExpenseItem) ||
          newExpense || {
            id: "",
            type: "rent",
            amount: "",
            description: "",
            isFixed: true,
          }
  );

  // 当选中的项目改变时，更新表单数据
  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem);
    }
  }, [selectedItem]);

  // 更新表单数据
  const updateFormData = (data: Partial<IncomeItem | ExpenseItem>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // 提交表单
  const handleSubmit = () => {
    onSubmit(formData);
  };

  // 处理删除
  const handleDelete = () => {
    if (selectedItem && onDelete) {
      onDelete(selectedItem.id);
      onClose();
    }
  };

  return (
    <View className="fixed inset-0 bg-black/50 flex items-end z-50">
      <View className="bg-white w-full rounded-t-2xl p-5 pb-12 animate-slide-up">
        <View className="flex justify-between items-center mb-4">
          <Text className="text-gray-800 font-medium text-lg">
            {selectedItem
              ? formType === "income"
                ? "编辑收入"
                : "编辑支出"
              : formType === "income"
              ? "添加收入"
              : "添加支出"}
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
                      formData.type === type.value
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => updateFormData({ type: type.value })}
                  >
                    {type.label}
                  </View>
                ))}
              </View>
            </FormField>

            <FormField label="金额">
              <Input
                type="digit"
                value={formData.amount}
                placeholder="请输入金额"
                onChange={(value) => updateFormData({ amount: value })}
              />
            </FormField>

            <FormField label="备注说明">
              <Input
                type="text"
                value={formData.description}
                placeholder="如爸爸的工资、副业收入等"
                onChange={(value) => updateFormData({ description: value })}
              />
            </FormField>

            <View className="mt-6">
              <View className="flex flex-row gap-2">
                <View
                  className="bg-green-500 text-white text-center p-3 rounded-lg flex-grow"
                  onClick={handleSubmit}
                >
                  {selectedItem ? "保存修改" : "确认添加"}
                </View>

                {selectedItem && onDelete && (
                  <View
                    className="bg-gray-200 text-gray-700 text-center p-3 rounded-lg w-20"
                    onClick={handleDelete}
                  >
                    删除
                  </View>
                )}
              </View>
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
                      formData.type === type.value
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => updateFormData({ type: type.value })}
                  >
                    {type.label}
                  </View>
                ))}
              </View>
            </FormField>

            <FormField label="每月金额">
              <Input
                type="digit"
                value={formData.amount}
                placeholder="请输入金额"
                onChange={(value) => updateFormData({ amount: value })}
              />
            </FormField>

            <FormField label="备注说明">
              <Input
                type="text"
                value={formData.description}
                placeholder="如每月房租、教育基金等"
                onChange={(value) => updateFormData({ description: value })}
              />
            </FormField>

            <View className="mt-6">
              <View className="flex flex-row gap-2">
                <View
                  className="bg-red-500 text-white text-center p-3 rounded-lg flex-grow"
                  onClick={handleSubmit}
                >
                  {selectedItem ? "保存修改" : "确认添加"}
                </View>

                {selectedItem && onDelete && (
                  <View
                    className="bg-gray-200 text-gray-700 text-center p-3 rounded-lg w-20"
                    onClick={handleDelete}
                  >
                    删除
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default IncomeExpenseForm;
