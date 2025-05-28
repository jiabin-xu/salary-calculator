import React, { useState } from "react";
import { View, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useInterval } from "../../hooks/useInterval";
import PageHeader from "../../components/salary/PageHeader";
import WorkSettingsForm from "../../components/salary/WorkSettingsForm";
import EarningsDisplay from "../../components/salary/EarningsDisplay";
import EarningsStats from "../../components/salary/EarningsStats";
import { useShare } from "../../utils/shareHooks";

const RealTimeEarnings: React.FC = () => {
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState<string>("6000");
  const [workStartTime, setWorkStartTime] = useState<string>("09:00");
  const [workEndTime, setWorkEndTime] = useState<string>("18:00");
  const [currentEarnings, setCurrentEarnings] = useState<number>(0);
  const [isWorkEnded, setIsWorkEnded] = useState(false);
  const [isBeforeWork, setIsBeforeWork] = useState(false);

  useShare(
    "💰 实时收入计算器 | 看看你每分钟赚多少",
    "/pages/realTimeEarnings/index"
  );

  // 计算每日工作时长（小时）
  const calculateDailyWorkHours = (): number => {
    const [startHour, startMinute] = workStartTime.split(":").map(Number);
    const [endHour, endMinute] = workEndTime.split(":").map(Number);

    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    // 计算工作时长（分钟）
    const workMinutes = endTimeInMinutes - startTimeInMinutes;

    return workMinutes / 60;
  };

  const calculateHourlyRate = () => {
    const monthlyAmount = parseFloat(monthlySalary || "0");
    if (isNaN(monthlyAmount)) return 0;

    const dailyWorkHours = calculateDailyWorkHours();
    // 每月按21.75个工作日计算
    return monthlyAmount / 21.75 / dailyWorkHours;
  };

  const hourlyRate = calculateHourlyRate();

  const calculateCurrentEarnings = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    const [startHour, startMinute] = workStartTime.split(":").map(Number);
    const [endHour, endMinute] = workEndTime.split(":").map(Number);

    const currentTimeInSeconds =
      (currentHour * 60 + currentMinute) * 60 + currentSecond;
    const startTimeInSeconds = (startHour * 60 + startMinute) * 60;
    const endTimeInSeconds = (endHour * 60 + endMinute) * 60;

    // 如果已经过了下班时间，显示全天工资
    if (currentTimeInSeconds > endTimeInSeconds) {
      const totalWorkSeconds = endTimeInSeconds - startTimeInSeconds;
      const secondRate = hourlyRate / 3600;
      const earned = secondRate * totalWorkSeconds;
      setCurrentEarnings(earned > 0 ? earned : 0);
      setIsWorkEnded(true);
      setIsBeforeWork(false);
      return;
    }

    // 如果还没到上班时间
    if (currentTimeInSeconds < startTimeInSeconds) {
      setCurrentEarnings(0);
      setIsWorkEnded(false);
      setIsBeforeWork(true);
      return;
    }

    // 正常工作时间内
    const workedSeconds = currentTimeInSeconds - startTimeInSeconds;
    const secondRate = hourlyRate / 3600;
    const earned = secondRate * workedSeconds;
    setCurrentEarnings(earned > 0 ? earned : 0);
    setIsWorkEnded(false);
    setIsBeforeWork(false);
  };

  const handleStartWork = () => {
    if (!monthlySalary) {
      Taro.showToast({
        title: "请输入月工资",
        icon: "none",
      });
      return;
    }
    setIsDetailMode(true);
    setIsWorkEnded(false);
    setIsBeforeWork(false);
    calculateCurrentEarnings();
  };

  const handleReset = () => {
    setIsDetailMode(false);
    setCurrentEarnings(0);
    setIsWorkEnded(false);
    setIsBeforeWork(false);
  };

  const handleTimeChange = (type: "start" | "end", e: any) => {
    const time = e.detail.value;
    if (type === "start") {
      setWorkStartTime(time);
    } else {
      setWorkEndTime(time);
    }
  };

  // 每秒更新收入
  useInterval(() => {
    if (isDetailMode && !isWorkEnded) {
      calculateCurrentEarnings();
    }
  }, 1000);

  const getPageSubtitle = () => {
    if (!isDetailMode) return "设置工作时间开始计算";
    if (isWorkEnded) return "今日工作已完成";
    if (isBeforeWork) return "等待工作开始";
    return "实时追踪你的收入增长";
  };

  return (
    <View className="bg-gray-50 min-h-screen pb-8">
      <PageHeader title="实时工资" subtitle={getPageSubtitle()} />

      {!isDetailMode ? (
        <WorkSettingsForm
          monthlySalary={monthlySalary}
          workStartTime={workStartTime}
          workEndTime={workEndTime}
          onMonthlySalaryChange={setMonthlySalary}
          onStartTimeChange={(e) => handleTimeChange("start", e)}
          onEndTimeChange={(e) => handleTimeChange("end", e)}
          onSubmit={handleStartWork}
        />
      ) : (
        <View className="mx-4">
          <EarningsDisplay
            workStartTime={workStartTime}
            workEndTime={workEndTime}
            currentEarnings={currentEarnings}
            isWorkEnded={isWorkEnded}
            isBeforeWork={isBeforeWork}
          />

          <EarningsStats
            hourlyRate={hourlyRate}
            minuteRate={hourlyRate / 60}
            secondRate={hourlyRate / 3600}
          />

          <Button
            className="w-full h-12 border-0 text-gray-600 font-bold text-lg flex items-center justify-center"
            onClick={handleReset}
          >
            重新设置
          </Button>
        </View>
      )}
    </View>
  );
};

export default RealTimeEarnings;
