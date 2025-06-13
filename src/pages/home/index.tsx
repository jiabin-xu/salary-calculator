import React from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useShare } from "@/utils/shareHooks";

const HomePage: React.FC = () => {
  useShare("智慧规划，安欣未来", "/pages/home/index");

  const handleNavigate = (url: string) => {
    Taro.navigateTo({
      url,
    });
  };

  const features = [
    {
      id: "retirement-age",
      title: "退休年龄计算",
      subtitle: "计算您的最佳退休年龄",
      icon: "🕐",
      bgColor: "bg-blue-300",
      url: "/pages/pension/index?tab=age",
    },
    {
      id: "pension",
      title: "退休金计算",
      subtitle: "规划您的退休储蓄目标",
      icon: "💰",
      bgColor: "bg-green-300",
      url: "/pages/pension/index?tab=pension",
    },
    {
      id: "realtime-salary",
      title: "实时工资计算",
      subtitle: "计算您的实时工资收入",
      icon: "🧮",
      bgColor: "bg-orange-300",
      url: "/pages/realTimeEarnings/index",
    },
    {
      id: "after-tax-salary",
      title: "税后工资计算",
      subtitle: "计算您的税后实际收入",
      icon: "📋",
      bgColor: "bg-purple-300",
      url: "/pages/index/index",
    },
    {
      id: "family-income",
      title: "家庭月收入",
      subtitle: "管理您的家庭总收入",
      icon: "🏠",
      bgColor: "bg-pink-300",
      url: "/pages/disposable-income/index",
    },
  ];

  return (
    <View className="bg-gray-50 min-h-screen">
      {/* 顶部标题 */}
      <View className="bg-white px-6 pt-16 pb-8">
        <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
          智慧规划，安欣未来
        </Text>
        <Text className="text-base text-gray-500 text-center">
          专业的薪资规划工具，让理财更简单
        </Text>
      </View>

      {/* 插画区 */}
      <View className="bg-white px-6 pb-8">
        <View className="flex justify-center items-center h-40 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-3xl shadow-sm">
          <View className="text-center">
            <Text className="text-8xl mb-4">📊</Text>
            <Text className="text-xl font-bold text-gray-700 mb-2">
              专业理财工具
            </Text>
            <Text className="text-sm text-gray-500">一站式薪资规划服务</Text>
          </View>
        </View>
      </View>

      {/* 功能按钮区 */}
      <View className="px-4">
        {features.map((feature, index) => (
          <View
            key={feature.id}
            className={`${feature.bgColor} rounded-3xl p-4 flex items-center justify-between shadow-lg mb-4`}
            onClick={() => handleNavigate(feature.url)}
          >
            <View className="flex items-center flex-1">
              <View className="w-12 h-12 bg-white bg-opacity-30 rounded-2xl flex items-center justify-center mr-4">
                <Text className="text-3xl">{feature.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-[#1F2937] mb-1">
                  {feature.title}
                </Text>
                <View className="text-sm text-gray-500">
                  {feature.subtitle}
                </View>
              </View>
            </View>
            <View className="bg-white px-3 py-1 rounded-full shadow-sm">
              <Text className="text-gray-700 font-bold text-sm">计算</Text>
            </View>
            <Text className="text-white text-2xl ml-3 font-bold opacity-80">
              {">"}
            </Text>
          </View>
        ))}
      </View>

      {/* 底部留白 */}
      <View className="h-12" />
    </View>
  );
};

export default HomePage;
