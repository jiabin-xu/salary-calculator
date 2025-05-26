import { useState, useEffect } from 'react';
import Taro from "@tarojs/taro";

// 收入类型定义
export interface IncomeItem {
  id: string;
  type: string;
  amount: string;
  description: string;
  isFixed: boolean; // 是否为固定收入
}

// 支出类型定义
export interface ExpenseItem {
  id: string;
  type: string;
  amount: string;
  description: string;
  isFixed: boolean; // 是否为固定支出
}

// 收入类型选项
export const INCOME_TYPES = [
  { value: "salary", label: "工资" },
  { value: "bonus", label: "奖金" },
  { value: "investment", label: "投资" },
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
  { value: "loan", label: "贷款" },
  { value: "other", label: "其他" },
];

// 月度薪资数据类型
export interface MonthlySalary {
  month: number;
  salary: number;
  preTaxSalary: number;
  withBonus: boolean;
  bonusAmount: number;
  bonusAfterTax: number;
}

// 收支统计
export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  disposableIncome: number;
  incomePercentage: number;
  expensePercentage: number;
  isSurplus: boolean;
  fixedIncome: number;
  temporaryIncome: number;
  fixedExpense: number;
  temporaryExpense: number;
}

// 生成唯一ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useDisposableIncomeState = () => {
  // 收入项目
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);

  // 支出项目
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);



  // 汇总数据
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    disposableIncome: 0,
    incomePercentage: 0,
    expensePercentage: 0,
    isSurplus: true,
    fixedIncome: 0,
    temporaryIncome: 0,
    fixedExpense: 0,
    temporaryExpense: 0
  });

  // 初始化数据
  useEffect(() => {
    try {
      // 读取收入数据
      const storedIncomes = Taro.getStorageSync("incomeItems");
      if (storedIncomes) {
        setIncomeItems(JSON.parse(storedIncomes));
      }

      // 读取支出数据
      const storedExpenses = Taro.getStorageSync("expenseItems");
      if (storedExpenses) {
        setExpenseItems(JSON.parse(storedExpenses));
      }

    } catch (error) {
      console.error("初始化数据失败", error);
    }
  }, []);

  // 保存收入数据到本地存储
  useEffect(() => {
    try {
      if (incomeItems.length > 0) {
        Taro.setStorageSync("incomeItems", JSON.stringify(incomeItems));
      }
    } catch (error) {
      console.error("保存收入数据失败", error);
    }
  }, [incomeItems]);

  // 保存支出数据到本地存储
  useEffect(() => {
    try {
      if (expenseItems.length > 0) {
        Taro.setStorageSync("expenseItems", JSON.stringify(expenseItems));
      }
    } catch (error) {
      console.error("保存支出数据失败", error);
    }
  }, [expenseItems]);

  // 计算汇总数据
  const calculateSummary = () => {
    // 计算固定收入
    const fixedIncome = incomeItems
      .filter((item) => item.isFixed)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    // 计算临时收入
    const temporaryIncome = incomeItems
      .filter((item) => !item.isFixed)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    // 计算固定支出
    const fixedExpense = expenseItems
      .filter((item) => item.isFixed)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    // 计算临时支出
    const temporaryExpense = expenseItems
      .filter((item) => !item.isFixed)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    // 计算总收入和总支出
    const totalIncome = fixedIncome + temporaryIncome;
    const totalExpense = fixedExpense + temporaryExpense;

    // 计算可支配收入
    const disposableIncome = totalIncome - totalExpense;

    // 计算百分比
    const incomePercentage = totalIncome > 0
      ? Math.max(0, parseFloat((((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)))
      : 0;

    const expensePercentage = totalIncome > 0
      ? Math.min(100, parseFloat(((totalExpense / totalIncome) * 100).toFixed(1)))
      : 0;

    const newSummary = {
      totalIncome,
      totalExpense,
      disposableIncome,
      incomePercentage,
      expensePercentage,
      isSurplus: disposableIncome >= 0,
      fixedIncome,
      temporaryIncome,
      fixedExpense,
      temporaryExpense
    };

    setSummary(newSummary);
    return newSummary;
  };

  // 使用useEffect来处理汇总计算，避免无限渲染
  useEffect(() => {
    calculateSummary();
  }, [incomeItems, expenseItems]);

  // 添加新收入
  const addIncome = (income: IncomeItem) => {
    if (!income.amount || Number(income.amount) <= 0) {
      throw new Error("请输入有效金额");
    }

    const newItem = {
      ...income,
      id: income.id || generateId(),
    };

    setIncomeItems(prevItems => [...prevItems, newItem]);
    return newItem;
  };

  // 添加新支出
  const addExpense = (expense: ExpenseItem) => {
    if (!expense.amount || Number(expense.amount) <= 0) {
      throw new Error("请输入有效金额");
    }

    const newItem = {
      ...expense,
      id: expense.id || generateId(),
    };

    setExpenseItems(prevItems => [...prevItems, newItem]);
    return newItem;
  };

  // 删除收入项
  const deleteIncome = (id: string) => {
    setIncomeItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 删除支出项
  const deleteExpense = (id: string) => {
    setExpenseItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 更新收入项
  const updateIncome = (id: string, updatedIncome: Partial<IncomeItem>) => {
    setIncomeItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updatedIncome } : item
      )
    );
  };

  // 更新支出项
  const updateExpense = (id: string, updatedExpense: Partial<ExpenseItem>) => {
    setExpenseItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updatedExpense } : item
      )
    );
  };

  // 获取收入类型标签
  const getIncomeTypeLabel = (type: string) => {
    const found = INCOME_TYPES.find((item) => item.value === type);
    return found ? found.label : type;
  };

  // 获取支出类型标签
  const getExpenseTypeLabel = (type: string) => {
    const found = EXPENSE_TYPES.find((item) => item.value === type);
    return found ? found.label : type;
  };

  // 检查是否有工资收入
  const hasSalaryIncome = incomeItems.some(
    (item) => item.type === "salary" && Number(item.amount) > 0
  )



  // 根据月度工资数据更新收入
  const updateMonthlyIncome = (salaries: MonthlySalary[]) => {
    // 先找出并删除所有工资类型的收入
    const nonSalaryIncomes = incomeItems.filter(item => item.type !== "salary");

    // 为每个月创建工资收入项
    const salaryIncomes = salaries.map(monthData => {
      const description = `${monthData.month}月工资${monthData.withBonus ? " (含奖金)" : ""}`;
      // 总金额 = 工资 + 奖金（如果有）
      const totalAmount = monthData.salary + (monthData.withBonus ? monthData.bonusAfterTax : 0);

      return {
        id: generateId(),
        type: "salary",
        amount: totalAmount.toString(),
        description,
        isFixed: true,
      };
    });

    // 更新收入列表
    setIncomeItems([...nonSalaryIncomes, ...salaryIncomes]);
  };

  // 导出所有状态和方法
  return {
    // 状态
    incomeItems,
    expenseItems,
    summary,

    // 设置方法
    setIncomeItems,
    setExpenseItems,


    // 操作方法
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
    updateIncome,
    updateExpense,
    updateMonthlyIncome,
    hasSalaryIncome,

    // 工具方法
    getIncomeTypeLabel,
    getExpenseTypeLabel,
  };
};

export default useDisposableIncomeState;
