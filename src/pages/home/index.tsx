import React from "react";
import { View, Text, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useShare } from "@/utils/shareHooks";
import ArrowRight from "@/assets/icons/arrow-right.svg";

const HomePage: React.FC = () => {
  useShare("退休计算器", "/pages/home/index");

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
      bgColor: "bg-gradient-to-r from-blue-200 to-blue-300",
      url: "/pages/pension/index?tab=age",
    },
    {
      id: "pension",
      title: "退休金计算",
      subtitle: "规划您的退休储蓄目标",
      icon: "💰",
      bgColor: "bg-gradient-to-r from-green-200 to-green-300",
      url: "/pages/pension/index?tab=pension",
    },
    {
      id: "realtime-salary",
      title: "实时工资计算",
      subtitle: "计算您的实时工资收入",
      icon: "🧮",
      bgColor: "bg-gradient-to-r from-orange-200 to-orange-300",
      url: "/pages/realTimeEarnings/index",
    },
    {
      id: "after-tax-salary",
      title: "税后工资计算",
      subtitle: "计算您的税后实际收入",
      icon: "📋",
      bgColor: "bg-gradient-to-r from-purple-200 to-purple-300",
      url: "/pages/index/index",
    },
    {
      id: "family-income",
      title: "家庭月收入",
      subtitle: "管理您的家庭总收入",
      icon: "🏠",
      bgColor: "bg-gradient-to-r from-pink-200 to-pink-300",
      url: "/pages/disposable-income/index",
    },
  ];

  return (
    <View className="bg-gray-50 min-h-screen">
      {/* 顶部标题栏 */}
      <View className="bg-white px-6 pt-12 pb-4 flex justify-between items-center">
        <Text className="text-2xl font-bold text-gray-800">退休计算器</Text>
        <Button
          className="w-8 h-8 mr-0 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200"
          openType="share"
        >
          <Text className="text-xl">📤</Text>
        </Button>
      </View>

      {/* 插画区 */}
      <View className="bg-white px-6 pb-8">
        <View className="relative h-48 rounded-3xl shadow-sm overflow-hidden">
          {/* 背景图片 */}
          <Image
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover"
            mode="aspectFill"
          />
          {/* 渐变遮罩 */}
          <View className="absolute inset-0 bg-gradient-to-br from-purple-500/60 via-pink-500/40 to-transparent" />
          {/* 文字内容 */}
          <View className="relative z-10 h-full flex flex-col justify-center px-6">
            <Text className="text-2xl font-bold text-white mb-2">当你老了</Text>
            <Text className="text-base text-white/90 leading-relaxed">
              新的人生，
            </Text>
            <Text className="text-base text-white/90 leading-relaxed">
              从这里开始绽放
            </Text>
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
            <Image src={ArrowRight} className="w-6 h-6 ml-3" mode="aspectFit" />
          </View>
        ))}
      </View>

      {/* 底部留白 */}
      <View className="h-12" />
    </View>
  );
};

export default HomePage;
