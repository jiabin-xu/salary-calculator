import { View } from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import Input from "../../components/Input";
import FormField from "../../components/FormField";
import ProvinceCitySelector from "@/components/ProvinceCitySelector";

interface PensionFormData {
  cityCode: string;
  averageContributionIndex: string; // 本人平均缴费指数
  contributionYears: string; // 缴费年限
  personalAccountBalance: string; // 个人账户储存额
}

const initialFormData: PensionFormData = {
  cityCode: "",
  averageContributionIndex: "",
  contributionYears: "",
  personalAccountBalance: "",
};

export default function PensionCalculator() {
  const [formData, setFormData] = useState<PensionFormData>(initialFormData);

  const handleInputChange = (field: keyof PensionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculatePension = () => {
    const {
      cityCode,
      averageContributionIndex,
      contributionYears,
      personalAccountBalance,
    } = formData;

    if (
      !cityCode ||
      !averageContributionIndex ||
      !contributionYears ||
      !personalAccountBalance
    ) {
      Taro.showToast({
        title: "请填写完整信息",
        icon: "none",
      });
      return;
    }

    // 跳转到结果页面
    Taro.navigateTo({
      url: `/pages/pension/result?data=${JSON.stringify(formData)}`,
    });
  };

  return (
    <View className="p-4">
      <FormField label="城市" required inline>
        <ProvinceCitySelector
          value={formData.cityCode}
          onChange={(value) => handleInputChange("cityCode", value)}
          placeholder="请选择工作城市"
        />
      </FormField>

      <FormField label="本人平均缴费指数" required inline>
        <Input
          type="digit"
          value={formData.averageContributionIndex}
          onChange={(value) =>
            handleInputChange("averageContributionIndex", value)
          }
          placeholder="请输入本人平均缴费指数"
        />
      </FormField>

      <FormField label="缴费年限" required inline>
        <Input
          type="number"
          value={formData.contributionYears}
          onChange={(value) => handleInputChange("contributionYears", value)}
          placeholder="请输入缴费年限"
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
