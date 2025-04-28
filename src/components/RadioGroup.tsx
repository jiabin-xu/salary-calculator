import React from "react";
import { View, Text } from "@tarojs/components";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <View className="flex flex-wrap">
      {options.map((option) => (
        <View
          key={option.value}
          className={`
            mr-3 mb-2 px-4 py-2 rounded-full text-sm border
            ${
              option.value === value
                ? "bg-blue-50 border-blue-400 text-blue-600"
                : "bg-white border-gray-300 text-gray-600"
            }
          `}
          onClick={() => onChange(option.value)}
        >
          <Text>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default RadioGroup;
