import React from "react";
import BasePanel from "../BasePanel";
import FormField from "../FormField";
import ProvinceCitySelector from "../ProvinceCitySelector";
import { HomeIcon } from "../icons";

interface CitySelectorProps {
  selectedCityCode: string;
  setSelectedCityCode: (value: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCityCode,
  setSelectedCityCode,
}) => {
  return (
    <BasePanel
      title="城市选择"
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
    </BasePanel>
  );
};

export default CitySelector;
