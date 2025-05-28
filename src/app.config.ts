export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/result/index',
    'pages/disposable-income/index',
    'pages/realTimeEarnings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '薪资计算器',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1296db',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '税后工资',
        iconPath: 'assets/icons/calculator.png',
        selectedIconPath: 'assets/icons/calculator-active.png'
      },
      {
        pagePath: 'pages/disposable-income/index',
        text: '记账',
        iconPath: 'assets/icons/income.png',
        selectedIconPath: 'assets/icons/income-active.png'
      },
      {
        pagePath: 'pages/realTimeEarnings/index',
        text: '实时工资',
        iconPath: 'assets/icons/realtime.png',
        selectedIconPath: 'assets/icons/realtime-active.png'
      }
    ]
  }
})
