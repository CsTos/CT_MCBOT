const mineflayer = require('mineflayer'); //请使用命令 npm install mineflayer 安装这个依赖库 命令需要在本源码相同目录下执行
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');//请使用命令 npm install mineflayer-pathfinder 安装这个依赖库 命令需要在本源码相同目录下执行
const GoalFollow = goals.GoalFollow //请使用命令 npm install GoalFollow 安装这个依赖库 命令需要在本源码相同目录下执行
const CT_host = '2b2t.xin'//服务器地址
const port_CS = 25565;//服务器端口
const usr_name = '用户名';//BOT的用户名
const pass_CT1 = '密码'; //密码，请勿截图
const CT_ver = '1.20.1';
let cs_df = 0;
const bot = mineflayer.createBot({
    host: CT_host,
    port: port_CS,
    username: usr_name,
    version: CT_ver
});

bot.loadPlugin(pathfinder)

bot.once('end', () => {
    console.log('与服务器断开连接');
    console.log('CN')
    process.exit(0);
});


function followPlayer() {
    const playerCI = bot.players['CsTos']
    if (!playerCI) {
        bot.chat('找不到跟踪对象，无法完成跟踪');
        return;
    }
    const mcData = require('minecraft-data')(bot.version)
    const movement = new Movements(bot, mcData)
    bot.pathfinder.setMovements(movement)

    const playerEntity = playerCI.entity;
    if (!playerEntity) {
        bot.chat('玩家实体不存在，无法完成跟踪');
        return;
    }
    const playerPos = playerEntity.position;
    const botPos = bot.entity.position;
    const distance = playerPos.distanceTo(botPos);

    if (distance > 50) { // 跟踪范围
        bot.chat('玩家距离过远，停止跟踪');
        return;
    }


    const goal = new GoalFollow(playerCI.entity, 1)
    bot.pathfinder.setGoal(goal, true)
}


bot.once('spawn', async () => {
    bot.addChatPattern('any', /\.*/, { deprecate: true });
    //bot.settings.viewDistance = 'normal';
    //bot_srvcommand();
    bot.chat('/l ' + pass_CT1);
    await new Promise((resolve) => setTimeout(() => { resolve() }, 1000))
    bot._client.write('held_item_slot', {
        slotId: 2
    })
    await new Promise((resolve) => setTimeout(() => { resolve() }, 100))
    bot._client.write('use_item', { hand: 0, sequence: 2 })
    
    
});

const prefix = '@1';

bot.on('chat', (username, message) => {

    console.log(username + ' said: ' + message);

    // 判断消息是否等于指定的前缀
    if (message === prefix) {
        return;
    }
    //Stp said: 已将 CsTos_BOT 传送至服务器: 生存

    // 判断消息是否以指定的前缀开头
    if (message.startsWith(prefix)) {
        // 提取前缀后的内容
        const parts = message.substring(prefix.length).trim().split(' ');
        const command = parts[0]; // 命令本身
        const args = parts.slice(1); // 命令参数

        // 判断消息内容是否为 "CsTos"
        if (username === 'CsTos') {
            console.log('检测到指令');

            if (command === 'follow') {
                console.log('开始跟踪')
                bot.chat('开始跟踪玩家:' + username)
                followPlayer();
                return;
            } else if (command === 'stop') {
                console.log('停止跟踪')
                bot.chat('已停止跟踪玩家:' + username)
                bot.pathfinder.stop();
                return;
            } else if (command === 'exit') {
                bot.log('程序退出')
                process.exit(0);
            }
            // 发送提取出的文本内容到聊天中
            bot.chat(args.join(' ')); // 将命令参数连接成一个字符串发送到聊天中
            //bot.chat(message);
        } else {
            // 默认回复
            bot.chat(username + ' 你没有权限命令我');
            console.log('Received unknown command:', command);
        }
    }
});
const fs = require('fs');
bot.on('chat:any', (msg) => {
    console.log(msg)
})
bot.on('kicked', console.log); //监听被服务器踢出信息
bot.on('error', console.log); //监听报错

//suicide 玩家死亡指令
