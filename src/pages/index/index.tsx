import React, { useState } from "react";
import { View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { getCityByCode } from "../../utils/cityMapping";
import { useBonusState } from "../../hooks/useBonusState";
import { useInsuranceState } from "../../hooks/useInsuranceState";
import { useDeductionState } from "../../hooks/useDeductionState";
import { calculateYearlySalary } from "../../utils/calculator";

// 导入拆分后的组件
import PageHeader from "../../components/salary/PageHeader";
import BasicInfoPanel from "../../components/salary/BasicInfoPanel";
import MenuItems from "../../components/salary/MenuItems";
import InsuranceModal from "../../components/salary/InsuranceModal";
import DeductionsModal from "../../components/salary/DeductionsModal";
import BonusModal from "../../components/salary/BonusModal";
import CalculateButton from "../../components/salary/CalculateButton";
import { useShare } from "@/utils/shareHooks";

const Index: React.FC = () => {
  // 选择的城市代码
  const [selectedCityCode, setSelectedCityCode] = useState<string>("020");
  const selectedCity = getCityByCode(selectedCityCode);

  // 月薪
  const [monthlySalary, setMonthlySalary] = useState<string>("10000");
  const { from } = useRouter().params;

  const isFromDisposableIncome = from === "disposableIncome";

  useShare();

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

    // 构建SalaryParams对象
    const salaryParams = {
      monthlySalary: Number(monthlySalary),
      cityId: selectedCity.id || selectedCity.code,
      socialInsuranceBase: Number(socialInsuranceBase),
      housingFundBase: Number(housingFundBase),
      housingFundRate: Number(housingFundRate) / 100,
      totalDeductions: Object.values(deductions).reduce(
        (sum, value) => sum + Number(value),
        0
      ),
      bonus: {
        months: Number(bonusMonths),
        payMonth: Number(bonusMonth),
        calculationType: bonusCalcType as "separate" | "combined",
      },
    };

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

    // 如果是从可支配收入页面来的，需要触发事件并返回
    if (isFromDisposableIncome) {
      // 计算12个月的工资结果
      const calculatedResult = calculateYearlySalary(salaryParams);

      // 将12个月的工资存储到localStorage中
      try {
        // 格式化工资数据，只保留月份和税后工资
        const monthlySalaries = calculatedResult.monthlyDetail.map(
          (detail) => ({
            month: detail.month,
            salary: detail.afterTaxSalary,
            preTaxSalary: detail.preTaxSalary,
            withBonus: Boolean(detail.bonus),
            bonusAmount: detail.bonus || 0,
            bonusAfterTax: detail.bonus
              ? detail.bonus - (detail.bonusTax || 0)
              : 0,
          })
        );

        // 存储到localStorage
        Taro.setStorageSync("monthlySalaries", JSON.stringify(monthlySalaries));

        // 返回可支配收入页面，由该页面的useEffect处理更新收入项目
      } catch (e) {
        console.error("存储工资数据失败", e);
      }
      Taro.navigateTo({
        url: "/pages/disposable-income/index",
      });
    } else {
      // 将参数传递到结果页面
      Taro.navigateTo({
        url: `/pages/result/index?${queryParams.toString()}`,
      });
    }
  };

  return (
    <View className="bg-gray-50 min-h-screen  ">
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
      <CalculateButton
        onClick={handleCalculate}
        text={isFromDisposableIncome ? "添加收入" : undefined}
      />
    </View>
  );
};

export default Index;

// http://10.254.74.245:10086/#/pages/result/index?salary=10000&cityId=021&socialBase=10000&housingBase=2690&housingRate=12&bonusMonths=3&bonusMonth=12&bonusType=separate&ded_children_education=1000
