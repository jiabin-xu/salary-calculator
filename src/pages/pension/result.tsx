import { View, Text } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { useEffect, useState } from "react";
import { getCityAverageWage } from "@/services/api"; // 假设这个API会返回城市的平均工资

interface PensionResult {
  basicPension: number;
  personalAccountPension: number;
  totalPension: number;
  remainingYears: number;
}

export default function PensionResult() {
  const router = useRouter();
  const [result, setResult] = useState<PensionResult | null>(null);

  useEffect(() => {
    const calculatePension = async () => {
      const params = JSON.parse(decodeURIComponent(router.params.data || "{}"));
      const {
        cityCode,
        currentAge,
        retirementAge,
        averageContributionIndex,
        contributionYears,
        personalAccountBalance,
      } = params;

      // 获取城市平均工资
      const averageWage = await getCityAverageWage(cityCode);

      // 计算本人指数化月平均缴费工资
      const personalIndexWage = averageWage * Number(averageContributionIndex);

      // 计算基础养老金
      const basicPension =
        ((averageWage + personalIndexWage) / 2) *
        Number(contributionYears) *
        0.01;

      // 计算个人账户养老金（假设计发月数为101）
      const personalAccountPension = Number(personalAccountBalance) / 101;

      // 计算总养老金
      const totalPension = basicPension + personalAccountPension;

      // 计算剩余需要缴费的年限
      const remainingYears = Number(retirementAge) - Number(currentAge);

      setResult({
        basicPension,
        personalAccountPension,
        totalPension,
        remainingYears,
      });
    };

    calculatePension();
  }, [router.params]);

  if (!result) {
    return <View className="p-4">计算中...</View>;
  }

  return (
    <View className="p-4">
      <View className="mb-8 text-xl font-bold text-center">养老金计算结果</View>

      <View className="bg-white rounded-lg p-4 shadow-md mb-4">
        <View className="mb-4">
          <View className="text-gray-600 mb-1">基础养老金</View>
          <View className="text-2xl font-bold text-blue-600">
            ¥ {result.basicPension.toFixed(2)}
          </View>
        </View>

        <View className="mb-4">
          <View className="text-gray-600 mb-1">个人账户养老金</View>
          <View className="text-2xl font-bold text-blue-600">
            ¥ {result.personalAccountPension.toFixed(2)}
          </View>
        </View>

        <View className="pt-4 border-t">
          <View className="text-gray-600 mb-1">每月应领取养老金总额</View>
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
              建议您持续缴纳养老保险，以确保未来能够获得更高的养老金待遇。
            </View>
          )}
        </View>
      </View>

      <View className="mt-4 text-sm text-gray-500">
        <View className="mb-2">计算说明：</View>
        <View>
          1. 基础养老金 = (当地上年度月平均工资 + 本人指数化月平均缴费工资) ÷ 2
          × 缴费年限 × 1%
        </View>
        <View>2. 个人账户养老金 = 个人账户储存额 ÷ 计发月数（101）</View>
        <View>3. 总养老金 = 基础养老金 + 个人账户养老金</View>
        <View>4. 剩余缴费年限 = 退休年龄 - 现在年龄</View>
      </View>
    </View>
  );
}
