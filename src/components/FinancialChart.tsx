import React from "react";
import { View, Text } from "@tarojs/components";

interface ChartItem {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface FinancialChartProps {
  data: ChartItem[];
  title?: string;
  showLabels?: boolean;
  showPercentages?: boolean;
  height?: number;
  className?: string;
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  title,
  showLabels = true,
  showPercentages = true,
  height = 20,
  className = "",
}) => {
  // 计算总值
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View className={`w-full ${className}`}>
      {title && <Text className="text-gray-700 text-sm mb-2">{title}</Text>}

      {/* 图表标签 */}
      {showLabels && (
        <View className="flex justify-between text-xs text-gray-500 mb-1">
          {data.map((item) => (
            <Text key={item.label} style={{ color: item.color }}>
              {item.label}
              {showPercentages && ` (${item.percentage.toFixed(1)}%)`}
            </Text>
          ))}
        </View>
      )}

      {/* 图表条形 */}
      <View
        className="bg-gray-200 rounded-full overflow-hidden flex"
        style={{ height: `${height}px` }}
      >
        {data.map((item, index) => (
          <View
            key={item.label}
            className="h-full"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
              borderRadius:
                index === 0
                  ? "9999px 0 0 9999px"
                  : index === data.length - 1
                  ? "0 9999px 9999px 0"
                  : 0,
            }}
          />
        ))}
      </View>

      {/* 图表数值 */}
      {showPercentages && (
        <View className="flex justify-between text-xs mt-1">
          {data.map((item) => (
            <Text key={item.label} style={{ color: item.color }}>
              ¥{item.value.toFixed(0)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default FinancialChart;
