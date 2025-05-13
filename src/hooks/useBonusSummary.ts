import { useBonusState } from './useBonusState';

export function useBonusSummary() {
  const { bonusMonths, bonusMonth } = useBonusState();

  const getBonusSummary = () => {
    const months = Number(bonusMonths);
    if (months <= 0) return "无年终奖";
    return `${months}个月，${bonusMonth}月发放`;
  };

  return getBonusSummary();
}
