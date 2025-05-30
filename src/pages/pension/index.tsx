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
    if (formData.cityCode) {
      const selectedProvince = provinceData.find(
        (p) => p.province === formData.cityCode
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
  }, [formData.cityCode]);

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
      cityCode,
      currentAge,
      retirementAge,
      paymentBase,
      contributionYears,
      personalAccountBalance,
    } = formData;

    if (
      !cityCode ||
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
      url: `/pages/pension/result?data=${JSON.stringify({
        ...formData,
        averageContributionIndex,
      })}`,
    });
  };

  return (
    <View className="p-4">
      <FormField label="城市" required inline>
        <Picker
          mode="selector"
          range={provinceData.map((p) => p.province)}
          onChange={(e) =>
            handleInputChange("city", provinceData[e.detail.value].province)
          }
        >
          <View className="bg-gray-100 p-2 rounded">
            {formData.city || "请选择工作城市"}
          </View>
        </Picker>
      </FormField>

      <FormField label="现在年龄" required inline>
        <Input
          type="number"
          value={formData.currentAge}
          onChange={(value) => handleInputChange("currentAge", value)}
          placeholder="请输入现在年龄"
          suffix="岁"
        />
      </FormField>

      <FormField label="退休年龄" required inline>
        <Input
          type="number"
          value={formData.retirementAge}
          onChange={(value) => handleInputChange("retirementAge", value)}
          placeholder="请输入退休年龄"
          suffix="岁"
        />
      </FormField>

      <FormField
        label="缴费基数"
        required
        inline
        helpText={
          averageWage
            ? `当前城市平均工资为：¥${averageWage}，您的缴费指数为：${averageContributionIndex}`
            : "请先选择城市"
        }
      >
        <Input
          type="digit"
          value={formData.paymentBase}
          onChange={(value) => handleInputChange("paymentBase", value)}
          placeholder="请输入缴费基数"
          prefix="￥"
        />
      </FormField>

      <FormField label="已参保年份" required inline>
        <Input
          type="number"
          value={formData.contributionYears}
          onChange={(value) => handleInputChange("contributionYears", value)}
          placeholder="请输入已参保年份"
          suffix="年"
        />
      </FormField>

      <FormField label="个人账户储存额" required inline>
        <Input
          type="digit"
          value={formData.personalAccountBalance}
          onChange={(value) =>
            handleInputChange("personalAccountBalance", value)
          }
          placeholder="请输入个人账户余额"
          prefix="￥"
        />
      </FormField>

      <View
        className="mt-8 bg-blue-500 text-white p-4 rounded-lg text-center"
        onClick={calculatePension}
      >
        计算养老金
      </View>
    </View>
  );
}
