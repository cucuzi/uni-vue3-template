## 简介

uni-vue3模板

## 配置

### web

根目录中的配置文件

1. [.env.development](.env.development) 开发环境
2. [.env.staging](.env.staging) 预发布环境
3. [.env.production](.env.production) 生产环境

### 非web

**目前只有钉钉小程序和微信小程序**

1. [package.json](package.json) 环境变量配置
   > "uni-app"->"scripts"->"mp-?-?" 第一个 ? 为平台，第二个 ? 为环境
2. [devtool-path.json](devtool-path.json) 开发工具路径
   > ali [支付宝小程序开发工具](https://opendocs.alipay.com/mini/ide/download)，路径为开发工具的目录。例如："C:
   \Users\username\AppData\Local\Programs\小程序开发者工具"  
   > weixin [微信小程序开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
   ，路径为开发工具目录下的cli.bat。例如："C:\Program Files (x86)\Tencent\微信web开发者工具\cli"

## 开发须知

全局搜索TODO后修改自己的业务逻辑
