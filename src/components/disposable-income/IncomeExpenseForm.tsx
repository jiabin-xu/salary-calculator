import React, { useState, useEffect } from "react";
import { View, Text, Switch, Picker } from "@tarojs/components";
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
  newIncome?: IncomeItem;
  newExpense?: ExpenseItem;
  selectedItem?: IncomeItem | ExpenseItem;
  onSubmit: (data: IncomeItem | ExpenseItem) => void;
  onClose: () => void;
}

const IncomeExpenseForm: React.FC<IncomeExpenseFormProps> = ({
  formType,
  newIncome,
  newExpense,
  selectedItem,
  onSubmit,
  onClose,
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
            month: new Date().getMonth() + 1, // 默认为当前月份
          }
      : (selectedItem as ExpenseItem) ||
          newExpense || {
            id: "",
            type: "rent",
            amount: "",
            description: "",
            isFixed: true,
            month: new Date().getMonth() + 1, // 默认为当前月份
          }
  );

  // 月份选项
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: i + 1,
  }));

  // 当选中的项目改变时，更新表单数据
  useEffect(() => {
    if (selectedItem) {
      // 如果selectedItem没有month属性，添加当前月份
      const updatedItem = {
        ...selectedItem,
        month: selectedItem.month || new Date().getMonth() + 1,
      };
      setFormData(updatedItem);
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

  // 处理月份选择
  const handleMonthChange = (e) => {
    const monthIndex = e.detail.value;
    updateFormData({ month: monthOptions[monthIndex].value });
  };

  // 找到当前月份在选项中的索引
  const currentMonthIndex = monthOptions.findIndex(
    (option) => option.value === formData.month
  );

  return (
    <View className="fixed inset-0 bg-black/50 flex items-end z-50">
      <View className="bg-white w-full rounded-t-2xl p-5 animate-slide-up">
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

            <FormField label="月份">
              <Picker
                mode="selector"
                range={monthOptions}
                rangeKey="label"
                onChange={handleMonthChange}
                value={currentMonthIndex >= 0 ? currentMonthIndex : 0}
              >
                <View className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                  <Text className="text-gray-700">
                    {formData.month ? `${formData.month}月` : "请选择月份"}
                  </Text>
                  <Text className="text-gray-500">▼</Text>
                </View>
              </Picker>
            </FormField>

            <FormField label="描述">
              <Input
                type="text"
                value={formData.description}
                placeholder="可选，如发放日期等"
                onChange={(value) => updateFormData({ description: value })}
              />
            </FormField>

            <FormField label="是否固定收入">
              <View className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <Text className="text-gray-700 text-sm">
                  {formData.isFixed ? "固定收入" : "临时收入"}
                </Text>
                <Switch
                  checked={formData.isFixed}
                  onChange={(e) => updateFormData({ isFixed: e.detail.value })}
                  color="#10B981"
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                固定收入是每月固定发生的收入，临时收入是不定期发生的收入
              </Text>
            </FormField>

            <View
              className="bg-green-500 text-white text-center p-3 rounded-lg mt-6"
              onClick={handleSubmit}
            >
              {selectedItem ? "保存修改" : "确认添加"}
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

            <FormField label="金额">
              <Input
                type="digit"
                value={formData.amount}
                placeholder="请输入金额"
                onChange={(value) => updateFormData({ amount: value })}
              />
            </FormField>

            <FormField label="月份">
              <Picker
                mode="selector"
                range={monthOptions}
                rangeKey="label"
                onChange={handleMonthChange}
                value={currentMonthIndex >= 0 ? currentMonthIndex : 0}
              >
                <View className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                  <Text className="text-gray-700">
                    {formData.month ? `${formData.month}月` : "请选择月份"}
                  </Text>
                  <Text className="text-gray-500">▼</Text>
                </View>
              </Picker>
            </FormField>

            <FormField label="描述">
              <Input
                type="text"
                value={formData.description}
                placeholder="可选，如扣款日期等"
                onChange={(value) => updateFormData({ description: value })}
              />
            </FormField>

            <FormField label="是否固定支出">
              <View className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <Text className="text-gray-700 text-sm">
                  {formData.isFixed ? "固定支出" : "临时支出"}
                </Text>
                <Switch
                  checked={formData.isFixed}
                  onChange={(e) =>
                    updateFormData({
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
              onClick={handleSubmit}
            >
              {selectedItem ? "保存修改" : "确认添加"}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default IncomeExpenseForm;
