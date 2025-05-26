// 收入类型选项
export const INCOME_TYPES = [
  { value: "salary", label: "工资" },
  { value: "bonus", label: "奖金" },
  { value: "parttime", label: "兼职" },
  // { value: "business", label: "经营" },
  { value: "investment", label: "理财" },
  { value: "rent", label: "租金" },
  { value: "other", label: "其他" },
];

// 支出类型选项
export const EXPENSE_TYPES = [
  { value: "rent", label: "房租" },
  { value: "mortgage", label: "房贷" },
  { value: "utilities", label: "水电" },
  { value: "food", label: "餐饮" },
  { value: "transport", label: "交通" },
  { value: "entertainment", label: "娱乐" },
  { value: "shopping", label: "购物" },
  { value: "medical", label: "医疗" },
  { value: "education", label: "教育" },
  { value: "insurance", label: "保险" },
  { value: "baby", label: "宝宝" },
  { value: "other", label: "其他" },
];

// 获取收入类型标签
export const getIncomeTypeLabel = (type: string): string => {
  const found = INCOME_TYPES.find((item) => item.value === type);
  return found ? found.label : type;
};

// 获取支出类型标签
export const getExpenseTypeLabel = (type: string): string => {
  const found = EXPENSE_TYPES.find((item) => item.value === type);
  return found ? found.label : type;
};

// 根据类型获取图标
export const getTypeIcon = (type: string, isIncome: boolean): string => {
  // 收入类型图标
  if (isIncome) {
    switch (type) {
      case "salary":
        return "💼"; // 工资
      case "bonus":
        return "🎁"; // 奖金
      case "parttime":
        return "⏱️"; // 兼职
      case "business":
        return "🏪"; // 经营
      case "investment":
        return "📈"; // 投资
      case "rent":
        return "🏠"; // 租金
      default:
        return "💰"; // 其他收入
    }
  }
  // 支出类型图标
  else {
    switch (type) {
      case "rent":
        return "🏢"; // 房租
      case "mortgage":
        return "🏦"; // 房贷
      case "utilities":
        return "💡"; // 水电
      case "food":
        return "🍲"; // 餐饮
      case "transport":
        return "🚌"; // 交通
      case "entertainment":
        return "🎮"; // 娱乐
      case "shopping":
        return "🛍️"; // 购物
      case "medical":
        return "💊"; // 医疗
      case "education":
        return "📚"; // 教育
      case "insurance":
        return "🔒"; // 保险
      case "loan":
        return "💳"; // 贷款
      case "baby":
        return "👶"; // 宝宝
      default:
        return "💸"; // 其他支出
    }
  }
};
