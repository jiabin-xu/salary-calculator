import React from "react";
import BasePanel from "../BasePanel";
import FormField from "../FormField";
import Input from "../Input";
import ProvinceCitySelector from "../ProvinceCitySelector";
import { HomeIcon } from "../icons";

interface BasicInfoPanelProps {
  selectedCityCode: string;
  setSelectedCityCode: (value: string) => void;
  monthlySalary: string;
  setMonthlySalary: (value: string) => void;
}

const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
  selectedCityCode,
  setSelectedCityCode,
  monthlySalary,
  setMonthlySalary,
}) => {
  return (
    <BasePanel
      title="基本信息"
      className="mx-4 mb-4 rounded-lg shadow-sm"
      icon={<HomeIcon />}
    >
      <FormField label="城市" required inline>
        <ProvinceCitySelector
          value={selectedCityCode}
          onChange={setSelectedCityCode}
          placeholder="请选择工作城市"
        />
      </FormField>

      <FormField label="税前月薪" required inline>
        <Input
          type="digit"
          value={monthlySalary}
          onChange={setMonthlySalary}
          prefix="￥"
        />
      </FormField>
    </BasePanel>
  );
};

export default BasicInfoPanel;
