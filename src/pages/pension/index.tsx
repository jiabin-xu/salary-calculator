import { View } from "@tarojs/components";
import { useState } from "react";
import { useShare } from "@/utils/shareHooks";
import RetirementAgeCalculator from "./RetirementAgeCalculator";
import PensionCalculator from "./PensionCalculator";

export default function PensionPage() {
  useShare("退休金计算器", "/pages/pension/index");
  const [activeTab, setActiveTab] = useState<"pension" | "age">("age");

  return (
    <View className="bg-gray-50 min-h-screen">
      {/* <PageHeader
        title="退休金计算器"
        subtitle="一键查询退休年龄及预估退休金"
      /> */}

      <View className="flex border-b border-gray-200 bg-white mb-4 text-lg">
        <View
          className={`flex-1 text-center py-4 ${
            activeTab === "age"
              ? "text-blue-600 border-b-4 border-blue-600 font-bold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("age")}
        >
          退休年龄查询
        </View>
        <View
          className={`flex-1 text-center py-4 ${
            activeTab === "pension"
              ? "text-blue-600 border-b-4 border-blue-600 font-bold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("pension")}
        >
          退休金计算
        </View>
      </View>

      <View className="px-4 py-2 bg-yellow-50 mx-4 rounded-lg mb-4 text-sm text-yellow-800">
        <View className="font-bold mb-1">温馨提示：</View>
        <View>• 建议先查询您的法定退休年龄</View>
        <View>• 退休金计算结果仅供参考</View>
      </View>

      {activeTab === "age" ? (
        <RetirementAgeCalculator />
      ) : (
        <PensionCalculator />
      )}
    </View>
  );
}
