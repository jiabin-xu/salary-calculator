import React, { useState } from "react";
import { View, Text, Picker } from "@tarojs/components";

interface Option {
  label: string;
  value: string;
}

interface SelectorProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Selector: React.FC<SelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = "请选择",
  disabled = false,
}) => {
  const getSelectedLabel = (): string => {
    const selected = options.find((option) => option.value === value);
    return selected ? selected.label : placeholder;
  };

  const handleChange = (e) => {
    const index = e.detail.value;
    onChange(options[index].value);
  };

  return (
    <Picker
      mode="selector"
      range={options.map((option) => option.label)}
      onChange={handleChange}
      disabled={disabled}
      value={options.findIndex((option) => option.value === value) || 0}
    >
      <View className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
        <Text className={`${value ? "text-gray-800" : "text-gray-400"}`}>
          {getSelectedLabel()}
        </Text>
        <View className="triangle-down border-gray-400" />
      </View>
    </Picker>
  );
};

export default Selector;
