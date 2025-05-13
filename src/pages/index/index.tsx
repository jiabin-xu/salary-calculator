import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { specialDeductions } from "../../data/taxRates";
import { SalaryParams } from "../../utils/calculator";
import { getCityByCode, City } from "../../utils/cityMapping";

// 导入拆分后的组件
import PageHeader from "../../components/salary/PageHeader";
import BasicInfoPanel from "../../components/salary/BasicInfoPanel";
import MenuItems from "../../components/salary/MenuItems";
import InsuranceModal from "../../components/salary/InsuranceModal";
import DeductionsModal from "../../components/salary/DeductionsModal";
import BonusModal from "../../components/salary/BonusModal";
import CalculateButton from "../../components/salary/CalculateButton";

const baseOptions = [
  { label: "最低基数", value: "min" },
  { label: "按照工资", value: "salary" },
  { label: "自定义", value: "custom" },
];

const bonusCalcOptions = [
  { label: "单独计税", value: "separate" },
  { label: "并入年收入", value: "combined" },
];

const Index: React.FC = () => {
  // 选择的城市代码
  const [selectedCityCode, setSelectedCityCode] = useState<string>("");
  const selectedCity = getCityByCode(selectedCityCode);
  // 月薪
  const [monthlySalary, setMonthlySalary] = useState<string>("10000");

  // 社保基数选择方式
  const [socialInsuranceBaseType, setSocialInsuranceBaseType] =
    useState<string>("salary");

  // 社保基数
  const [socialInsuranceBase, setSocialInsuranceBase] = useState<string>("0");

  // 公积金基数选择方式
  const [housingFundBaseType, setHousingFundBaseType] =
    useState<string>("salary");

  // 公积金基数
  const [housingFundBase, setHousingFundBase] = useState<string>("0");

  // 公积金缴纳比例 (改为整数5-12)
  const [housingFundRate, setHousingFundRate] = useState<string>("12");

  // 专项附加扣除
  const [deductions, setDeductions] = useState<Record<string, string>>(
    specialDeductions.reduce((acc, deduction) => {
      acc[deduction.id] = "0";
      return acc;
    }, {} as Record<string, string>)
  );

  // 年终奖月数
  const [bonusMonths, setBonusMonths] = useState<string>("3");

  // 年终奖发放月份
  const [bonusMonth, setBonusMonth] = useState<string>("12");

  // 年终奖计税方式
  const [bonusCalcType, setBonusCalcType] = useState<string>("separate");

  // 弹窗状态
  const [deductionsModalOpen, setDeductionsModalOpen] = useState(false);
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);

  // 当选择的城市代码变化时，更新社保和公积金基数
  useEffect(() => {
    if (selectedCity) {
      // 根据选择类型计算社保基数
      updateSocialInsuranceBase(socialInsuranceBaseType);

      // 根据选择类型计算公积金基数
      updateHousingFundBase(housingFundBaseType);

      // 设置公积金比例为城市默认比例
      setHousingFundRate(
        String(Math.round(selectedCity.housingFund.defaultRate * 100))
      );
    }
  }, [
    selectedCity,
    monthlySalary,
    socialInsuranceBaseType,
    housingFundBaseType,
  ]);

  // 更新社保基数
  const updateSocialInsuranceBase = (type: string) => {
    if (!selectedCity) return;

    const salary = Number(monthlySalary);

    switch (type) {
      case "min":
        setSocialInsuranceBase(String(selectedCity.socialInsurance.minBase));
        break;
      case "salary":
        // 如果工资在最低和最高基数之间，按照工资计算
        if (salary < selectedCity.socialInsurance.minBase) {
          setSocialInsuranceBase(String(selectedCity.socialInsurance.minBase));
        } else if (salary > selectedCity.socialInsurance.maxBase) {
          setSocialInsuranceBase(String(selectedCity.socialInsurance.maxBase));
        } else {
          setSocialInsuranceBase(monthlySalary);
        }
        break;
      case "custom":
        // 自定义模式下保持当前值
        break;
    }
  };

  // 更新公积金基数
  const updateHousingFundBase = (type: string) => {
    if (!selectedCity) return;

    const salary = Number(monthlySalary);

    switch (type) {
      case "min":
        setHousingFundBase(String(selectedCity.housingFund.minBase));
        break;
      case "salary":
        // 如果工资在最低和最高基数之间，按照工资计算
        if (salary < selectedCity.housingFund.minBase) {
          setHousingFundBase(String(selectedCity.housingFund.minBase));
        } else if (salary > selectedCity.housingFund.maxBase) {
          setHousingFundBase(String(selectedCity.housingFund.maxBase));
        } else {
          setHousingFundBase(monthlySalary);
        }
        break;
      case "custom":
        // 自定义模式下保持当前值
        break;
    }
  };

  // 处理公积金比例变更，保证在5-12范围内
  const handleHousingFundRateChange = (value: string) => {
    let rate = parseInt(value) || 0;

    // 限制范围在5-12之间
    if (rate < 5) {
      rate = 5;
    } else if (rate > 12) {
      rate = 12;
    }

    setHousingFundRate(String(rate));
  };

  // 专项附加扣除变更
  const handleDeductionChange = (id: string, value: string) => {
    setDeductions((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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

  // 获取社保公积金摘要信息
  const getInsuranceSummary = () => {
    if (!selectedCity) return "请先选择城市";

    return `社保：${
      socialInsuranceBaseType === "custom"
        ? "自定义"
        : socialInsuranceBaseType === "min"
        ? "最低基数"
        : "按工资"
    }，公积金：${housingFundRate ? Number(housingFundRate) + "%" : "未设置"}`;
  };

  // 获取年终奖摘要信息
  const getBonusSummary = () => {
    const months = Number(bonusMonths);
    if (months <= 0) return "无年终奖";
    return `${months}个月，${bonusMonth}月发放`;
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
        bonusSummary={getBonusSummary()}
        onInsuranceClick={() => setInsuranceModalOpen(true)}
        onDeductionsClick={() => setDeductionsModalOpen(true)}
        onBonusClick={() => setBonusModalOpen(true)}
      />

      {/* 社保公积金设置弹窗 */}
      <InsuranceModal
        isOpen={insuranceModalOpen}
        onClose={() => setInsuranceModalOpen(false)}
        selectedCity={selectedCity}
        socialInsuranceBaseType={socialInsuranceBaseType}
        setSocialInsuranceBaseType={setSocialInsuranceBaseType}
        socialInsuranceBase={socialInsuranceBase}
        setSocialInsuranceBase={setSocialInsuranceBase}
        housingFundBaseType={housingFundBaseType}
        setHousingFundBaseType={setHousingFundBaseType}
        housingFundBase={housingFundBase}
        setHousingFundBase={setHousingFundBase}
        housingFundRate={housingFundRate}
        onHousingFundRateChange={handleHousingFundRateChange}
        updateSocialInsuranceBase={updateSocialInsuranceBase}
        updateHousingFundBase={updateHousingFundBase}
        baseOptions={baseOptions}
      />

      {/* 专项附加扣除弹窗 */}
      <DeductionsModal
        isOpen={deductionsModalOpen}
        onClose={() => setDeductionsModalOpen(false)}
        deductions={deductions}
        specialDeductions={specialDeductions}
        onDeductionChange={handleDeductionChange}
      />

      {/* 年终奖设置弹窗 */}
      <BonusModal
        isOpen={bonusModalOpen}
        onClose={() => setBonusModalOpen(false)}
        bonusMonths={bonusMonths}
        setBonusMonths={setBonusMonths}
        bonusMonth={bonusMonth}
        setBonusMonth={setBonusMonth}
        bonusCalcType={bonusCalcType}
        setBonusCalcType={setBonusCalcType}
        bonusCalcOptions={bonusCalcOptions}
      />

      {/* 计算按钮 */}
      <CalculateButton onClick={handleCalculate} />
    </View>
  );
};

export default Index;
