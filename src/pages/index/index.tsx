import React, { useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getCityByCode } from "../../utils/cityMapping";
import { useBonusState } from "../../hooks/useBonusState";
import { useInsuranceState } from "../../hooks/useInsuranceState";
import { useDeductionState } from "../../hooks/useDeductionState";

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
  const [selectedCityCode, setSelectedCityCode] = useState<string>("020");
  const selectedCity = getCityByCode(selectedCityCode);

  // 月薪
  const [monthlySalary, setMonthlySalary] = useState<string>("10000");

  // 使用useInsuranceState管理社保公积金相关状态
  const {
    socialInsuranceBaseType,
    socialInsuranceBase,
    housingFundBaseType,
    housingFundBase,
    housingFundRate,
    setSocialInsuranceBaseType,
    setSocialInsuranceBase,
    setHousingFundBaseType,
    setHousingFundBase,
    setHousingFundRate,
    updateSocialInsuranceBase,
    updateHousingFundBase,
    getInsuranceSummary,
  } = useInsuranceState(selectedCity, monthlySalary);

  // 使用useDeductionState管理专项附加扣除状态
  const { deductions, setDeduction, getDeductionSummary } = useDeductionState();

  // 使用useReducer管理年终奖相关状态
  const {
    bonusMonths,
    bonusMonth,
    bonusCalcType,
    setBonusMonths,
    setBonusMonth,
    setBonusCalcType,
    getBonusSummary,
  } = useBonusState();

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

    // 将参数扁平化为查询字符串
    const queryParams = new URLSearchParams();

    // 基本信息
    queryParams.append("salary", monthlySalary);
    queryParams.append("cityId", selectedCity.id || selectedCity.code);

    // 社保公积金
    queryParams.append("socialBase", socialInsuranceBase);
    queryParams.append("housingBase", housingFundBase);
    queryParams.append("housingRate", housingFundRate);

    // 年终奖
    queryParams.append("bonusMonths", bonusMonths);
    queryParams.append("bonusMonth", bonusMonth);
    queryParams.append("bonusType", bonusCalcType);
    queryParams.append(
      "totalDeductions",
      Object.values(deductions)
        .reduce((sum, value) => sum + Number(value), 0)
        .toString()
    );

    // 添加专项附加扣除 - 只添加有值的项
    // Object.entries(deductions).forEach(([key, value]) => {
    //   if (Number(value) > 0) {
    //     queryParams.append(`ded_${key}`, value);
    //   }
    // });

    // 将参数传递到结果页面
    Taro.navigateTo({
      url: `/pages/result/index?${queryParams.toString()}`,
    });
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
        deductionsSummary={getDeductionSummary()}
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
        socialInsuranceBaseType={socialInsuranceBaseType}
        socialInsuranceBase={socialInsuranceBase}
        housingFundBaseType={housingFundBaseType}
        housingFundBase={housingFundBase}
        housingFundRate={housingFundRate}
        setSocialInsuranceBaseType={setSocialInsuranceBaseType}
        setSocialInsuranceBase={setSocialInsuranceBase}
        setHousingFundBaseType={setHousingFundBaseType}
        setHousingFundBase={setHousingFundBase}
        setHousingFundRate={setHousingFundRate}
        updateSocialInsuranceBase={updateSocialInsuranceBase}
        updateHousingFundBase={updateHousingFundBase}
      />

      {/* 专项附加扣除弹窗 */}
      <DeductionsModal
        isOpen={deductionsModalOpen}
        onClose={() => setDeductionsModalOpen(false)}
        deductions={deductions}
        setDeduction={setDeduction}
      />

      {/* 年终奖设置弹窗 */}
      <BonusModal
        isOpen={bonusModalOpen}
        onClose={() => setBonusModalOpen(false)}
        bonusMonths={bonusMonths}
        bonusMonth={bonusMonth}
        bonusCalcType={bonusCalcType}
        setBonusMonths={setBonusMonths}
        setBonusMonth={setBonusMonth}
        setBonusCalcType={setBonusCalcType}
      />

      {/* 计算按钮 */}
      <CalculateButton onClick={handleCalculate} />
    </View>
  );
};

export default Index;

// http://10.254.74.245:10086/#/pages/result/index?salary=10000&cityId=021&socialBase=10000&housingBase=2690&housingRate=12&bonusMonths=3&bonusMonth=12&bonusType=separate&ded_children_education=1000
