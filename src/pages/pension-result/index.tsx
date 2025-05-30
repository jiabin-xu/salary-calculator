import { View, Text } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { useEffect, useState } from "react";
import provinceData from "../../data/provice.json";
import { useShare } from "@/utils/shareHooks";

interface PensionResult {
  basicPension: number;
  personalAccountPension: number;
  totalPension: number;
  remainingYears: number;
  futureAccountBalance: number;
}

// 计算未来工资增长
const calculateFutureWage = (currentWage: number, years: number) => {
  const growthRate = 0.02; // 2%的年增长率
  return currentWage * Math.pow(1 + growthRate, years);
};

// 获取计发月数
const getPaymentMonths = (retirementAge: number): number => {
  // 根据国家规定的计发月数表
  if (retirementAge <= 40) return 233;
  if (retirementAge <= 45) return 216;
  if (retirementAge <= 50) return 195;
  if (retirementAge <= 55) return 170;
  if (retirementAge <= 60) return 139;
  if (retirementAge <= 65) return 101;
  if (retirementAge <= 70) return 56;
  return 56; // 70岁以上按56个月计算
};

// 计算未来累积的个人账户余额
const calculateFutureAccountBalance = (
  currentBalance: number,
  monthlyPayment: number,
  years: number,
  annualGrowthRate: number = 0.02
) => {
  let totalBalance = currentBalance;
  let currentMonthlyPayment = monthlyPayment;

  // 每年计算一次
  for (let i = 0; i < years; i++) {
    // 全年的缴费金额（按8%计算）
    const yearlyContribution = currentMonthlyPayment * 12 * 0.08;
    totalBalance += yearlyContribution;

    // 下一年的月缴费基数增长2%
    currentMonthlyPayment *= 1 + annualGrowthRate;
  }

  return totalBalance;
};

export default function PensionResult() {
  const router = useRouter();
  const [result, setResult] = useState<PensionResult | null>(null);

  useShare("退休金计算器", "/pages/pension/index");
  useEffect(() => {
    const calculatePension = async () => {
      const params = JSON.parse(decodeURIComponent(router.params.data || "{}"));
      const {
        city,
        currentAge,
        retirementAge,
        paymentBase,
        contributionYears,
        personalAccountBalance,
      } = params;

      // 获取城市平均工资
      const averageWage =
        provinceData.find((p) => p.province === city)?.salary || 10000;

      // 计算本人指数化月平均缴费工资
      const personalIndex = Number(paymentBase) / averageWage;

      // 计算剩余需要缴费的年限
      const remainingYears = Number(retirementAge) - Number(currentAge);

      // 计算未来个人账户余额（考虑继续缴费）
      const futureAccountBalance = calculateFutureAccountBalance(
        Number(personalAccountBalance),
        Number(paymentBase),
        remainingYears
      );

      // 计算退休时的平均工资（考虑2%的年增长）
      const futureAverageWage = calculateFutureWage(
        averageWage,
        remainingYears
      );

      // 计算基础退休金（使用未来的工资基数）
      const totalYears = Number(contributionYears) + remainingYears;
      const basicPension =
        ((futureAverageWage + personalIndex * futureAverageWage) / 2) *
        totalYears *
        0.01;
      // 获取计发月数
      const paymentMonths = getPaymentMonths(Number(retirementAge));

      // 计算个人账户退休金（使用未来的账户余额和对应的计发月数）
      const personalAccountPension = futureAccountBalance / paymentMonths;

      // 计算总退休金
      const totalPension = basicPension + personalAccountPension;

      setResult({
        basicPension,
        personalAccountPension,
        totalPension,
        remainingYears,
        futureAccountBalance,
      });
    };

    calculatePension();
  }, [router.params]);

  if (!result) {
    return <View className="p-4">计算中...</View>;
  }

  return (
    <View className="p-4">
      <View className="mb-8 text-xl font-bold text-center">退休金计算结果</View>

      <View className="bg-white rounded-lg p-4 shadow-md mb-4">
        <View className="mb-4">
          <View className="text-gray-600 mb-1">基础退休金（每月）</View>
          <View className="text-2xl font-bold text-blue-600">
            ¥ {result.basicPension.toFixed(2)}
          </View>
        </View>

        <View className="mb-4">
          <View className="text-gray-600 mb-1">个人账户退休金（每月）</View>
          <View className="text-2xl font-bold text-blue-600">
            ¥ {result.personalAccountPension.toFixed(2)}
          </View>
        </View>

        <View className="pt-4 border-t">
          <View className="text-gray-600 mb-1">每月应领取退休金总额</View>
          <View className="text-3xl font-bold text-green-600">
            ¥ {result.totalPension.toFixed(2)}
          </View>
        </View>
      </View>

      <View className="bg-yellow-50 rounded-lg p-4 mb-4">
        <View className="text-yellow-800">
          <View className="font-bold mb-2">缴费年限提示</View>
          <View>
            距离退休还需要缴费：
            <Text className="font-bold text-xl mx-2">
              {result.remainingYears}
            </Text>
            年
          </View>
          {result.remainingYears > 0 && (
            <View className="text-sm mt-2">
              建议您持续缴纳养老保险，以确保未来能够获得更高的退休金待遇。每年工资基数会上涨2%，相应的缴费金额也会增加。
            </View>
          )}
        </View>
      </View>

      <View className="mt-4 text-sm text-gray-500">
        <View className="mb-2">计算说明：</View>
        <View>
          1. 基础退休金 = (退休时当地月平均工资 + 退休时本人月平均缴费工资) ÷ 2
          × 总缴费年限 × 1% ÷ 12
        </View>
        <View>
          2. 个人账户退休金 = 预计退休时个人账户余额 ÷
          计发月数（根据退休年龄确定）
        </View>
        <View>3. 总退休金 = 基础退休金 + 个人账户退休金</View>
        <View>4. 计算中已考虑每年2%的工资增长</View>
        <View>
          5. 个人账户余额包含了未来继续缴费的累积（按月缴费基数的8%计算）
        </View>
      </View>
    </View>
  );
}
