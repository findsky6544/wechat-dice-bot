从 [wechat-bot](https://github.com/wangrongding/wechat-bot)项目魔改而来的骰娘机器人，删除了对接AI的代码

## 功能
目前就接收一个指令：

.coc [数字] //coc人物做成


## 安装
1.环境：centOS,其他环境没试过

2.安装nodejs，据说版本要v18.0以上

3.在控制台运行
```
git clone https://github.com/findsky6544/wechat-bot.git
cd wechat-bot
npm install
```

## 运行
```
npm run start
```
第一次应该要扫码

后台运行：
```
nohup npm run start & exit
```

## 自定义
修改/src/wechaty/sendMessage.js，改完后重启即可
