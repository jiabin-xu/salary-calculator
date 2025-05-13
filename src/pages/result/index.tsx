import React, { useState, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import BasePanel from "../../components/BasePanel";
import {
  calculateYearlySalary,
  SalaryParams,
  SalaryResult,
} from "../../utils/calculator";
import { socialInsuranceRates } from "../../data/taxRates";

const ResultPage: React.FC = () => {
  const router = useRouter();
  const [params, setParams] = useState<SalaryParams | null>(null);
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [specialDeductionsTotal, setSpecialDeductionsTotal] =
    useState<number>(0);

  useEffect(() => {
    try {
      // 从URL参数中获取扁平化的参数
      const {
        salary,
        cityId,
        socialBase,
        housingBase,
        housingRate,
        bonusMonths,
        bonusMonth,
        bonusType,
        totalDeductions,
      } = router.params;

      if (!salary || !cityId) {
        throw new Error("必要参数缺失");
      }

      // 如果没有扣除项，totalDeductions已经为0，不需要特殊处理

      // 构建SalaryParams对象
      const parsedParams: SalaryParams = {
        monthlySalary: Number(salary),
        cityId: cityId as string,
        socialInsuranceBase: Number(socialBase),
        housingFundBase: Number(housingBase),
        housingFundRate: Number(housingRate) / 100,
        totalDeductions: Number(totalDeductions || 0),
        bonus: {
          months: Number(bonusMonths || 0),
          payMonth: Number(bonusMonth || 1),
          calculationType: bonusType === "separate" ? "separate" : "combined",
        },
      };

      setParams(parsedParams);

      setSpecialDeductionsTotal(parsedParams.totalDeductions);
      // 计算结果
      const calculatedResult = calculateYearlySalary(parsedParams);
      setResult(calculatedResult);
    } catch (err) {
      console.error("解析参数错误:", err);
      Taro.showToast({
        title: "参数解析错误",
        icon: "none",
      });
    }
  }, [router.params]);

  // 格式化金额
  const formatMoney = (amount: number, decimalPlaces = 1) => {
    return amount.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 格式化百分比
  const formatPercent = (rate: number, decimalPlaces = 0) => {
    return `${(rate * 100).toFixed(decimalPlaces)}%`;
  };

  // 返回首页
  const handleBack = () => {
    Taro.navigateBack();
  };

  if (!params || !result) {
    return (
      <View className="p-4 flex items-center justify-center min-h-screen">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-gray-100 min-h-screen pb-20">
      {/* 年薪概览 - 突出显示关键数据 */}
      <View className="mb-6 rounded-xl  bg-white px-4 py-6 shadow-sm">
        <Text className="mb-3 block text-base font-medium text-gray-700">
          年薪概览
        </Text>
        <View className="grid grid-cols-2 gap-2 mb-4">
          <View className="rounded-lg bg-blue-50 p-4 text-center">
            <Text className="block text-sm font-medium text-gray-600">
              税前年薪
            </Text>
            <Text className="mt-2 block text-xl font-bold text-blue-600">
              {formatMoney(result.yearlyTotal.preTaxSalary, 0)}
            </Text>
            <Text className="mt-1 block text-xs text-gray-500">
              月均 {formatMoney(result.yearlyTotal.preTaxSalary / 12, 0)}
            </Text>
          </View>

          <View className="rounded-lg bg-green-50 p-4 text-center">
            <Text className="block text-sm font-medium text-gray-600">
              税后年薪
            </Text>
            <Text className="mt-2 block text-xl font-bold text-green-600">
              {formatMoney(result.yearlyTotal.afterTaxSalary, 0)}
            </Text>
            <Text className="mt-1 block text-xs text-gray-500">
              月均 {formatMoney(result.yearlyTotal.afterTaxSalary / 12, 0)}
            </Text>
          </View>
        </View>

        <View className="grid grid-cols-3 gap-2">
          <View className="rounded-lg bg-red-50 py-4 text-center">
            <Text className="block text-sm font-medium text-gray-600">
              个税总计
            </Text>
            <Text className="mt-2 block text-xl font-bold text-red-600">
              {formatMoney(result.yearlyTotal.tax, 0)}
            </Text>
            <Text className="mt-1 block text-xs text-gray-500">
              月均 {formatMoney(result.yearlyTotal.tax / 12, 0)}
            </Text>
          </View>

          <View className="rounded-lg bg-purple-50 py-4 text-center">
            <Text className="block text-sm font-medium text-gray-600">
              社保总计
            </Text>
            <Text className="mt-2 block text-xl font-bold text-purple-600">
              {formatMoney(result.yearlyTotal.socialInsurance, 0)}
            </Text>
            <Text className="mt-1 block text-xs text-gray-500">
              月均 {formatMoney(result.yearlyTotal.socialInsurance / 12, 0)}
            </Text>
          </View>

          <View className="rounded-lg bg-indigo-50 py-4 text-center">
            <Text className="block text-sm font-medium text-gray-600">
              公积金总计
            </Text>
            <Text className="mt-2 block text-xl font-bold text-indigo-600">
              {formatMoney(result.yearlyTotal.housingFund, 0)}
            </Text>
            <Text className="mt-1 block text-xs text-gray-500">
              月均 {formatMoney(result.yearlyTotal.housingFund / 12, 0)}
            </Text>
          </View>
        </View>

        {specialDeductionsTotal > 0 && (
          <View className="mt-4 rounded-lg bg-amber-50 p-3 text-center">
            <Text className="block text-sm font-medium text-gray-600">
              专项附加扣除总计
            </Text>
            <Text className="mt-1 block text-base font-medium text-amber-600">
              每月 {formatMoney(specialDeductionsTotal, 0)} 元
            </Text>
            <Text className="mt-1 block text-xs text-gray-500">
              年度总计 {formatMoney(specialDeductionsTotal * 12, 0)} 元
            </Text>
          </View>
        )}
      </View>

      {/* 五险一金缴纳详情 */}
      <BasePanel title="五险一金详情" className="mb-4">
        <View className="rounded-md">
          <View className="bg-gray-50 p-3 flex">
            <Text className="w-1/4 text-xs font-medium text-gray-600">
              项目
            </Text>
            <View className="w-3/4 flex">
              <View className="w-1/2 text-center">
                <Text className="text-xs font-medium text-gray-600">
                  个人缴纳
                </Text>
              </View>
              <View className="w-1/2 text-center">
                <Text className="text-xs font-medium text-gray-600">
                  企业缴纳
                </Text>
              </View>
            </View>
          </View>

          {/* 养老保险 */}
          <View className="border-t border-gray-100 p-3">
            <View className="flex items-center">
              <View className="w-1/4">
                <Text className="text-xs font-medium text-gray-700">
                  养老保险
                </Text>
              </View>
              <View className="w-3/4 flex">
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.socialInsurance.personal.pension)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(socialInsuranceRates.pension.personal)})
                  </Text>
                </View>
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.socialInsurance.company.pension)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(socialInsuranceRates.pension.company)})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 医疗保险 */}
          <View className="border-t border-gray-100 p-3 bg-gray-50">
            <View className="flex items-center">
              <View className="w-1/4">
                <Text className="text-xs font-medium text-gray-700">
                  医疗保险
                </Text>
              </View>
              <View className="w-3/4 flex">
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.socialInsurance.personal.medical)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(socialInsuranceRates.medical.personal)})
                  </Text>
                </View>
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.socialInsurance.company.medical)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(socialInsuranceRates.medical.company)})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 失业保险 */}
          <View className="border-t border-gray-100 p-3">
            <View className="flex items-center">
              <View className="w-1/4">
                <Text className="text-xs font-medium text-gray-700">
                  失业保险
                </Text>
              </View>
              <View className="w-3/4 flex">
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.socialInsurance.personal.unemployment)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    (
                    {formatPercent(
                      socialInsuranceRates.unemployment.personal,
                      1
                    )}
                    )
                  </Text>
                </View>
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.socialInsurance.company.unemployment)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    (
                    {formatPercent(
                      socialInsuranceRates.unemployment.company,
                      1
                    )}
                    )
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 工伤保险 */}
          <View className="border-t border-gray-100 p-3 bg-gray-50">
            <View className="flex items-center">
              <View className="w-1/4">
                <Text className="text-xs font-medium text-gray-700">
                  工伤保险
                </Text>
              </View>
              <View className="w-3/4 flex">
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">0.0</Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(socialInsuranceRates.injury.personal)})
                  </Text>
                </View>
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.socialInsurance.company.injury)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(socialInsuranceRates.injury.company, 1)})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 生育保险 */}
          <View className="border-t border-gray-100 p-3">
            <View className="flex items-center">
              <View className="w-1/4">
                <Text className="text-xs font-medium text-gray-700">
                  生育保险
                </Text>
              </View>
              <View className="w-3/4 flex">
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">0.0</Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(socialInsuranceRates.maternity.personal)})
                  </Text>
                </View>
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.socialInsurance.company.maternity)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(socialInsuranceRates.maternity.company)})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 公积金 */}
          <View className="border-t border-gray-100 p-3 bg-gray-50">
            <View className="flex items-center">
              <View className="w-1/4">
                <Text className="text-xs font-medium text-gray-700">
                  公积金
                </Text>
              </View>
              <View className="w-3/4 flex">
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.housingFund.personal)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(params.housingFundRate)})
                  </Text>
                </View>
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs text-blue-600">
                    {formatMoney(result.housingFund.company)}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({formatPercent(params.housingFundRate)})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 合计 */}
          <View className="border-t border-gray-100 p-3 bg-blue-50">
            <View className="flex items-center">
              <View className="w-1/4">
                <Text className="text-xs font-medium text-blue-700">合计</Text>
              </View>
              <View className="w-3/4 flex">
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs font-medium text-blue-700">
                    {formatMoney(
                      result.socialInsurance.personal.total +
                        result.housingFund.personal
                    )}
                  </Text>
                </View>
                <View className="w-1/2 flex justify-center items-center">
                  <Text className="text-xs font-medium text-blue-700">
                    {formatMoney(
                      result.socialInsurance.company.total +
                        result.housingFund.company
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </BasePanel>

      {/* 月度收入详情 */}
      <BasePanel title="月度收入详情" className="mb-4">
        <View className="overflow-x-auto">
          <View className="w-full rounded-md">
            <View className="grid grid-cols-4 bg-gray-50 p-3">
              <Text className="text-center text-xs font-medium text-gray-600">
                月份
              </Text>
              <Text className="text-center text-xs font-medium text-gray-600">
                税前工资
              </Text>
              <Text className="text-center text-xs font-medium text-gray-600">
                个税
              </Text>
              <Text className="text-center text-xs font-medium text-gray-600">
                税后收入
              </Text>
            </View>

            {result.monthlyDetail.map((month, index) => {
              // 计算显示的税前工资（如有年终奖则包含）
              const displayPreTaxSalary = month.bonus
                ? month.preTaxSalary + month.bonus
                : month.preTaxSalary;

              // 计算显示的个税（如有年终奖税则包含）
              const displayTax = month.bonusTax
                ? month.tax + month.bonusTax
                : month.tax;

              return (
                <View
                  key={month.month}
                  className={`grid grid-cols-4 p-3 ${
                    index % 2 === 1 ? "bg-gray-50" : ""
                  } ${
                    index !== result.monthlyDetail.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <Text className="text-center text-xs text-gray-800">
                    {month.month}月
                    {month.bonus ? (
                      <Text className="text-xs text-blue-500 ml-1">
                        (含年终奖)
                      </Text>
                    ) : null}
                  </Text>
                  <Text className="text-center text-xs text-gray-800">
                    ¥{formatMoney(displayPreTaxSalary)}
                  </Text>
                  <Text className="text-center text-xs text-red-500">
                    ¥{formatMoney(displayTax)}
                  </Text>
                  <Text className="text-center text-xs font-medium text-green-600">
                    ¥{formatMoney(month.afterTaxSalary)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </BasePanel>

      {/* 底部返回按钮 */}
      <View className="fixed left-0 right-0 bottom-0 p-4 bg-white border-t border-gray-200 shadow-sm">
        <Button
          className="bg-blue-500 text-white rounded-lg h-10"
          onClick={handleBack}
        >
          返回修改
        </Button>
      </View>
    </View>
  );
};

export default ResultPage;
