import React from "react";
import { View, Text } from "@tarojs/components";
import Modal from "../Modal";
import FormField from "../FormField";
import Input from "../Input";
import RadioGroup from "../RadioGroup";
import { City } from "../../utils/cityMapping";

interface InsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: City | null;
  socialInsuranceBaseType: string;
  setSocialInsuranceBaseType: (value: string) => void;
  socialInsuranceBase: string;
  setSocialInsuranceBase: (value: string) => void;
  housingFundBaseType: string;
  setHousingFundBaseType: (value: string) => void;
  housingFundBase: string;
  setHousingFundBase: (value: string) => void;
  housingFundRate: string;
  onHousingFundRateChange: (value: string) => void;
  updateSocialInsuranceBase: (type: string) => void;
  updateHousingFundBase: (type: string) => void;
  baseOptions: Array<{ label: string; value: string }>;
}

const InsuranceModal: React.FC<InsuranceModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  socialInsuranceBaseType,
  setSocialInsuranceBaseType,
  socialInsuranceBase,
  setSocialInsuranceBase,
  housingFundBaseType,
  setHousingFundBaseType,
  housingFundBase,
  setHousingFundBase,
  housingFundRate,
  onHousingFundRateChange,
  updateSocialInsuranceBase,
  updateHousingFundBase,
  baseOptions,
}) => {
  return (
    <Modal
      title="社保公积金设置"
      description="设置社保公积金缴纳基数和比例"
      isOpen={isOpen}
      onClose={onClose}
    >
      <View className="space-y-4">
        <View className="bg-blue-50 p-2 rounded-lg">
          <Text className="text-sm font-medium text-blue-800 mb-2">
            社保基数计算方式
          </Text>
          <View className="mb-2">
            <FormField label="">
              <RadioGroup
                options={baseOptions}
                value={socialInsuranceBaseType}
                onChange={(value) => {
                  setSocialInsuranceBaseType(value);
                  updateSocialInsuranceBase(value);
                }}
              />
            </FormField>
          </View>

          {socialInsuranceBaseType === "custom" && (
            <View className="mt-2">
              <FormField
                label="自定义基数"
                inline
                helpText={
                  selectedCity
                    ? `最低${selectedCity.socialInsurance.minBase}，最高${selectedCity.socialInsurance.maxBase}`
                    : ""
                }
              >
                <Input
                  type="digit"
                  value={socialInsuranceBase}
                  onChange={setSocialInsuranceBase}
                  prefix="￥"
                />
              </FormField>
            </View>
          )}
        </View>

        <View className="bg-blue-50 p-2 rounded-lg">
          <Text className="text-sm font-medium text-blue-800 mb-2">
            公积金基数计算方式
          </Text>
          <View className="mb-2">
            <FormField label="">
              <RadioGroup
                options={baseOptions}
                value={housingFundBaseType}
                onChange={(value) => {
                  setHousingFundBaseType(value);
                  updateHousingFundBase(value);
                }}
              />
            </FormField>
          </View>

          {housingFundBaseType === "custom" && (
            <View className="mt-2">
              <FormField
                label="自定义基数"
                inline
                helpText={
                  selectedCity
                    ? `最低${selectedCity.housingFund.minBase}，最高${selectedCity.housingFund.maxBase}`
                    : ""
                }
              >
                <Input
                  type="digit"
                  value={housingFundBase}
                  onChange={setHousingFundBase}
                  prefix="￥"
                />
              </FormField>
            </View>
          )}

          <View className="mt-2">
            <FormField label="缴纳比例" inline helpText="范围：5% ~ 12%">
              <Input
                type="digit"
                value={housingFundRate}
                onChange={onHousingFundRateChange}
                suffix="%"
              />
            </FormField>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InsuranceModal;
