interface DDCommonParams {
  success?: Function;
  fail?: Function;
  complete?: Function;
  onSuccess?: Function;
  onFail?: Function;
  onComplete?: Function;
}

declare var dd: {
  corpId: string;
  datePicker: (params: {
    format: "yyyy-MM-dd" | "HH:mm" | "yyyy-MM-dd HH:mm" | "yyyy-MM"
    currentDate?: string
  } & DDCommonParams) => {},
  getSystemInfoSync: () => {
    app: string
    brand: string
    model: string
    system: string
    storage: string
    version: string
    language: string
    platform: string
    pixelRatio: number
    orientation: number
    screenWidth: number
    windowWidth: number
    lowPowerMode: boolean
    screenHeight: number
    windowHeight: number
    currentBattery: string
    titleBarHeight: number
    fontSizeSetting: number
    isIphoneXSeries: boolean
    statusBarHeight: number
  };
};