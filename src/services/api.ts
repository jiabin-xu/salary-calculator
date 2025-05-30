import Taro from "@tarojs/taro";

// 获取城市平均工资
export const getCityAverageWage = async (cityCode: string): Promise<number> => {
  try {
    // 这里应该调用实际的API接口
    // 目前使用模拟数据
    const mockData: Record<string, number> = {
      "110000": 8000, // 北京
      "310000": 7500, // 上海
      "440100": 7000, // 广州
      "440300": 6800, // 深圳
      // 可以添加更多城市的数据
    };

    // 如果没有找到对应城市的数据，返回一个默认值
    return mockData[cityCode] || 6000;
  } catch (error) {
    console.error("获取城市平均工资失败:", error);
    throw error;
  }
};
