import React from "react";
import { Input as TaroInput, View } from "@tarojs/components";

export interface InputProps {
  type?: "text" | "number" | "digit";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  prefix,
  suffix,
  className = "",
}: InputProps) {
  return (
    <View className="flex items-center bg-gray-100 rounded">
      {prefix && <View className="pl-2 text-gray-500">{prefix}</View>}
      <TaroInput
        type={type}
        value={String(value)}
        onInput={(e) => onChange(e.detail.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 px-2 py-1 ${className}`}
      />
      {suffix && <View className="pr-2 text-gray-500">{suffix}</View>}
    </View>
  );
}
