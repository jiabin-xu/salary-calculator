import React from "react";
import { View, Text } from "@tarojs/components";
import Modal from "../Modal";
import FormField from "../FormField";
import Input from "../Input";
import Selector from "../Selector";
import RadioGroup from "../RadioGroup";

interface BonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bonusMonths: string;
  bonusMonth: string;
  bonusCalcType: string;
  setBonusMonths: (value: string) => void;
  setBonusMonth: (value: string) => void;
  setBonusCalcType: (value: string) => void;
}

const bonusCalcOptions: Array<{ label: string; value: string }> = [
  { label: "单独计税", value: "separate" },
  { label: "并入年收入", value: "combined" },
];

const BonusModal: React.FC<BonusModalProps> = ({
  isOpen,
  onClose,
  bonusMonths,
  bonusMonth,
  bonusCalcType,
  setBonusMonths,
  setBonusMonth,
  setBonusCalcType,
}) => {
  return (
    <Modal
      title="年终奖设置"
      description="设置年终奖发放月份和计税方式"
      isOpen={isOpen}
      onClose={onClose}
    >
      <View className="space-y-4">
        <View className="px-2 rounded-lg">
          <Text className="text-sm font-medium text-yellow-800 mb-2">
            基本设置
          </Text>
          <View className="mb-2">
            <FormField
              label="年终奖月数"
              inline
              helpText="设置为0表示没有年终奖"
            >
              <Input
                type="digit"
                value={bonusMonths}
                onChange={setBonusMonths}
                suffix="个月"
              />
            </FormField>
          </View>

          <FormField label="发放月份" inline>
            <Selector
              options={Array.from({ length: 12 }, (_, i) => ({
                label: `${i + 1}月`,
                value: String(i + 1),
              }))}
              value={bonusMonth}
              onChange={setBonusMonth}
            />
          </FormField>
        </View>

        <View className=" px-2 rounded-lg">
          <Text className="text-sm font-medium text-yellow-800 mb-2">
            税务处理方式
          </Text>
          <FormField label="">
            <View className="mt-1">
              <RadioGroup
                options={bonusCalcOptions}
                value={bonusCalcType}
                onChange={setBonusCalcType}
              />
            </View>
          </FormField>
        </View>
      </View>
    </Modal>
  );
};

export default BonusModal;
