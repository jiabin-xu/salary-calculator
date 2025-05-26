import React from "react";
import { View, Text } from "@tarojs/components";

interface DataPoint {
  label: string;
  income: number;
  expense: number;
  disposable: number;
}

interface TrendChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  className?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title = "月度趋势",
  height = 120,
  className = "",
}) => {
  // 找出最大值，用于计算图表高度比例
  const maxValue = Math.max(
    ...data.map((point) => Math.max(point.income, point.expense))
  );

  return (
    <View className={`w-full ${className}`}>
      {title && <Text className="text-gray-700 text-sm mb-2">{title}</Text>}

      <View className="relative" style={{ height: `${height}px` }}>
        {/* 图表网格线 */}
        <View className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className="w-full border-t border-gray-100"
              style={{ top: `${(i * 100) / 4}%` }}
            />
          ))}
        </View>

        {/* 数据线和点 */}
        <View className="absolute inset-0 flex">
          {data.map((point, index) => {
            const incomeHeight = (point.income / maxValue) * 100;
            const expenseHeight = (point.expense / maxValue) * 100;
            const barWidth = `${100 / (data.length * 2)}%`;
            const positionLeft = `${(index / data.length) * 100}%`;
            const barGap = 2;

            return (
              <View
                key={point.label}
                className="relative h-full"
                style={{ width: `${100 / data.length}%` }}
              >
                {/* 收入柱 */}
                <View
                  className="absolute bottom-0 bg-green-500 rounded-t-sm"
                  style={{
                    height: `${incomeHeight}%`,
                    width: barWidth,
                    left: `${25 - barGap}%`,
                  }}
                />

                {/* 支出柱 */}
                <View
                  className="absolute bottom-0 bg-red-400 rounded-t-sm"
                  style={{
                    height: `${expenseHeight}%`,
                    width: barWidth,
                    left: `${50 + barGap}%`,
                  }}
                />

                {/* X轴标签 */}
                <Text className="absolute bottom-0 text-center text-xs text-gray-500 w-full transform translate-y-4">
                  {point.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 图例 */}
      <View className="flex justify-center space-x-6 mt-6">
        <View className="flex items-center">
          <View className="w-3 h-3 bg-green-500 mr-1 rounded-sm" />
          <Text className="text-xs text-gray-600">收入</Text>
        </View>
        <View className="flex items-center">
          <View className="w-3 h-3 bg-red-400 mr-1 rounded-sm" />
          <Text className="text-xs text-gray-600">支出</Text>
        </View>
        <View className="flex items-center">
          <View className="w-3 h-3 bg-blue-500 mr-1 rounded-sm" />
          <Text className="text-xs text-gray-600">可支配</Text>
        </View>
      </View>
    </View>
  );
};

export default TrendChart;
