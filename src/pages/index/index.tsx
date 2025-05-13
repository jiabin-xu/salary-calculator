import React, { useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { specialDeductions } from "../../data/taxRates";
import { SalaryParams } from "../../utils/calculator";
import { getCityByCode } from "../../utils/cityMapping";
import { useBonusState } from "../../hooks/useBonusState";
import { useInsuranceState } from "../../hooks/useInsuranceState";

// 导入拆分后的组件
import PageHeader from "../../components/salary/PageHeader";
import BasicInfoPanel from "../../components/salary/BasicInfoPanel";
import MenuItems from "../../components/salary/MenuItems";
import InsuranceModal from "../../components/salary/InsuranceModal";
import DeductionsModal from "../../components/salary/DeductionsModal";
import BonusModal from "../../components/salary/BonusModal";
import CalculateButton from "../../components/salary/CalculateButton";

const Index: React.FC = () => {
  // 选择的城市代码
  const [selectedCityCode, setSelectedCityCode] = useState<string>("");
  const selectedCity = getCityByCode(selectedCityCode);

  // 月薪
  const [monthlySalary, setMonthlySalary] = useState<string>("10000");

  // 使用useInsuranceState管理社保公积金相关状态
  const {
    socialInsuranceBase,
    housingFundBase,
    housingFundRate,
    getInsuranceSummary,
  } = useInsuranceState(selectedCity, monthlySalary);

  // 专项附加扣除
  const [deductions, setDeductions] = useState<Record<string, string>>(
    specialDeductions.reduce((acc, deduction) => {
      acc[deduction.id] = "0";
      return acc;
    }, {} as Record<string, string>)
  );

  // 使用useReducer管理年终奖相关状态
  const { bonusMonths, bonusMonth, bonusCalcType, getBonusSummary } =
    useBonusState();

  const bonusSummary = getBonusSummary();

  // 弹窗状态
  const [deductionsModalOpen, setDeductionsModalOpen] = useState(false);
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);

  // 计算按钮点击
  const handleCalculate = () => {
    if (!selectedCity) {
      Taro.showToast({
        title: "请选择城市",
        icon: "none",
      });
      return;
    }

    // 构建薪资参数
    const params: SalaryParams = {
      monthlySalary: Number(monthlySalary),
      cityId: selectedCity.id || selectedCity.code,
      socialInsuranceBase: Number(socialInsuranceBase),
      housingFundBase: Number(housingFundBase),
      housingFundRate: Number(housingFundRate) / 100,
      specialDeductions: Object.entries(deductions).reduce(
        (acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        },
        {} as Record<string, number>
      ),
      bonus: {
        months: Number(bonusMonths),
        payMonth: Number(bonusMonth),
        calculationType: bonusCalcType === "separate" ? "separate" : "combined",
      },
    };

    // 将参数传递到结果页面
    Taro.navigateTo({
      url:
        "/pages/result/index?params=" +
        encodeURIComponent(JSON.stringify(params)),
    });
  };

  // 计算总专项附加扣除金额
  const totalDeductions = Object.values(deductions).reduce(
    (sum, value) => sum + Number(value),
    0
  );

  // 专项附加扣除变更
  const handleDeductionChange = (id: string, value: string) => {
    setDeductions((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <View className="bg-gray-50 min-h-screen pb-20">
      {/* 页面标题 */}
      <PageHeader
        title="薪资计算器"
        subtitle="精确计算各城市税后工资与社保公积金"
      />

      {/* 基本信息面板 */}
      <BasicInfoPanel
        selectedCityCode={selectedCityCode}
        setSelectedCityCode={setSelectedCityCode}
        monthlySalary={monthlySalary}
        setMonthlySalary={setMonthlySalary}
      />

      {/* 菜单项 */}
      <MenuItems
        insuranceSummary={getInsuranceSummary()}
        deductionsSummary={
          totalDeductions > 0
            ? `已设置 ${totalDeductions} 元/月`
            : "暂未设置专项附加扣除"
        }
        bonusSummary={bonusSummary}
        onInsuranceClick={() => setInsuranceModalOpen(true)}
        onDeductionsClick={() => setDeductionsModalOpen(true)}
        onBonusClick={() => setBonusModalOpen(true)}
      />

      {/* 社保公积金设置弹窗 */}
      <InsuranceModal
        isOpen={insuranceModalOpen}
        onClose={() => setInsuranceModalOpen(false)}
        selectedCity={selectedCity}
        monthlySalary={monthlySalary}
      />

      {/* 专项附加扣除弹窗 */}
      <DeductionsModal
        isOpen={deductionsModalOpen}
        onClose={() => setDeductionsModalOpen(false)}
        deductions={deductions}
        onDeductionChange={handleDeductionChange}
      />

      {/* 年终奖设置弹窗 */}
      <BonusModal
        isOpen={bonusModalOpen}
        onClose={() => setBonusModalOpen(false)}
      />

      {/* 计算按钮 */}
      <CalculateButton onClick={handleCalculate} />
    </View>
  );
};

export default Index;
