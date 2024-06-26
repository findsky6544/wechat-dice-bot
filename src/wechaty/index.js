import { WechatyBuilder, ScanStatus, log } from 'wechaty'
import inquirer from 'inquirer'
import qrTerminal from 'qrcode-terminal'
import { defaultMessage } from './sendMessage.js'
import dotenv from 'dotenv'
const env = dotenv.config().parsed // 环境参数
import fs from 'fs'

// 扫码
function onScan(qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        // 在控制台显示二维码
        qrTerminal.generate(qrcode, { small: true })
        const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
        console.log('onScan:', qrcodeImageUrl, ScanStatus[status], status)
    } else {
        log.info('onScan: %s(%s)', ScanStatus[status], status)
    }
}

// 登录
function onLogin(user) {
    console.log(`${user} 已登录`)
    const date = new Date()
    console.log(`Current time:${date}`)
}

// 登出
function onLogout(user) {
    console.log(`${user} 已登出`)
}

// 收到好友请求
async function onFriendShip(friendship) {
    try {
        console.log(friendship.contact().name() + ' 请求添加好友')
        if (friendship.type() === 2) {
            await friendship.accept()
        }
    }
    catch (e) {
        console.error(e)
    }
}

/**
 * 消息发送
 * @param msg
 * @param isSharding
 * @returns {Promise<void>}
 */
async function onMessage(msg) {
    try {
        // 默认消息回复
        await defaultMessage(msg, bot)
        // 消息分片
        // await shardingMessage(msg,bot)
    }
    catch (e) {
        console.error(e)
    }
}

async function onRoomInvitation(roomInvitation) {
    try {
        console.log('onRoomInvitation')
        // 接受邀请
        await roomInvitation.accept()
    }
    catch (e) {
        console.error(e)
    }
}

// 初始化机器人
const CHROME_BIN = process.env.CHROME_BIN ? { endpoint: process.env.CHROME_BIN } : {}
export const bot = WechatyBuilder.build({
    name: 'WechatEveryDay',
    puppet: 'wechaty-puppet-wechat4u', // 如果有token，记得更换对应的puppet
    //puppet: 'wechaty-puppet-wechat', // 如果 wechaty-puppet-wechat 存在问题，也可以尝试使用上面的 wechaty-puppet-wechat4u ，记得安装 wechaty-puppet-wechat4u
    puppetOptions: {
        uos: true,
        ...CHROME_BIN,
    },
})

// 扫码
bot.on('scan', onScan)
// 登录
bot.on('login', onLogin)
// 登出
bot.on('logout', onLogout)
// 收到消息
bot.on('message', onMessage)
// 添加好友
bot.on('friendship', onFriendShip)
//加入房间
//bot.on('room-invite', onRoomInvitation)
// 错误
bot.on('error', (e) => {
    console.error('bot error: ', e)
    //console.log(' 程序退出,请重新运行程序')
    //bot.stop()


    //process.exit()
})
// 启动微信机器人
function botStart() {
    bot
        .start()
        .then(() => console.log('Start to log in wechat...'))
        .catch((e) => console.error('botStart error: ', e))
}

function init() {
    try {
        botStart()
    } catch (err) {
        console.log(msg)
    }
}
init()