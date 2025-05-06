import React, { ReactNode } from "react";
import { View, Text } from "@tarojs/components";

interface MenuItemProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  subtitle,
  icon,
  onClick,
}) => {
  return (
    <View
      className="flex items-center justify-between p-4 bg-white rounded-lg mb-3 shadow-sm"
      onClick={onClick}
    >
      <View className="flex items-center">
        {icon && <View className="mr-3 text-blue-600">{icon}</View>}
        <View>
          <Text className="font-medium text-gray-800">{title}</Text>
          {subtitle && (
            <Text className="text-xs text-gray-500 mt-1 block">{subtitle}</Text>
          )}
        </View>
      </View>
      <View className="flex items-center justify-center w-6 h-6">
        <View className="w-2 h-2 border-t-2 border-r-2 border-gray-400 transform rotate-45" />
      </View>
    </View>
  );
};

export default MenuItem;
