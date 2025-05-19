import { useShareAppMessage, useShareTimeline } from "@tarojs/taro";

/**
 * 通用分享钩子，为页面添加分享到微信好友和朋友圈的能力
 * @param title 分享标题，默认为"贷款计算器 - 轻松计算贷款月供"
 * @param path 分享路径，默认为"/pages/calculator/index"
 * @param imageUrl 分享图片URL，可选
 */
export const useShare = (
  title: string = "薪资计算器 - 轻松计算税后收入",
  path: string = "/pages/index/index",
  imageUrl?: string
) => {
  // 分享给朋友
  useShareAppMessage(() => {
    return {
      title,
      path,
      imageUrl,
    };
  });

  // 分享到朋友圈
  useShareTimeline(() => {
    return {
      title,
      path,
      imageUrl,
    };
  });
};