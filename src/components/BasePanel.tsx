import React, { ReactNode } from "react";
import { View, Text } from "@tarojs/components";

interface BasePanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  description?: string;
  icon?: ReactNode;
}

const BasePanel: React.FC<BasePanelProps> = ({
  title,
  children,
  className = "",
  description,
  icon,
}) => {
  return (
    <View className={`bg-white rounded-lg shadow-sm mb-4 ${className}`}>
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex items-center">
          {icon && <View className="mr-2 text-blue-600">{icon}</View>}
          <Text className="text-base font-medium text-gray-800">{title}</Text>
        </View>
        {description && (
          <Text className="text-xs text-gray-500 mt-1 block">
            {description}
          </Text>
        )}
      </View>
      <View className="p-4">{children}</View>
    </View>
  );
};

export default BasePanel;
