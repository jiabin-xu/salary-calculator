import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useShare } from "@/utils/shareHooks";
import useDisposableIncomeState, {
  MonthlySalary,
} from "../../hooks/useDisposableIncomeState";
import useMonthlyData from "../../hooks/useMonthlyData";

// 导入组件
import SalarySelectionGuide from "../../components/disposable-income/SalarySelectionGuide";
import FinancialSummaryHeader from "../../components/disposable-income/FinancialSummaryHeader";
import YearlyForecastCard from "../../components/disposable-income/YearlyForecastCard";
import { FinancialStatsSummary } from "../../components/disposable-income/FinancialStatsCard";
import FinancialItemsList from "../../components/disposable-income/FinancialItemsList";
import BottomActionButtons from "../../components/disposable-income/BottomActionButtons";
import IncomeExpenseForm from "../../components/disposable-income/IncomeExpenseForm";

const DisposableIncome: React.FC = () => {
  // 启用分享功能
  useShare();

  // 使用自定义 Hook 管理状态
  const {
    incomeItems,
    expenseItems,
    newIncome,
    newExpense,
    summary,
    setNewIncome,
    setNewExpense,
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
    getIncomeTypeLabel,
    getExpenseTypeLabel,
    hasSalaryIncome,
    updateMonthlyIncome,
  } = useDisposableIncomeState();

  // 使用月度数据Hook
  const { getCurrentMonth, calculateYearlyData } = useMonthlyData();

  // UI状态
  const [formType, setFormType] = useState<"income" | "expense" | null>(null);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );

  // 当前月份
  const currentMonth = getCurrentMonth;

  // 计算年度数据
  const yearlyData = useMemo(
    () => calculateYearlyData(summary.totalIncome, summary.totalExpense),
    [summary.totalIncome, summary.totalExpense]
  );

  // 在页面加载时，从 localStorage 读取月度工资数据并更新收入
  useEffect(() => {
    try {
      const storedSalaries = Taro.getStorageSync("monthlySalaries");
      if (storedSalaries) {
        const salariesData = JSON.parse(storedSalaries) as MonthlySalary[];
        // 使用月度工资数据更新收入项目
        updateMonthlyIncome(salariesData);
      }
    } catch (error) {
      console.error("读取或更新月度工资数据失败", error);
    }
  }, []);

  // 添加新收入
  const handleAddIncome = useCallback(() => {
    try {
      addIncome(newIncome);
      setNewIncome({
        id: "",
        type: "salary",
        amount: "",
        description: "",
        isFixed: true,
      });
      setFormType(null);
    } catch (error) {
      Taro.showToast({ title: error.message, icon: "none" });
    }
  }, [addIncome, newIncome, setNewIncome]);

  // 添加新支出
  const handleAddExpense = useCallback(() => {
    try {
      addExpense(newExpense);
      setNewExpense({
        id: "",
        type: "rent",
        amount: "",
        description: "",
        isFixed: true,
      });
      setFormType(null);
    } catch (error) {
      Taro.showToast({ title: error.message, icon: "none" });
    }
  }, [addExpense, newExpense, setNewExpense]);

  // 导航到工资计算器页面
  const navigateToSalaryCalculator = useCallback(() => {
    Taro.navigateTo({
      url: "/pages/index/index?from=disposableIncome",
    });
  }, []);

  // 更改筛选类型
  const handleFilterChange = useCallback(
    (type: "all" | "income" | "expense") => {
      setFilterType(type);
    },
    []
  );

  // 如果没有工资收入，显示引导页
  if (!hasSalaryIncome) {
    return <SalarySelectionGuide onSelectSalary={navigateToSalaryCalculator} />;
  }

  return (
    <View className="bg-gray-50 min-h-screen pb-24 relative">
      {/* 顶部财务摘要 */}
      <FinancialSummaryHeader
        summary={summary}
        currentMonth={currentMonth.name}
      />

      {/* 年度预测卡片 */}
      <YearlyForecastCard yearlyData={yearlyData} />

      {/* 固定与临时收支统计 */}
      <FinancialStatsSummary summary={summary} />

      {/* 收支明细列表 */}
      <FinancialItemsList
        incomeItems={incomeItems}
        expenseItems={expenseItems}
        filterType={filterType}
        getIncomeTypeLabel={getIncomeTypeLabel}
        getExpenseTypeLabel={getExpenseTypeLabel}
        deleteIncome={deleteIncome}
        deleteExpense={deleteExpense}
        onFilterChange={handleFilterChange}
      />

      {/* 底部添加按钮 */}
      <BottomActionButtons
        onAddIncome={() => setFormType("income")}
        onAddExpense={() => setFormType("expense")}
      />

      {/* 添加收支表单弹窗 */}
      {formType && (
        <IncomeExpenseForm
          formType={formType}
          newIncome={newIncome}
          newExpense={newExpense}
          setNewIncome={setNewIncome}
          setNewExpense={setNewExpense}
          onAdd={formType === "income" ? handleAddIncome : handleAddExpense}
          onClose={() => setFormType(null)}
        />
      )}
    </View>
  );
};

export default DisposableIncome;
