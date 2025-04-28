import React, { ReactNode } from "react";
import { View, Text } from "@tarojs/components";

interface BasePanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const BasePanel: React.FC<BasePanelProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <View className={`bg-white rounded-lg shadow-sm mb-4 ${className}`}>
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-medium text-gray-700">{title}</Text>
      </View>
      <View className="p-4">{children}</View>
    </View>
  );
};

export default BasePanel;
