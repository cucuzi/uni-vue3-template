let baseUrl = `${import.meta.env.VITE_APP_SERVICE_PROTOCOL}${import.meta.env.VITE_APP_SERVICE_HOST}${import.meta.env.VITE_APP_BASE_API}`;

export default {
  baseUrl,
  /**
   *
   * @param {*} url 请求地址
   * @param {*} data 请求参数
   * @param {*} header 请求头
   * @param {*} method 请求方法
   */
  request({
            url = "",
            data,
            header = {},
            method
          }: {
    url: string
    params?: any
    data?: any
    header: any
    method: "GET" | "POST"
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      url = `${baseUrl}${url}`;
      // TODO 处理请求参数
      let options: {
        url: string
        method: "GET" | "POST"
        header: any
        data?: string | (Object & Record<string, any>)
      } = {
        url,
        method,
        header,
        data
      };
      uni.request(options).then((res) => {
        // TODO 请求结果统一处理
        resolve(res);
      }).catch(err => {
        uni.hideLoading();
        uni.showToast({
          title: `请求异常：${err.errMsg}`,
          icon: "fail",
          duration: 3000,
        });
        reject(err);
      });
    });
  },
  post({
         url = "",
         data,
         header = {},
       }: {
    url: string,
    data?: any,
    header?: any,
  }) {
    return this.request({url, data, header, method: "POST"});
  },
  get({
        url = "",
        data,
        header = {},
      }: {
    url: string,
    data?: any,
    header?: any,
  }) {
    return this.request({url, data, header, method: "GET"});
  }
};
