import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useShare } from "@/utils/shareHooks";
import useDisposableIncomeState, {
  MonthlySalary,
  IncomeItem,
  ExpenseItem,
} from "../../hooks/useDisposableIncomeState";
import useMonthlyData from "../../hooks/useMonthlyData";

// 导入组件
import SalarySelectionGuide from "../../components/disposable-income/SalarySelectionGuide";
import FinancialSummaryHeader from "../../components/disposable-income/FinancialSummaryHeader";
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
    summary,
    addIncome,
    addExpense,
    updateIncome,
    updateExpense,
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
  const [selectedItem, setSelectedItem] = useState<
    IncomeItem | ExpenseItem | null
  >(null);

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

  // 处理提交数据
  const handleSubmitData = useCallback(
    (data: IncomeItem | ExpenseItem) => {
      try {
        // 检查是否为编辑现有项目
        if (data.id) {
          if (formType === "income") {
            updateIncome(data.id, data as IncomeItem);
          } else {
            updateExpense(data.id, data as ExpenseItem);
          }
        } else {
          // 添加新项目
          if (formType === "income") {
            addIncome(data as IncomeItem);
          } else {
            addExpense(data as ExpenseItem);
          }
        }
        // 重置表单状态
        handleCloseForm();
      } catch (error) {
        Taro.showToast({ title: error.message, icon: "none" });
      }
    },
    [formType, addIncome, addExpense, updateIncome, updateExpense]
  );

  // 处理编辑收入
  const handleEditIncome = useCallback((item: IncomeItem) => {
    setFormType("income");
    setSelectedItem(item);
  }, []);

  // 处理编辑支出
  const handleEditExpense = useCallback((item: ExpenseItem) => {
    setFormType("expense");
    setSelectedItem(item);
  }, []);

  // 处理关闭表单
  const handleCloseForm = useCallback(() => {
    setFormType(null);
    setSelectedItem(null);
  }, []);

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
        yearlyData={yearlyData}
      />

      {/* 收支明细列表 */}
      <FinancialItemsList
        incomeItems={incomeItems}
        expenseItems={expenseItems}
        filterType={filterType}
        getIncomeTypeLabel={getIncomeTypeLabel}
        getExpenseTypeLabel={getExpenseTypeLabel}
        deleteIncome={deleteIncome}
        deleteExpense={deleteExpense}
        onEditIncome={handleEditIncome}
        onEditExpense={handleEditExpense}
        onFilterChange={handleFilterChange}
      />

      {/* 底部添加按钮 */}
      <BottomActionButtons
        onAddIncome={() => {
          setSelectedItem(null);
          setFormType("income");
        }}
        onAddExpense={() => {
          setSelectedItem(null);
          setFormType("expense");
        }}
      />

      {/* 添加/编辑收支表单弹窗 */}
      {formType && (
        <IncomeExpenseForm
          formType={formType}
          selectedItem={selectedItem || undefined}
          onSubmit={handleSubmitData}
          onClose={handleCloseForm}
        />
      )}
    </View>
  );
};

export default DisposableIncome;
