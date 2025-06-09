import { View, Picker } from "@tarojs/components";
import { useState } from "react";
import FormField from "@/components/FormField";

interface RetirementAgeFormData {
  birthDate: string;
  gender: string;
  workType: string;
}

const genderOptions = ["男", "女"];
const workTypeOptions = [
  "普通职工",
  "女职工(原50岁退休)",
  "女职工(原55岁退休)",
];

export default function RetirementAgeCalculator() {
  const [formData, setFormData] = useState<RetirementAgeFormData>({
    birthDate: "",
    gender: "",
    workType: "",
  });
  const [result, setResult] = useState<string>("");

  const calculateRetirementAge = () => {
    if (!formData.birthDate || !formData.gender || !formData.workType) {
      return;
    }

    const birthDate = new Date(formData.birthDate);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;

    let retirementAge = "";

    if (formData.workType === "普通职工" && formData.gender === "男") {
      // 男职工计算逻辑
      if (birthYear < 1965) {
        retirementAge = "60周岁";
      } else if (birthYear > 1976 || (birthYear === 1976 && birthMonth >= 9)) {
        retirementAge = "63周岁";
      } else {
        const monthsAfter2025 = (birthYear - 1965) * 12 + birthMonth;
        const delayMonths = Math.floor(monthsAfter2025 / 4);
        retirementAge = `60周岁零${delayMonths}个月`;
      }
    } else if (formData.workType === "女职工(原50岁退休)") {
      // 原50岁女职工计算逻辑
      if (birthYear < 1975) {
        retirementAge = "50周岁";
      } else {
        const monthsAfter2025 = (birthYear - 1975) * 12 + birthMonth;
        const delayMonths = Math.min(60, Math.ceil(monthsAfter2025 / 2));
        retirementAge = `${50 + Math.floor(delayMonths / 12)}周岁零${
          delayMonths % 12
        }个月`;
      }
    } else if (formData.workType === "女职工(原55岁退休)") {
      // 原55岁女职工计算逻辑
      if (birthYear < 1970) {
        retirementAge = "55周岁";
      } else {
        const monthsAfter2025 = (birthYear - 1970) * 12 + birthMonth;
        const delayMonths = Math.min(36, Math.ceil(monthsAfter2025 / 4));
        retirementAge = `${55 + Math.floor(delayMonths / 12)}周岁零${
          delayMonths % 12
        }个月`;
      }
    }

    setResult(retirementAge);
  };

  return (
    <View className="bg-white rounded-lg mx-4 p-6">
      <View className="mb-8">
        <View className="text-lg font-bold mb-2 text-gray-700">
          第一步：基本信息
        </View>
        <FormField label="出生年月" required inline labelClassName="text-base">
          <Picker
            mode="date"
            value={formData.birthDate}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, birthDate: e.detail.value }));
              setResult("");
            }}
          >
            <View className="bg-gray-50 p-3 rounded-lg text-base">
              {formData.birthDate || "请选择出生年月"}
            </View>
          </Picker>
        </FormField>
      </View>

      <View className="mb-8">
        <View className="text-lg font-bold mb-2 text-gray-700">
          第二步：选择类型
        </View>
        <FormField label="性别" required inline labelClassName="text-base">
          <Picker
            mode="selector"
            range={genderOptions}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                gender: genderOptions[e.detail.value],
                workType: "", // 重置工作类型
              }));
              setResult("");
            }}
          >
            <View className="bg-gray-50 p-3 rounded-lg text-base">
              {formData.gender || "请选择性别"}
            </View>
          </Picker>
        </FormField>

        {formData.gender && (
          <FormField
            label="人员类型"
            required
            inline
            labelClassName="text-base"
          >
            <Picker
              mode="selector"
              range={formData.gender === "男" ? ["普通职工"] : workTypeOptions}
              onChange={(e) => {
                const options =
                  formData.gender === "男" ? ["普通职工"] : workTypeOptions;
                setFormData((prev) => ({
                  ...prev,
                  workType: options[e.detail.value],
                }));
                setResult("");
              }}
            >
              <View className="bg-gray-50 p-3 rounded-lg text-base">
                {formData.workType || "请选择人员类型"}
              </View>
            </Picker>
          </FormField>
        )}
      </View>

      <View
        className={`py-4 text-center text-lg rounded-lg ${
          !formData.birthDate || !formData.gender || !formData.workType
            ? "bg-gray-200 text-gray-500"
            : "bg-blue-600 text-white active:bg-blue-700"
        }`}
        onClick={calculateRetirementAge}
      >
        立即查询
      </View>

      {result && (
        <View className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-100">
          <View className="text-center text-lg font-bold text-gray-700 mb-4">
            查询结果
          </View>
          <View className="text-center text-2xl text-blue-600 font-bold">
            {result}
          </View>
          <View className="mt-4 text-sm text-gray-500 text-center">
            *根据最新退休政策计算
          </View>
        </View>
      )}
    </View>
  );
}
