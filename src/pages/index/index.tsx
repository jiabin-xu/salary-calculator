import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="flex flex-col items-center justify-center p-4">
      <Text className="text-[#acc855] text-[32px] font-bold mb-4">
        Hello Tailwind!
      </Text>
      <View className="bg-red-500 text-white p-4 rounded-lg shadow-md">
        <Text className="text-center">薪资计算器</Text>
      </View>
    </View>
  );
}
