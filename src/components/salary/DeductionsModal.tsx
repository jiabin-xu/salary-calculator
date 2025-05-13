import React from "react";
import { View } from "@tarojs/components";
import Modal from "../Modal";
import FormField from "../FormField";
import Input from "../Input";

interface DeductionItem {
  id: string;
  name: string;
  maxAmount: number;
}

interface DeductionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deductions: Record<string, string>;
  specialDeductions: DeductionItem[];
  onDeductionChange: (id: string, value: string) => void;
}

const DeductionsModal: React.FC<DeductionsModalProps> = ({
  isOpen,
  onClose,
  deductions,
  specialDeductions,
  onDeductionChange,
}) => {
  return (
    <Modal
      title="专项附加扣除"
      description="填写每月可以抵扣的专项附加扣除金额"
      isOpen={isOpen}
      onClose={onClose}
    >
      <View className="max-h-[60vh] overflow-y-auto">
        <View className="grid grid-cols-1 gap-2">
          {specialDeductions.map((deduction) => (
            <View key={deduction.id} className="  px-2 rounded-lg">
              <FormField label={deduction.name} inline>
                <Input
                  type="digit"
                  placeholder={`最高${deduction.maxAmount}`}
                  value={deductions[deduction.id]}
                  onChange={(value) => onDeductionChange(deduction.id, value)}
                  prefix="￥"
                />
              </FormField>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default DeductionsModal;
