import React from "react";
import { View } from "@tarojs/components";
import MenuItem from "../MenuItem";
import { WorkIcon, SettingsIcon, GiftIcon } from "../icons";

interface MenuItemsProps {
  insuranceSummary: string;
  deductionsSummary: string;
  bonusSummary: string;
  onInsuranceClick: () => void;
  onDeductionsClick: () => void;
  onBonusClick: () => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({
  insuranceSummary,
  deductionsSummary,
  bonusSummary,
  onInsuranceClick,
  onDeductionsClick,
  onBonusClick,
}) => {
  return (
    <View className="mx-4">
      <MenuItem
        title="社保公积金设置"
        subtitle={insuranceSummary}
        icon={<WorkIcon />}
        onClick={onInsuranceClick}
      />

      <MenuItem
        title="专项附加扣除"
        subtitle={deductionsSummary}
        icon={<SettingsIcon />}
        onClick={onDeductionsClick}
      />

      <MenuItem
        title="年终奖设置"
        subtitle={bonusSummary}
        icon={<GiftIcon />}
        onClick={onBonusClick}
      />
    </View>
  );
};

export default MenuItems;
