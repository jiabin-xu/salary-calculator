import React, { useState, useEffect } from "react";
import { View, Button, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import BasePanel from "../../components/BasePanel";
import FormField from "../../components/FormField";
import Input from "../../components/Input";
import RadioGroup from "../../components/RadioGroup";
import Selector from "../../components/Selector";
import MenuItem from "../../components/MenuItem";
import Modal from "../../components/Modal";
import ProvinceCitySelector from "../../components/ProvinceCitySelector";
import {
  HomeIcon,
  WorkIcon,
  SettingsIcon,
  GiftIcon,
  CalcIcon,
} from "../../components/icons";
import { specialDeductions } from "../../data/taxRates";
import { SalaryParams } from "../../utils/calculator";
import { getCityByCode } from "../../utils/cityMapping";

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

  // 公积金缴纳比例
  const [housingFundRate, setHousingFundRate] = useState<string>("0.12");

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

      // 获取城市对象

      // 设置公积金比例为城市默认比例
      setHousingFundRate(String(selectedCity.housingFund.defaultRate));
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
      cityId: selectedCity.id,
      socialInsuranceBase: Number(socialInsuranceBase),
      housingFundBase: Number(housingFundBase),
      housingFundRate: Number(housingFundRate),
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
    }，公积金：${
      housingFundRate ? Number(housingFundRate) * 100 + "%" : "未设置"
    }`;
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
      <View className="bg-blue-600 p-4 text-white mb-4">
        <Text className="text-xl font-bold">薪资计算器</Text>
        <Text className="text-sm opacity-80 mt-1 block">
          精确计算各城市税后工资与社保公积金
        </Text>
      </View>

      {/* 基本信息 - 简化版 */}
      <BasePanel
        title="基本信息"
        className="mx-4 mb-4 rounded-lg shadow-sm"
        icon={<HomeIcon />}
      >
        <FormField label="城市" required>
          <ProvinceCitySelector
            value={selectedCityCode}
            onChange={setSelectedCityCode}
            placeholder="请选择工作城市"
          />
        </FormField>

        <FormField label="税前月薪" required>
          <Input
            type="digit"
            value={monthlySalary}
            onChange={setMonthlySalary}
            prefix="￥"
          />
        </FormField>
      </BasePanel>

      {/* 社保公积金设置 - 菜单项 */}
      <View className="mx-4">
        <MenuItem
          title="社保公积金设置"
          subtitle={getInsuranceSummary()}
          icon={<WorkIcon />}
          onClick={() => setInsuranceModalOpen(true)}
        />

        {/* 专项附加扣除 - 菜单项 */}
        <MenuItem
          title="专项附加扣除"
          subtitle={
            totalDeductions > 0
              ? `已设置 ${totalDeductions} 元/月`
              : "暂未设置专项附加扣除"
          }
          icon={<SettingsIcon />}
          onClick={() => setDeductionsModalOpen(true)}
        />

        {/* 年终奖设置 - 菜单项 */}
        <MenuItem
          title="年终奖设置"
          subtitle={getBonusSummary()}
          icon={<GiftIcon />}
          onClick={() => setBonusModalOpen(true)}
        />
      </View>

      {/* 社保公积金设置 - 弹窗 */}
      <Modal
        title="社保公积金设置"
        description="设置社保公积金缴纳基数和比例"
        isOpen={insuranceModalOpen}
        onClose={() => setInsuranceModalOpen(false)}
      >
        <FormField label="社保基数计算方式">
          <RadioGroup
            options={baseOptions}
            value={socialInsuranceBaseType}
            onChange={(value) => {
              setSocialInsuranceBaseType(value);
              updateSocialInsuranceBase(value);
            }}
          />
        </FormField>

        {socialInsuranceBaseType === "custom" && (
          <FormField label="自定义社保基数">
            <Input
              type="digit"
              value={socialInsuranceBase}
              onChange={setSocialInsuranceBase}
              prefix="￥"
              helpText={
                selectedCity
                  ? `最低${selectedCity.socialInsurance.minBase}，最高${selectedCity.socialInsurance.maxBase}`
                  : ""
              }
            />
          </FormField>
        )}

        <FormField label="公积金基数计算方式">
          <RadioGroup
            options={baseOptions}
            value={housingFundBaseType}
            onChange={(value) => {
              setHousingFundBaseType(value);
              updateHousingFundBase(value);
            }}
          />
        </FormField>

        {housingFundBaseType === "custom" && (
          <FormField label="自定义公积金基数">
            <Input
              type="digit"
              value={housingFundBase}
              onChange={setHousingFundBase}
              prefix="￥"
              helpText={
                selectedCity
                  ? `最低${selectedCity.housingFund.minBase}，最高${selectedCity.housingFund.maxBase}`
                  : ""
              }
            />
          </FormField>
        )}

        <FormField label="公积金缴纳比例">
          <Input
            type="digit"
            value={housingFundRate}
            onChange={setHousingFundRate}
            suffix="%"
            helpText={
              selectedCity
                ? `推荐范围：${selectedCity.housingFund.minRate * 100}% ~ ${
                    selectedCity.housingFund.maxRate * 100
                  }%`
                : ""
            }
          />
        </FormField>
      </Modal>

      {/* 专项附加扣除 - 弹窗 */}
      <Modal
        title="专项附加扣除"
        description="填写每月可以抵扣的专项附加扣除金额"
        isOpen={deductionsModalOpen}
        onClose={() => setDeductionsModalOpen(false)}
      >
        <View className="max-h-[60vh] overflow-y-auto">
          {specialDeductions.map((deduction) => (
            <FormField
              key={deduction.id}
              label={deduction.name}
              helpText={`最高可扣除${deduction.maxAmount}元/月`}
            >
              <Input
                type="digit"
                value={deductions[deduction.id]}
                onChange={(value) => handleDeductionChange(deduction.id, value)}
                prefix="￥"
              />
            </FormField>
          ))}
        </View>
      </Modal>

      {/* 年终奖设置 - 弹窗 */}
      <Modal
        title="年终奖设置"
        description="设置年终奖发放月份和计税方式"
        isOpen={bonusModalOpen}
        onClose={() => setBonusModalOpen(false)}
      >
        <FormField label="年终奖月数">
          <Input
            type="digit"
            value={bonusMonths}
            onChange={setBonusMonths}
            suffix="个月"
            helpText="设置为0表示没有年终奖"
          />
        </FormField>

        <FormField label="发放月份">
          <Selector
            options={Array.from({ length: 12 }, (_, i) => ({
              label: `${i + 1}月`,
              value: String(i + 1),
            }))}
            value={bonusMonth}
            onChange={setBonusMonth}
          />
        </FormField>

        <FormField label="计税方式">
          <RadioGroup
            options={bonusCalcOptions}
            value={bonusCalcType}
            onChange={setBonusCalcType}
          />
        </FormField>
      </Modal>

      {/* 底部固定按钮 */}
      <View className="fixed left-0 right-0 bottom-0 p-4 bg-white border-t border-gray-200 shadow-lg">
        <Button
          className="bg-blue-600 text-white rounded-lg font-medium h-12 flex items-center justify-center w-full"
          onClick={handleCalculate}
        >
          <View className="mr-2">
            <CalcIcon />
          </View>
          计算薪资预估
        </Button>
      </View>
    </View>
  );
};

export default Index;
