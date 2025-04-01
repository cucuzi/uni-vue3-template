import spawn from "cross-spawn";
import {sep} from "node:path";
import {defineConfig, loadEnv, type UserConfig} from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import minidev from "minidev";
import devtoolPath from "./devtool-path.json";

let isOpenMiniDevtool = false;

// 检查是否填写开发工具路径
switch (process.env.UNI_PLATFORM) {
  case "mp-alipay":
    if (devtoolPath.ali === "") {
      throw new Error("!!!请填写小程序开发工具路径(devtool-path.json -> ali)!!!");
    }
    break;
  case "mp-weixin":
    if (devtoolPath.weixin === "") {
      throw new Error("!!!请填写小程序开发工具路径(devtool-path.json -> weixin)!!!");
    }
    break;
}

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const autoImportOptions: any = {
    imports: [
      "uni-app",
      "vue",
      "pinia",
    ],
    dts: "src/types/auto-imports.d.ts",
  };
  const componentsOptions: any = {
    dts: "src/types/components.d.ts"
  };
  // web端组件做特殊处理
  if (process.env.UNI_UTS_PLATFORM === "web") {
    componentsOptions.dirs = ["src/components", "src/webComponents"];
    autoImportOptions.dirs = ["src/webComponents"];
  }
  const config: UserConfig = {
    define: {},
    base: "/h5",
    plugins: [
      AutoImport(autoImportOptions),
      Components(componentsOptions),
      uni(),
      {
        // 构建完成后执行
        name: "post-build",
        closeBundle() {
          // 判断启动开发工具
          if (!isOpenMiniDevtool) {
            isOpenMiniDevtool = !isOpenMiniDevtool;
            const platform = process.env.UNI_UTS_PLATFORM;
            switch (process.env.UNI_PLATFORM) {
              case "mp-alipay":
                if (platform.startsWith("mp-dingtalk-")) {
                  const mpEnv = platform.replace("mp-dingtalk-", "");
                  // 打开钉钉小程序开发工具
                  minidev.startIde({
                    appPath: devtoolPath.ali,
                    projectType: "dingtalk-biz",
                    project: `dist${sep}${mode === "development" ? "dev" : "build"}${sep}mp-dingtalk${sep}${mpEnv}`,
                    lite: mode === "development",
                  });
                }
                break;
              case "mp-weixin":
                const mpEnv = platform.replace("mp-weixin-", "");
                // 打开微信小程序开发工具
                spawn(devtoolPath.weixin, ["open", "--project", `${__dirname}${sep}dist${sep}${mode === "development" ? "dev" : "build"}${sep}mp-weixin${sep}${mpEnv}`]);
                break;
            }
          }
        },
      }
    ],
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api", "color-functions"],
        },
      }
    }
  };
  if (process.env.UNI_UTS_PLATFORM === "web") {
    // web端全局变量设置
    const env = loadEnv(mode, process.cwd());
    const isLocalDev = /:\d+/.test(env.VITE_APP_SERVICE_HOST);
    let protocol: string;
    if (isLocalDev) {
      protocol = "http://";
      config.define["import.meta.env.VITE_APP_BASE_API"] = JSON.stringify("");
    } else {
      protocol = "https://";
    }
    config.define["import.meta.env.VITE_APP_SERVICE_PROTOCOL"] = JSON.stringify(protocol);
  } else {
    // 非web端全局变量设置
    const customDefine = JSON.parse(process.env.UNI_CUSTOM_DEFINE);
    for (const [key, value] of Object.entries(customDefine)) {
      config.define["import.meta.env." + key] = JSON.stringify(value);
    }
    let value = customDefine.VITE_APP_SERVICE_HOST;
    let isLocalDev = /:\d+/.test(value);
    let protocol: string;
    if (isLocalDev) {
      protocol = "http://";
      config.define["import.meta.env.VITE_APP_BASE_API"] = JSON.stringify("");
    } else {
      protocol = "https://";
    }
    config.define["import.meta.env.VITE_APP_SERVICE_PROTOCOL"] = JSON.stringify(protocol);
    // 设置webview的地址，目前主要是为了鸿蒙系统钉钉小程序去访问h5
    value = customDefine.VITE_APP_WEB_VIEW_HOST;
    if (!value || value === "") {
      value = customDefine.VITE_APP_SERVICE_HOST;
    }
    isLocalDev = /:\d+/.test(value);
    if (isLocalDev) {
      protocol = "http://";
    } else {
      protocol = "https://";
      value += "/h5/";
    }
    config.define["import.meta.env.VITE_APP_WEB_VIEW_HOST"] = JSON.stringify(protocol + value);
  }
  return config;
});
