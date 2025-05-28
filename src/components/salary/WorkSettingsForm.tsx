import React from "react";
import { View, Text, Button, Picker } from "@tarojs/components";
import Input from "../Input";

interface WorkSettingsFormProps {
  monthlySalary: string;
  workStartTime: string;
  workEndTime: string;
  onMonthlySalaryChange: (value: string) => void;
  onStartTimeChange: (e: any) => void;
  onEndTimeChange: (e: any) => void;
  onSubmit: () => void;
}

const WorkSettingsForm: React.FC<WorkSettingsFormProps> = ({
  monthlySalary,
  workStartTime,
  workEndTime,
  onMonthlySalaryChange,
  onStartTimeChange,
  onEndTimeChange,
  onSubmit,
}) => {
  return (
    <View className="mx-4">
      <View className="bg-white rounded-lg shadow-md p-6 mb-4">
        <View className="mb-6">
          <Text className="text-gray-600 mb-2 block">月工资（元）：</Text>
          <View className="relative">
            <Input
              type="digit"
              value={monthlySalary}
              onChange={onMonthlySalaryChange}
              placeholder="请输入月工资"
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-600 mb-2 block">上班时间：</Text>
          <Picker
            mode="time"
            value={workStartTime}
            onChange={onStartTimeChange}
          >
            <View className="rounded-lg bg-gray-50 h-11 px-3 flex items-center justify-between">
              <Text className="text-base text-gray-700">{workStartTime}</Text>
              <View className="w-4 h-4">
                <Text className="text-gray-400">▼</Text>
              </View>
            </View>
          </Picker>
        </View>

        <View className="mb-6">
          <Text className="text-gray-600 mb-2 block">下班时间：</Text>
          <Picker mode="time" value={workEndTime} onChange={onEndTimeChange}>
            <View className="rounded-lg bg-gray-50 h-11 px-3 flex items-center justify-between">
              <Text className="text-base text-gray-700">{workEndTime}</Text>
              <View className="w-4 h-4">
                <Text className="text-gray-400">▼</Text>
              </View>
            </View>
          </Picker>
        </View>

        <Button
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold text-lg flex items-center justify-center shadow-md active:transform active:scale-98 transition-transform duration-200"
          onClick={onSubmit}
        >
          开始上班
        </Button>
      </View>

      <View className="bg-white rounded-lg shadow-md p-4">
        <Text className="text-gray-500 text-sm text-center block">
          设置好工作时间后点击"开始上班"
        </Text>
        <Text className="text-gray-500 text-sm text-center block mt-1">
          即可开始追踪今日实时收入
        </Text>
      </View>
    </View>
  );
};

export default WorkSettingsForm;
