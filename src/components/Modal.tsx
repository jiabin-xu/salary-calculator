import React, { ReactNode } from "react";
import { View, Text } from "@tarojs/components";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <View
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <View className="relative bg-white rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto z-10">
        {/* 标题栏 */}
        <View className="p-4 pb-0 border-b border-gray-100">
          <Text className="text-lg font-medium">{title}</Text>
          {description && (
            <Text className="text-xs text-gray-500 mt-1 block">
              {description}
            </Text>
          )}
        </View>

        {/* 内容区域 */}
        <View className="p-4">{children}</View>

        {/* 关闭按钮 */}
        <View
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full"
          onClick={onClose}
        >
          <Text className="text-gray-500 text-sm">×</Text>
        </View>
      </View>
    </View>
  );
};

export default Modal;
