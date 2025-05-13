import React from "react";
import { View, Text } from "@tarojs/components";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <View className="bg-blue-600 p-4 text-white mb-4">
      <Text className="text-xl font-bold">{title}</Text>
      <Text className="text-sm opacity-80 mt-1 block">{subtitle}</Text>
    </View>
  );
};

export default PageHeader;
