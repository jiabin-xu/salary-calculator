import React, { ReactNode } from "react";
import { View, Text } from "@tarojs/components";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  helpText?: string;
  inline?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  helpText,
  inline = false,
}) => {
  return (
    <View className="mb-2">
      {inline ? (
        <View className="flex items-center mb-2">
          <Text className="text-sm font-medium text-gray-700 mr-3">
            {label}
          </Text>
          {required && <Text className="text-red-500 mr-2">*</Text>}
          <View className="flex-1">{children}</View>
        </View>
      ) : (
        <>
          <View className="flex items-center mb-2">
            <Text className="text-sm font-medium text-gray-700">{label}</Text>
            {required && <Text className="text-red-500 ml-1">*</Text>}
          </View>
          <View>{children}</View>
        </>
      )}
      {helpText && (
        <Text className="text-xs text-gray-500 mt-1">{helpText}</Text>
      )}
    </View>
  );
};

export default FormField;
