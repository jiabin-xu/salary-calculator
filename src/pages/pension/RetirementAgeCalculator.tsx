import { View, Picker } from "@tarojs/components";
import { useState } from "react";
import FormField from "@/components/FormField";

interface RetirementAgeFormData {
  birthDate: string;
  workerType: string;
}

const workerTypeOptions = [
  "男职工",
  "原法定退休年龄55周岁女职工",
  "原法定退休年龄50周岁女职工",
];

export default function RetirementAgeCalculator() {
  const [formData, setFormData] = useState<RetirementAgeFormData>({
    birthDate: "1990-01-01",
    workerType: "男职工",
  });
  const [result, setResult] = useState<{
    retirementAge: string;
    retirementDate: string;
    delayMonths: number;
  } | null>(null);

  const calculateRetirementAge = () => {
    if (!formData.birthDate || !formData.workerType) {
      return;
    }

    const birthDate = new Date(formData.birthDate);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;

    let retirementAge = "";
    let delayMonths = 0;
    let retirementDate = "";

    // 计算到2025年1月的月数
    const calculateMonthsTo2025 = () => {
      // 计算原本退休时间到2025年1月的月数
      const originalRetirementYear = (() => {
        if (formData.workerType === "男职工") return birthYear + 60;
        if (formData.workerType === "原法定退休年龄50周岁女职工")
          return birthYear + 50;
        return birthYear + 55; // 原法定退休年龄55周岁女职工
      })();
      const originalRetirementMonth = birthMonth;

      // 特殊处理1965年1-4月出生的男职工
      if (
        formData.workerType === "男职工" &&
        birthYear === 1965 &&
        birthMonth >= 1 &&
        birthMonth <= 4
      ) {
        return 1; // 直接返回1个月的延迟
      }

      // 特殊处理1975年1-2月出生的50周岁女职工
      if (
        formData.workerType === "原法定退休年龄50周岁女职工" &&
        birthYear === 1975 &&
        birthMonth >= 1 &&
        birthMonth <= 2
      ) {
        return 1; // 直接返回1个月的延迟
      }

      // 特殊处理1970年1-4月出生的55周岁女职工
      if (
        formData.workerType === "原法定退休年龄55周岁女职工" &&
        birthYear === 1970 &&
        birthMonth >= 1 &&
        birthMonth <= 4
      ) {
        return 1; // 直接返回1个月的延迟
      }

      // 如果原本退休时间在2025年1月之前，返回0
      if (
        originalRetirementYear < 2025 ||
        (originalRetirementYear === 2025 && originalRetirementMonth < 1)
      ) {
        return 0;
      }

      // 计算从2025年1月到原本退休时间的月数
      const monthsDiff =
        (originalRetirementYear - 2025) * 12 + (originalRetirementMonth - 1);
      return Math.max(0, monthsDiff);
    };

    const monthsTo2025 = calculateMonthsTo2025();

    if (formData.workerType === "男职工") {
      // 男职工计算逻辑
      if (birthYear < 1965) {
        retirementAge = "60周岁";
        delayMonths = 0;
      } else if (birthYear > 1976 || (birthYear === 1976 && birthMonth >= 9)) {
        retirementAge = "63周岁";
        delayMonths = 36;
      } else {
        // 特殊处理1965年1-4月出生的情况
        if (birthYear === 1965 && birthMonth >= 1 && birthMonth <= 4) {
          delayMonths = 1;
        } else {
          // 每4个月延迟1个月
          delayMonths = Math.ceil(monthsTo2025 / 4);
        }
        delayMonths = Math.min(36, delayMonths); // 最多延迟36个月（3年）
        retirementAge = `60周岁零${delayMonths}个月`;
      }
    } else if (formData.workerType === "原法定退休年龄50周岁女职工") {
      // 原50岁女职工计算逻辑
      if (birthYear < 1975) {
        retirementAge = "50周岁";
        delayMonths = 0;
      } else {
        // 特殊处理1975年1-2月出生的情况
        if (birthYear === 1975 && birthMonth >= 1 && birthMonth <= 2) {
          delayMonths = 1;
        } else {
          // 每2个月延迟1个月
          delayMonths = Math.ceil(monthsTo2025 / 2);
        }
        delayMonths = Math.min(60, delayMonths); // 最多延迟60个月（5年）
        retirementAge = `${50 + Math.floor(delayMonths / 12)}周岁零${
          delayMonths % 12
        }个月`;
      }
    } else if (formData.workerType === "原法定退休年龄55周岁女职工") {
      // 原55岁女职工计算逻辑
      if (birthYear < 1970) {
        retirementAge = "55周岁";
        delayMonths = 0;
      } else {
        // 特殊处理1970年1-4月出生的情况
        if (birthYear === 1970 && birthMonth >= 1 && birthMonth <= 4) {
          delayMonths = 1;
        } else {
          // 每4个月延迟1个月
          delayMonths = Math.ceil(monthsTo2025 / 4);
        }
        delayMonths = Math.min(36, delayMonths); // 最多延迟36个月（3年）
        retirementAge = `${55 + Math.floor(delayMonths / 12)}周岁零${
          delayMonths % 12
        }个月`;
      }
    }

    // 计算具体退休时间
    const calculateRetirementDate = () => {
      const baseRetirementAge = (() => {
        if (formData.workerType === "男职工") return 60;
        if (formData.workerType === "原法定退休年龄50周岁女职工") return 50;
        return 55;
      })();

      let retirementYear =
        birthYear + baseRetirementAge + Math.floor(delayMonths / 12);
      let retirementMonth = birthMonth + (delayMonths % 12);

      // 处理月份超过12的情况
      if (retirementMonth > 12) {
        retirementYear += Math.floor((retirementMonth - 1) / 12);
        retirementMonth = ((retirementMonth - 1) % 12) + 1;
      }

      return `${retirementYear}年${retirementMonth}月`;
    };

    retirementDate = calculateRetirementDate();

    setResult({
      retirementAge,
      retirementDate,
      delayMonths,
    });
  };

  return (
    <>
      <View className="bg-white rounded-lg mx-4 p-6">
        <View className="mb-8">
          <View className="text-lg font-bold mb-2 text-gray-700">
            第一步：基本信息
          </View>
          <FormField
            label="出生年月"
            required
            inline
            labelClassName="text-base"
          >
            <Picker
              mode="date"
              start="1925-01-01"
              value={formData.birthDate}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, birthDate: e.detail.value }));
                console.log(e.detail.value);
                setResult(null);
              }}
            >
              <View className="bg-gray-50 p-3 rounded-lg text-base">
                {formData.birthDate || "请选择出生年月"}
              </View>
            </Picker>
          </FormField>

          <FormField
            label="人员类型"
            required
            inline
            labelClassName="text-base"
          >
            <Picker
              mode="selector"
              range={workerTypeOptions}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  workerType: workerTypeOptions[e.detail.value],
                }));
                setResult(null);
              }}
            >
              <View className="bg-gray-50 p-3 rounded-lg text-base">
                {formData.workerType || "请选择人员类型"}
              </View>
            </Picker>
          </FormField>
        </View>

        <View
          className={`py-4 text-center text-lg rounded-lg ${
            !formData.birthDate || !formData.workerType
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white active:bg-blue-700"
          }`}
          onClick={calculateRetirementAge}
        >
          立即查询
        </View>
      </View>

      {result && (
        <View className="p-6 bg-blue-50 rounded-lg border-2 border-blue-100">
          <View className="text-center text-xl font-bold text-gray-700 mb-6">
            计算结果
          </View>
          <View className="space-y-4">
            <View className="flex justify-between items-center py-2 border-b border-gray-200">
              <View className="text-gray-600">您的改革后退休年龄为</View>
              <View className="text-xl font-bold text-blue-600">
                {result.retirementAge}
              </View>
            </View>
            <View className="flex justify-between items-center py-2 border-b border-gray-200">
              <View className="text-gray-600">您的改革后退休时间为</View>
              <View className="text-xl font-bold text-blue-600">
                {result.retirementDate}
              </View>
            </View>
            <View className="flex justify-between items-center py-2 border-b border-gray-200">
              <View className="text-gray-600">您的延迟月数为</View>
              <View className="text-xl font-bold text-blue-600">
                {result.delayMonths}个月
              </View>
            </View>
          </View>
          <View className="mt-4 text-sm text-gray-500 text-center">
            *根据最新退休政策计算
          </View>
        </View>
      )}
    </>
  );
}
