import { personalTaxRates, bonusTaxRates, socialInsuranceRates } from '../data/taxRates';

export interface SalaryParams {
  monthlySalary: number;  // 月薪
  cityId: string;         // 城市ID
  socialInsuranceBase: number;  // 社保基数
  housingFundBase: number;     // 公积金基数
  housingFundRate: number;     // 公积金比例
  specialDeductions: Record<string, number>; // 专项附加扣除
  bonus: {                     // 年终奖
    months: number;            // 几个月工资
    payMonth: number;          // 发放月份 (1-12)
    calculationType: 'separate' | 'combined'; // 计算方式：单独计税 or 并入年收入
  }
}

export interface MonthDetail {
  month: number;             // 月份
  preTaxSalary: number;      // 税前工资
  afterTaxSalary: number;    // 税后工资
  socialInsurance: number;   // 社保
  housingFund: number;       // 公积金
  tax: number;               // 个税
  bonus?: number;            // 年终奖
  bonusTax?: number;         // 年终奖个税
}

export interface SalaryResult {
  preTaxSalary: number;        // 税前月薪
  afterTaxSalary: number;      // 税后月薪
  socialInsurance: {           // 社保
    personal: {                // 个人缴纳
      pension: number;         // 养老保险
      medical: number;         // 医疗保险
      unemployment: number;    // 失业保险
      total: number;           // 总计
    };
    company: {                 // 公司缴纳
      pension: number;         // 养老保险
      medical: number;         // 医疗保险
      unemployment: number;    // 失业保险
      injury: number;          // 工伤保险
      maternity: number;       // 生育保险
      total: number;           // 总计
    };
  };
  housingFund: {               // 公积金
    personal: number;          // 个人缴纳
    company: number;           // 公司缴纳
  };
  tax: number;                 // 个税
  monthlyDetail: MonthDetail[];  // 月度详情
  yearlyTotal: {               // 年度汇总
    preTaxSalary: number;      // 税前年薪
    afterTaxSalary: number;    // 税后年薪
    socialInsurance: number;   // 社保总额
    housingFund: number;       // 公积金总额
    tax: number;               // 个税总额
  };
}

// 计算社保
export function calculateSocialInsurance(base: number) {
  const personal = {
    pension: base * socialInsuranceRates.pension.personal,
    medical: base * socialInsuranceRates.medical.personal,
    unemployment: base * socialInsuranceRates.unemployment.personal,
    total: 0
  };

  personal.total = personal.pension + personal.medical + personal.unemployment;

  const company = {
    pension: base * socialInsuranceRates.pension.company,
    medical: base * socialInsuranceRates.medical.company,
    unemployment: base * socialInsuranceRates.unemployment.company,
    injury: base * socialInsuranceRates.injury.company,
    maternity: base * socialInsuranceRates.maternity.company,
    total: 0
  };

  company.total = company.pension + company.medical + company.unemployment + company.injury + company.maternity;

  return { personal, company };
}

// 计算公积金
export function calculateHousingFund(base: number, rate: number) {
  const personal = base * rate;
  const company = base * rate;

  return { personal, company };
}

// 计算个税
export function calculateTax(monthlySalary: number, socialInsurance: number, housingFund: number, specialDeductionsTotal: number, cumulativeTaxableIncome: number = 0, cumulativeTax: number = 0) {
  // 每月5000元的基本减除费用
  const basicDeduction = 5000;

  // 应纳税所得额 = 税前工资 - 三险一金 - 起征点 - 专项附加扣除
  const taxableIncome = monthlySalary - socialInsurance - housingFund - basicDeduction - specialDeductionsTotal;

  // 累计应纳税所得额
  const newCumulativeTaxableIncome = cumulativeTaxableIncome + taxableIncome;

  // 如果应纳税所得额小于等于0，则不用缴税
  if (newCumulativeTaxableIncome <= 0) {
    return { tax: 0, cumulativeTaxableIncome: newCumulativeTaxableIncome, cumulativeTax };
  }

  // 计算累计应纳税额
  let currentTaxRate = personalTaxRates[0].rate;
  let currentDeduction = personalTaxRates[0].deduction;

  for (let i = personalTaxRates.length - 1; i >= 0; i--) {
    if (newCumulativeTaxableIncome > personalTaxRates[i].threshold) {
      currentTaxRate = personalTaxRates[i].rate;
      currentDeduction = personalTaxRates[i].deduction;
      break;
    }
  }

  const newCumulativeTax = newCumulativeTaxableIncome * currentTaxRate - currentDeduction;

  // 当月应缴税额 = 累计应缴税额 - 已缴税额
  const tax = Math.max(0, newCumulativeTax - cumulativeTax);

  return {
    tax,
    cumulativeTaxableIncome: newCumulativeTaxableIncome,
    cumulativeTax: newCumulativeTax
  };
}

// 计算年终奖个税（单独计税）
export function calculateBonusTax(bonusAmount: number) {
  // 按照月份换算
  const monthlyBonus = bonusAmount / 12;

  let taxRate = bonusTaxRates[0].rate;
  let deduction = bonusTaxRates[0].deduction;

  for (let i = bonusTaxRates.length - 1; i >= 0; i--) {
    if (monthlyBonus > bonusTaxRates[i].threshold) {
      taxRate = bonusTaxRates[i].rate;
      deduction = bonusTaxRates[i].deduction;
      break;
    }
  }

  return bonusAmount * taxRate - deduction;
}

// 计算全年薪资
export function calculateYearlySalary(params: SalaryParams): SalaryResult {
  const {
    monthlySalary,
    socialInsuranceBase,
    housingFundBase,
    housingFundRate,
    specialDeductions,
    bonus
  } = params;

  const specialDeductionsTotal = Object.values(specialDeductions).reduce((sum, value) => sum + value, 0);

  // 计算社保和公积金
  const socialInsurance = calculateSocialInsurance(socialInsuranceBase);
  const housingFund = calculateHousingFund(housingFundBase, housingFundRate);

  let cumulativeTaxableIncome = 0;
  let cumulativeTax = 0;

  // 计算每月薪资
  const monthlyDetail: MonthDetail[] = [];

  for (let month = 1; month <= 12; month++) {
    const { tax, cumulativeTaxableIncome: newCumulativeTaxableIncome, cumulativeTax: newCumulativeTax } =
      calculateTax(
        monthlySalary,
        socialInsurance.personal.total,
        housingFund.personal,
        specialDeductionsTotal,
        cumulativeTaxableIncome,
        cumulativeTax
      );

    cumulativeTaxableIncome = newCumulativeTaxableIncome;
    cumulativeTax = newCumulativeTax;

    const afterTaxSalary = monthlySalary - socialInsurance.personal.total - housingFund.personal - tax;

    const monthData: MonthDetail = {
      month,
      preTaxSalary: monthlySalary,
      afterTaxSalary,
      socialInsurance: socialInsurance.personal.total,
      housingFund: housingFund.personal,
      tax
    };

    // 如果是年终奖发放月份，计算年终奖
    if (month === bonus.payMonth && bonus.months > 0) {
      const bonusAmount = monthlySalary * bonus.months;

      if (bonus.calculationType === 'separate') {
        // 单独计税
        const bonusTax = calculateBonusTax(bonusAmount);
        monthData.bonus = bonusAmount;
        monthData.bonusTax = bonusTax;
        monthData.afterTaxSalary += (bonusAmount - bonusTax);
      } else {
        // 并入年收入计税（简化处理）
        const { tax: additionalTax } = calculateTax(
          bonusAmount,
          0,
          0,
          0,
          cumulativeTaxableIncome,
          cumulativeTax
        );

        monthData.bonus = bonusAmount;
        monthData.bonusTax = additionalTax;
        monthData.afterTaxSalary += (bonusAmount - additionalTax);
      }
    }

    monthlyDetail.push(monthData);
  }

  // 计算年度汇总
  const yearlyTotal = {
    preTaxSalary: monthlySalary * 12 + (bonus.months > 0 ? monthlySalary * bonus.months : 0),
    afterTaxSalary: monthlyDetail.reduce((sum, month) => sum + month.afterTaxSalary, 0),
    socialInsurance: socialInsurance.personal.total * 12,
    housingFund: housingFund.personal * 12,
    tax: monthlyDetail.reduce((sum, month) => sum + month.tax + (month.bonusTax || 0), 0)
  };

  return {
    preTaxSalary: monthlySalary,
    afterTaxSalary: monthlyDetail[0].afterTaxSalary,
    socialInsurance,
    housingFund,
    tax: monthlyDetail[0].tax,
    monthlyDetail,
    yearlyTotal
  };
}
