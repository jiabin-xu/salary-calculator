import React, { useState, useEffect } from "react";
import { View, Text, Picker } from "@tarojs/components";
import provinces from "../data/cities.json";

// 定义省市数据接口
export interface ProvinceData {
  code: string;
  city: string;
  pinyin: string;
  province: string;
}

// 定义选择器属性
interface ProvinceCitySelectorProps {
  value: string;
  onChange: (cityCode: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// 组织省份数据
const getProvinceList = () => {
  const provinceMap = new Map<string, ProvinceData[]>();

  provinces.forEach((item) => {
    if (item.province) {
      if (!provinceMap.has(item.province)) {
        provinceMap.set(item.province, []);
      }
      const cities = provinceMap.get(item.province);
      if (cities) {
        cities.push(item);
      }
    }
  });

  return Array.from(provinceMap).map(([name, cities]) => ({
    name,
    cities,
  }));
};

const provinceList = getProvinceList();

const ProvinceCitySelector: React.FC<ProvinceCitySelectorProps> = ({
  value,
  onChange,
  placeholder = "请选择省市",
  disabled = false,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [multiValue, setMultiValue] = useState<[number, number]>([0, 0]);

  // 根据省份获取城市列表
  const getCityOptions = (provinceName: string) => {
    const province = provinceList.find((p) => p.name === provinceName);
    return province ? province.cities : [];
  };

  // 范围数据
  const rangeData = [
    provinceList.map((p) => p.name),
    selectedProvince
      ? getCityOptions(selectedProvince).map((city) => city.city)
      : [],
  ];

  // 初始化选中状态
  useEffect(() => {
    if (value) {
      const selectedCityData = provinces.find((item) => item.code === value);
      if (selectedCityData && selectedCityData.province) {
        const provinceIndex = provinceList.findIndex(
          (p) => p.name === selectedCityData.province
        );
        if (provinceIndex >= 0) {
          setSelectedProvince(selectedCityData.province);
          const cities = getCityOptions(selectedCityData.province);
          const cityIndex = cities.findIndex(
            (city) => city.code === selectedCityData.code
          );
          setMultiValue([provinceIndex, cityIndex >= 0 ? cityIndex : 0]);
          setSelectedCity(selectedCityData.city);
        }
      }
    }
  }, [value]);

  // 处理选择器变化
  const handleChange = (e) => {
    const { value: newValue } = e.detail;
    const provinceName = provinceList[newValue[0]].name;
    setSelectedProvince(provinceName);

    const cities = getCityOptions(provinceName);
    if (cities.length > 0) {
      const cityIndex = newValue[1] < cities.length ? newValue[1] : 0;
      const cityData = cities[cityIndex];
      setSelectedCity(cityData.city);
      setMultiValue([newValue[0], cityIndex]);
      onChange(cityData.code);
    }
  };

  // 处理列变化（用于联动更新城市列表）
  const handleColumnChange = (e) => {
    const { column, value: columnValue } = e.detail;

    if (column === 0) {
      const provinceName = provinceList[columnValue].name;
      setSelectedProvince(provinceName);
      setMultiValue([columnValue, 0]);
    }
  };

  // 获取显示文字
  const getDisplayText = () => {
    if (selectedProvince && selectedCity) {
      return `${selectedProvince} - ${selectedCity}`;
    }
    return placeholder;
  };

  return (
    <Picker
      mode="multiSelector"
      range={rangeData}
      onChange={handleChange}
      onColumnChange={handleColumnChange}
      disabled={disabled}
      value={multiValue}
    >
      <View className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
        <Text
          className={`${
            selectedProvince && selectedCity ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {getDisplayText()}
        </Text>
        <View className="triangle-down border-gray-400" />
      </View>
    </Picker>
  );
};

export default ProvinceCitySelector;
