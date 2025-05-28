import React, { useState } from "react";
import { View, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useInterval } from "../../hooks/useInterval";
import PageHeader from "../../components/salary/PageHeader";
import WorkSettingsForm from "../../components/salary/WorkSettingsForm";
import EarningsDisplay from "../../components/salary/EarningsDisplay";
import EarningsStats from "../../components/salary/EarningsStats";

const RealTimeEarnings: React.FC = () => {
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState<string>("6000");
  const [workStartTime, setWorkStartTime] = useState<string>("09:00");
  const [workEndTime, setWorkEndTime] = useState<string>("18:00");
  const [currentEarnings, setCurrentEarnings] = useState<number>(0);
  const [isWorking, setIsWorking] = useState<boolean>(false);

  const calculateHourlyRate = () => {
    const monthlyAmount = parseFloat(monthlySalary || "0");
    if (isNaN(monthlyAmount)) return 0;
    return monthlyAmount / 22 / 8;
  };

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

    if (
      currentTimeInSeconds >= startTimeInSeconds &&
      currentTimeInSeconds <= endTimeInSeconds
    ) {
      setIsWorking(true);
      const workedSeconds = currentTimeInSeconds - startTimeInSeconds;
      const hourlyRate = calculateHourlyRate();
      const secondRate = hourlyRate / 3600;
      const earned = secondRate * workedSeconds;
      setCurrentEarnings(earned > 0 ? earned : 0);
    } else {
      setIsWorking(false);
      if (currentTimeInSeconds < startTimeInSeconds) {
        setCurrentEarnings(0);
      }
    }
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
    calculateCurrentEarnings();
  };

  const handleReset = () => {
    setIsDetailMode(false);
    setCurrentEarnings(0);
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
    if (isDetailMode) {
      calculateCurrentEarnings();
    }
  }, 1000);

  const hourlyRate = calculateHourlyRate();

  return (
    <View className="bg-gray-50 min-h-screen pb-8">
      <PageHeader
        title="实时工资"
        subtitle={
          isDetailMode ? "实时追踪你的收入增长" : "设置工作时间开始计算"
        }
      />

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
