import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, ScrollView, Image, Switch } from "@tarojs/components";
import Taro from "@tarojs/taro";
import PageHeader from "../../components/salary/PageHeader";
import BasePanel from "../../components/BasePanel";
import Input from "../../components/Input";
import FormField from "../../components/FormField";
import { useShare } from "@/utils/shareHooks";
import useDisposableIncomeState, {
  INCOME_TYPES,
  EXPENSE_TYPES,
  IncomeItem,
  ExpenseItem,
} from "../../hooks/useDisposableIncomeState";
import FinancialChart from "../../components/FinancialChart";
import TrendChart from "../../components/TrendChart";
import useTrendData from "../../hooks/useTrendData";
import useMonthlyData from "../../hooks/useMonthlyData";

// 导入组件
import SalarySelectionGuide from "../../components/disposable-income/SalarySelectionGuide";
import FinancialSummaryHeader from "../../components/disposable-income/FinancialSummaryHeader";
import YearlyForecastCard from "../../components/disposable-income/YearlyForecastCard";
import MonthlyIncomeCard from "../../components/disposable-income/MonthlyIncomeCard";
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
    getMonthSalary,
  } = useDisposableIncomeState();

  // 使用月度数据Hook
  const { getCurrentMonth, calculateYearlyData } = useMonthlyData();

  // 使用趋势数据 Hook
  // const { getRecentMonths, getAverages, getTrends } = useTrendData();

  // 获取最近6个月的数据
  // const recentMonthsData = getRecentMonths(6);

  // 获取平均数据
  // const { avgIncome, avgExpense, avgDisposable } = getAverages();

  // 获取趋势
  // const { incomeUp, expenseUp, disposableUp } = getTrends();

  // UI状态
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<"income" | "expense">("income");
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

  // 检查是否已有工资收入
  const hasSalary = useMemo(() => hasSalaryIncome(), [hasSalaryIncome]);

  // 打开添加收入表单
  const openAddIncomeForm = useCallback(() => {
    setFormType("income");
    setShowAddForm(true);
  }, []);

  // 打开添加支出表单
  const openAddExpenseForm = useCallback(() => {
    setFormType("expense");
    setShowAddForm(true);
  }, []);

  // 关闭添加表单
  const closeAddForm = useCallback(() => {
    setShowAddForm(false);
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
      closeAddForm();
    } catch (error) {
      Taro.showToast({ title: error.message, icon: "none" });
    }
  }, [addIncome, newIncome, setNewIncome, closeAddForm]);

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
      closeAddForm();
    } catch (error) {
      Taro.showToast({ title: error.message, icon: "none" });
    }
  }, [addExpense, newExpense, setNewExpense, closeAddForm]);

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

  // 渲染单个收支项目
  const renderItem = (item: IncomeItem | ExpenseItem, isIncome: boolean) => {
    const amount = Number(item.amount);
    const getLabel = isIncome ? getIncomeTypeLabel : getExpenseTypeLabel;
    const handleDelete = isIncome ? deleteIncome : deleteExpense;

    return (
      <View
        key={item.id}
        className="flex items-center justify-between p-4 bg-white rounded-lg mb-3 shadow-sm"
      >
        <View className="flex items-center">
          <View
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              isIncome
                ? item.isFixed
                  ? "bg-green-100"
                  : "bg-emerald-100"
                : item.isFixed
                ? "bg-red-100"
                : "bg-orange-100"
            }`}
          >
            <Text
              className={`text-lg ${
                isIncome
                  ? item.isFixed
                    ? "text-green-600"
                    : "text-emerald-600"
                  : item.isFixed
                  ? "text-red-600"
                  : "text-orange-600"
              }`}
            >
              {isIncome ? "+" : "-"}
            </Text>
          </View>
          <View>
            <Text className="text-gray-800 font-medium">
              {getLabel(item.type)}
              <Text className="text-xs ml-2 text-gray-500">
                {item.isFixed ? "(固定)" : "(临时)"}
              </Text>
            </Text>
            {item.description && (
              <Text className="text-gray-500 text-xs block mt-1">
                {item.description}
              </Text>
            )}
          </View>
        </View>
        <View className="flex items-center">
          <Text
            className={`font-medium mr-4 ${
              isIncome
                ? item.isFixed
                  ? "text-green-600"
                  : "text-emerald-600"
                : item.isFixed
                ? "text-red-600"
                : "text-orange-600"
            }`}
          >
            {isIncome ? "+" : "-"}¥{amount.toFixed(0)}
          </Text>
          <View
            className="bg-gray-100 p-2 rounded-full"
            onClick={() => handleDelete(item.id)}
          >
            <View className="w-4 h-4 flex items-center justify-center">
              <Text className="text-gray-500 text-xs">✕</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 如果没有工资收入，显示引导页
  if (!hasSalary) {
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

      {/* 月度工资卡片 */}
      <MonthlyIncomeCard
        monthName={currentMonth.name}
        monthlySalary={getMonthSalary(currentMonth.number)}
      />

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
        onAddIncome={openAddIncomeForm}
        onAddExpense={openAddExpenseForm}
      />

      {/* 添加收支表单弹窗 */}
      {showAddForm && (
        <IncomeExpenseForm
          formType={formType}
          newIncome={newIncome}
          newExpense={newExpense}
          setNewIncome={setNewIncome}
          setNewExpense={setNewExpense}
          onAdd={formType === "income" ? handleAddIncome : handleAddExpense}
          onClose={closeAddForm}
        />
      )}
    </View>
  );
};

export default DisposableIncome;
