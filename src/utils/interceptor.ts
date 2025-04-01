export {};

/**
 * 弹窗拦截器
 */
uni.addInterceptor("showToast", {
  invoke(args) {
    if (args.icon) {
      // #ifndef MP-ALIPAY
      if (args.icon === "fail") {
        args.icon = "error";
      }
      // #endif
    }
  },
});