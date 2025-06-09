import { View, Picker } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import Input from "../../components/Input";
import FormField from "../../components/FormField";
import provinceData from "@/data/provice.json";

interface PensionFormData {
  city: string;
  currentAge: string; // 现在年龄
  retirementAge: string; // 退休年龄
  paymentBase: string; // 缴费基数
  contributionYears: string; // 缴费年限
  personalAccountBalance: string; // 个人账户储存额
}

const initialFormData: PensionFormData = {
  city: "",
  currentAge: "",
  retirementAge: "",
  paymentBase: "",
  contributionYears: "",
  personalAccountBalance: "",
};

export default function PensionCalculator() {
  const [formData, setFormData] = useState<PensionFormData>(initialFormData);
  const [averageWage, setAverageWage] = useState<number>(0);
  const [averageContributionIndex, setAverageContributionIndex] =
    useState<number>(0);

  // 当城市改变时，直接从provinceData获取平均工资
  useEffect(() => {
    if (formData.city) {
      const selectedProvince = provinceData.find(
        (p) => p.province === formData.city
      );
      if (selectedProvince) {
        setAverageWage(selectedProvince.salary);
        // 如果已经有缴费基数，重新计算缴费指数
        if (formData.paymentBase) {
          const index = Number(formData.paymentBase) / selectedProvince.salary;
          setAverageContributionIndex(Number(index.toFixed(2)));
        }
      }
    }
  }, [formData.city]);

  // 当缴费基数改变时，计算缴费指数
  useEffect(() => {
    if (formData.paymentBase && averageWage) {
      const index = Number(formData.paymentBase) / averageWage;
      setAverageContributionIndex(Number(index.toFixed(2)));
    } else {
      setAverageContributionIndex(0);
    }
  }, [formData.paymentBase, averageWage]);

  const handleInputChange = (field: keyof PensionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculatePension = () => {
    const {
      city,
      currentAge,
      retirementAge,
      paymentBase,
      contributionYears,
      personalAccountBalance,
    } = formData;

    if (
      !city ||
      !currentAge ||
      !retirementAge ||
      !paymentBase ||
      !contributionYears ||
      !personalAccountBalance
    ) {
      Taro.showToast({
        title: "请填写完整信息",
        icon: "none",
      });
      return;
    }

    // 跳转到结果页面，传递计算出的缴费指数
    Taro.navigateTo({
      url: `/pages/pension-result/index?data=${JSON.stringify({
        ...formData,
        averageContributionIndex,
      })}`,
    });
  };

  return (
    <View className="bg-white rounded-lg mx-4 p-6">
      <View className="mb-8">
        <View className="text-lg font-bold mb-2 text-gray-700">
          第一步：选择城市
        </View>
        <FormField label="工作城市" required inline labelClassName="text-base">
          <Picker
            mode="selector"
            range={provinceData.map((p) => p.province)}
            onChange={(e) =>
              handleInputChange("city", provinceData[e.detail.value].province)
            }
          >
            <View className="bg-gray-50 p-3 rounded-lg text-base">
              {formData.city || "请选择工作城市"}
            </View>
          </Picker>
        </FormField>
      </View>

      <View className="mb-8">
        <View className="text-lg font-bold mb-2 text-gray-700">
          第二步：填写基本信息
        </View>
        <FormField label="现在年龄" required inline labelClassName="text-base">
          <Input
            type="number"
            value={formData.currentAge}
            onChange={(value) => handleInputChange("currentAge", value)}
            placeholder="请输入现在年龄"
            suffix="岁"
            className="text-base p-3"
          />
        </FormField>

        <FormField label="退休年龄" required inline labelClassName="text-base">
          <Input
            type="number"
            value={formData.retirementAge}
            onChange={(value) => handleInputChange("retirementAge", value)}
            placeholder="请输入退休年龄"
            suffix="岁"
            className="text-base p-3"
          />
        </FormField>

        <FormField
          label="已参保年份"
          required
          inline
          labelClassName="text-base"
        >
          <Input
            type="number"
            value={formData.contributionYears}
            onChange={(value) => handleInputChange("contributionYears", value)}
            placeholder="请输入已参保年份"
            suffix="年"
            className="text-base p-3"
          />
        </FormField>
      </View>

      <View className="mb-8">
        <View className="text-lg font-bold mb-2 text-gray-700">
          第三步：填写缴费信息
        </View>
        <FormField label="缴费基数" required inline labelClassName="text-base">
          <Input
            type="digit"
            value={formData.paymentBase}
            onChange={(value) => handleInputChange("paymentBase", value)}
            placeholder="请输入缴费基数"
            prefix="￥"
            className="text-base p-3"
          />
        </FormField>

        <FormField
          label="个人账户余额"
          required
          inline
          labelClassName="text-base"
        >
          <Input
            type="digit"
            value={formData.personalAccountBalance}
            onChange={(value) =>
              handleInputChange("personalAccountBalance", value)
            }
            placeholder="请输入个人账户余额"
            prefix="￥"
            className="text-base p-3"
          />
        </FormField>
      </View>

      <View
        className={`py-4 text-center text-lg rounded-lg ${
          !formData.city ||
          !formData.currentAge ||
          !formData.retirementAge ||
          !formData.paymentBase ||
          !formData.contributionYears ||
          !formData.personalAccountBalance
            ? "bg-gray-200 text-gray-500"
            : "bg-blue-600 text-white active:bg-blue-700"
        }`}
        onClick={calculatePension}
      >
        开始计算
      </View>

      <View className="mt-4 p-4 bg-gray-50 rounded-lg">
        <View className="text-sm text-gray-500">
          <View className="mb-2">
            • 缴费基数：指您每月缴纳养老保险时的基准金额
          </View>
          <View>• 个人账户余额：可在社保APP或社保网站查询</View>
        </View>
      </View>
    </View>
  );
}
