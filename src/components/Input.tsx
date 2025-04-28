import React from "react";
import { Input as TaroInput, View, Text } from "@tarojs/components";

interface InputProps {
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "digit" | "idcard" | "password";
  placeholder?: string;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
  helpText?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  type = "text",
  placeholder = "请输入",
  disabled = false,
  prefix,
  suffix,
  helpText,
}) => {
  return (
    <View>
      <View className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
        {prefix && <Text className="text-gray-500 mr-2">{prefix}</Text>}
        <TaroInput
          className="flex-1 text-gray-800"
          value={String(value)}
          onInput={(e) => onChange(e.detail.value)}
          placeholder={placeholder}
          disabled={disabled}
          // @ts-ignore 处理Taro类型问题
          type={type}
        />
        {suffix && <Text className="text-gray-500 ml-2">{suffix}</Text>}
      </View>
      {helpText && (
        <Text className="text-xs text-gray-500 mt-1">{helpText}</Text>
      )}
    </View>
  );
};

export default Input;
