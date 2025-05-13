// 个税税率表
export const personalTaxRates = [
  { threshold: 0, rate: 0.03, deduction: 0 },
  { threshold: 36000, rate: 0.1, deduction: 2520 },
  { threshold: 144000, rate: 0.2, deduction: 16920 },
  { threshold: 300000, rate: 0.25, deduction: 31920 },
  { threshold: 420000, rate: 0.3, deduction: 52920 },
  { threshold: 660000, rate: 0.35, deduction: 85920 },
  { threshold: 960000, rate: 0.45, deduction: 181920 }
];

// 个税年终奖税率表 (按月换算)
export const bonusTaxRates = [
  { threshold: 0, rate: 0.03, deduction: 0 },
  { threshold: 3000, rate: 0.1, deduction: 210 },
  { threshold: 12000, rate: 0.2, deduction: 1410 },
  { threshold: 25000, rate: 0.25, deduction: 2660 },
  { threshold: 35000, rate: 0.3, deduction: 4410 },
  { threshold: 55000, rate: 0.35, deduction: 7160 },
  { threshold: 80000, rate: 0.45, deduction: 15160 }
];

// 社保缴纳比例
export const socialInsuranceRates = {
  pension: { personal: 0.08, company: 0.16 },       // 养老保险
  medical: { personal: 0.02, company: 0.08 },       // 医疗保险
  unemployment: { personal: 0.005, company: 0.005 }, // 失业保险
  injury: { personal: 0, company: 0.002 },           // 工伤保险
  maternity: { personal: 0, company: 0 }          // 生育保险
};

// 专项附加扣除项目
export interface SpecialDeduction {
  id: string;
  name: string;
  maxAmount: number;
  default: number;
}

export const specialDeductions: SpecialDeduction[] = [
  { id: 'children_education', name: '子女教育', maxAmount: 1000, default: 0 },
  { id: 'continuing_education', name: '继续教育', maxAmount: 400, default: 0 },
  { id: 'housing_loan', name: '住房贷款利息', maxAmount: 1000, default: 0 },
  { id: 'housing_rent', name: '住房租金', maxAmount: 1500, default: 0 },
  { id: 'elderly_care', name: '赡养老人', maxAmount: 2000, default: 0 },
  { id: 'child_care', name: '3岁以下婴幼儿照护', maxAmount: 1000, default: 0 }
];
