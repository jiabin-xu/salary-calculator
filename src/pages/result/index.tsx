import React, { useState, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import BasePanel from "../../components/BasePanel";
import {
  calculateYearlySalary,
  SalaryParams,
  SalaryResult,
} from "../../utils/calculator";
import cities from "../../data/cities";

const ResultPage: React.FC = () => {
  const router = useRouter();
  const [params, setParams] = useState<SalaryParams | null>(null);
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    try {
      // 从URL参数中获取计算参数
      const paramsStr = decodeURIComponent(router.params.params || "");
      if (paramsStr) {
        const parsedParams = JSON.parse(paramsStr) as SalaryParams;
        setParams(parsedParams);

        // 计算结果
        const calculatedResult = calculateYearlySalary(parsedParams);
        setResult(calculatedResult);

        // 获取城市名称
        const city = cities.find((c) => c.id === parsedParams.cityId);
        if (city) {
          setSelectedCity(city.name);
        }
      }
    } catch (err) {
      console.error("解析参数错误:", err);
      Taro.showToast({
        title: "参数解析错误",
        icon: "none",
      });
    }
  }, [router.params]);

  // 格式化金额
  const formatMoney = (amount: number) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      <BasePanel title="薪资概览" className="mb-4">
        <View className="text-center mb-4">
          <Text className="text-lg text-gray-600">
            {selectedCity} · 月薪{formatMoney(params.monthlySalary)}元
          </Text>
        </View>

        <View className="flex justify-between mb-6">
          <View className="flex-1 text-center border-r border-gray-200">
            <Text className="text-sm text-gray-500">税前月薪</Text>
            <View className="text-blue-600 text-xl mt-1 font-medium">
              <Text>￥{formatMoney(result.preTaxSalary)}</Text>
            </View>
          </View>
          <View className="flex-1 text-center">
            <Text className="text-sm text-gray-500">税后月薪</Text>
            <View className="text-green-600 text-xl mt-1 font-medium">
              <Text>￥{formatMoney(result.afterTaxSalary)}</Text>
            </View>
          </View>
        </View>

        <View className="flex justify-between">
          <View className="flex-1 text-center border-r border-gray-200">
            <Text className="text-sm text-gray-500">税前年薪</Text>
            <View className="text-blue-600 text-xl mt-1 font-medium">
              <Text>￥{formatMoney(result.yearlyTotal.preTaxSalary)}</Text>
            </View>
          </View>
          <View className="flex-1 text-center">
            <Text className="text-sm text-gray-500">税后年薪</Text>
            <View className="text-green-600 text-xl mt-1 font-medium">
              <Text>￥{formatMoney(result.yearlyTotal.afterTaxSalary)}</Text>
            </View>
          </View>
        </View>
      </BasePanel>

      <BasePanel title="社保缴纳详情" className="mb-4">
        <View className="grid grid-cols-2 gap-4">
          <View>
            <Text className="text-sm text-gray-500">个人缴纳</Text>
            <View className="border rounded-md mt-2 divide-y divide-gray-100">
              <View className="p-2 flex justify-between">
                <Text className="text-gray-600">养老保险</Text>
                <Text className="text-gray-800">
                  ￥{formatMoney(result.socialInsurance.personal.pension)}
                </Text>
              </View>
              <View className="p-2 flex justify-between">
                <Text className="text-gray-600">医疗保险</Text>
                <Text className="text-gray-800">
                  ￥{formatMoney(result.socialInsurance.personal.medical)}
                </Text>
              </View>
              <View className="p-2 flex justify-between">
                <Text className="text-gray-600">失业保险</Text>
                <Text className="text-gray-800">
                  ￥{formatMoney(result.socialInsurance.personal.unemployment)}
                </Text>
              </View>
              <View className="p-2 flex justify-between bg-gray-50">
                <Text className="text-gray-700 font-medium">合计</Text>
                <Text className="text-blue-600 font-medium">
                  ￥{formatMoney(result.socialInsurance.personal.total)}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Text className="text-sm text-gray-500">企业缴纳</Text>
            <View className="border rounded-md mt-2 divide-y divide-gray-100">
              <View className="p-2 flex justify-between">
                <Text className="text-gray-600">养老保险</Text>
                <Text className="text-gray-800">
                  ￥{formatMoney(result.socialInsurance.company.pension)}
                </Text>
              </View>
              <View className="p-2 flex justify-between">
                <Text className="text-gray-600">医疗保险</Text>
                <Text className="text-gray-800">
                  ￥{formatMoney(result.socialInsurance.company.medical)}
                </Text>
              </View>
              <View className="p-2 flex justify-between">
                <Text className="text-gray-600">失业保险</Text>
                <Text className="text-gray-800">
                  ￥{formatMoney(result.socialInsurance.company.unemployment)}
                </Text>
              </View>
              <View className="p-2 flex justify-between">
                <Text className="text-gray-600">工伤保险</Text>
                <Text className="text-gray-800">
                  ￥{formatMoney(result.socialInsurance.company.injury)}
                </Text>
              </View>
              <View className="p-2 flex justify-between">
                <Text className="text-gray-600">生育保险</Text>
                <Text className="text-gray-800">
                  ￥{formatMoney(result.socialInsurance.company.maternity)}
                </Text>
              </View>
              <View className="p-2 flex justify-between bg-gray-50">
                <Text className="text-gray-700 font-medium">合计</Text>
                <Text className="text-blue-600 font-medium">
                  ￥{formatMoney(result.socialInsurance.company.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </BasePanel>

      <BasePanel title="公积金缴纳详情" className="mb-4">
        <View className="border rounded-md divide-y divide-gray-100">
          <View className="p-3 flex justify-between">
            <Text className="text-gray-600">个人缴纳</Text>
            <Text className="text-gray-800">
              ￥{formatMoney(result.housingFund.personal)}
            </Text>
          </View>
          <View className="p-3 flex justify-between">
            <Text className="text-gray-600">企业缴纳</Text>
            <Text className="text-gray-800">
              ￥{formatMoney(result.housingFund.company)}
            </Text>
          </View>
          <View className="p-3 flex justify-between bg-gray-50">
            <Text className="text-gray-700 font-medium">合计</Text>
            <Text className="text-blue-600 font-medium">
              ￥
              {formatMoney(
                result.housingFund.personal + result.housingFund.company
              )}
            </Text>
          </View>
        </View>
      </BasePanel>

      <BasePanel title="个税详情" className="mb-4">
        <View className="border rounded-md divide-y divide-gray-100">
          <View className="p-3 flex justify-between">
            <Text className="text-gray-600">月度个税</Text>
            <Text className="text-gray-800">￥{formatMoney(result.tax)}</Text>
          </View>
          <View className="p-3 flex justify-between">
            <Text className="text-gray-600">年度个税总额</Text>
            <Text className="text-gray-800">
              ￥{formatMoney(result.yearlyTotal.tax)}
            </Text>
          </View>
        </View>
      </BasePanel>

      <BasePanel title="月度收入详情" className="mb-4">
        <View className="overflow-x-auto">
          <View className="w-full border rounded-md divide-y divide-gray-100">
            <View className="grid grid-cols-7 bg-gray-50 py-2">
              <Text className="text-center text-gray-600 text-xs">月份</Text>
              <Text className="text-center text-gray-600 text-xs">
                税前工资
              </Text>
              <Text className="text-center text-gray-600 text-xs">社保</Text>
              <Text className="text-center text-gray-600 text-xs">公积金</Text>
              <Text className="text-center text-gray-600 text-xs">个税</Text>
              <Text className="text-center text-gray-600 text-xs">年终奖</Text>
              <Text className="text-center text-gray-600 text-xs">
                税后收入
              </Text>
            </View>

            {result.monthlyDetail.map((month) => (
              <View key={month.month} className="grid grid-cols-7 py-2">
                <Text className="text-center text-gray-800 text-xs">
                  {month.month}月
                </Text>
                <Text className="text-center text-gray-800 text-xs">
                  ￥{formatMoney(month.preTaxSalary)}
                </Text>
                <Text className="text-center text-gray-800 text-xs">
                  ￥{formatMoney(month.socialInsurance)}
                </Text>
                <Text className="text-center text-gray-800 text-xs">
                  ￥{formatMoney(month.housingFund)}
                </Text>
                <Text className="text-center text-gray-800 text-xs">
                  ￥{formatMoney(month.tax)}
                </Text>
                <Text className="text-center text-gray-800 text-xs">
                  {month.bonus ? `￥${formatMoney(month.bonus)}` : "-"}
                </Text>
                <Text className="text-center text-green-600 text-xs font-medium">
                  ￥{formatMoney(month.afterTaxSalary)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </BasePanel>

      <View className="fixed left-0 right-0 bottom-0 p-4 bg-white border-t border-gray-200">
        <Button
          className="bg-blue-500 text-white rounded-lg"
          onClick={handleBack}
        >
          返回修改
        </Button>
      </View>
    </View>
  );
};

export default ResultPage;
