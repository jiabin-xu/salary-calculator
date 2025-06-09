import React, { ReactNode } from "react";
import { View, Text } from "@tarojs/components";

export interface FormFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  inline?: boolean;
  labelClassName?: string;
  helpText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required = false,
  inline = false,
  labelClassName = "",
  helpText,
}) => {
  return (
    <View className={`mb-4 ${inline ? "flex items-center" : ""}`}>
      <View
        className={`${
          inline ? "w-32 flex-shrink-0" : "mb-2"
        } ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </View>
      <View className={inline ? "flex-1" : ""}>{children}</View>
      {helpText && (
        <Text className="text-xs text-gray-500 mt-1">{helpText}</Text>
      )}
    </View>
  );
};

export default FormField;
