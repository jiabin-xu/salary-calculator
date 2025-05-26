import React from "react";
import { View, Button } from "@tarojs/components";
import { CalcIcon } from "../icons";

interface CalculateButtonProps {
  onClick: () => void;
  text?: string;
}

const CalculateButton: React.FC<CalculateButtonProps> = ({
  onClick,
  text = "计算薪资预估",
}) => {
  return (
    <View className="fixed left-0 right-0 bottom-8 p-4 pb-safe  border-t border-gray-200 shadow-lg">
      <Button
        className="bg-blue-600 text-white rounded-lg font-medium h-12 flex items-center justify-center w-full"
        onClick={onClick}
      >
        <View className="mr-2">
          <CalcIcon />
        </View>
        {text}
      </Button>
    </View>
  );
};

export default CalculateButton;
