
const path = require('path');
const node_ssh = require('node-ssh');
const zipFile = require('compressing')// 压缩zip

let SSH = new node_ssh(); // 生成ssh实例
let mainWindow = null; // 窗口实例,用于向向渲染进程通信

// 部署流程入口
const deploy = async (config, mainWindows) => {
    mainWindow = mainWindows
    await startZip(config);
    await connectSSH(config);
    await uploadZipBySSH(config)
}

//压缩代码
const startZip = async (config) => {
    return new Promise((resolve, reject) => {
        let { distPath } = config;
        let distZipPath = path.resolve(distPath, `../dist.zip`);
        mainWindow.send('deploy', '本地项目开始压缩')
        zipFile.zip.compressDir(distPath, distZipPath).then(res => {
            mainWindow.send('deploy', `本地项目压缩完成:${distZipPath}`)
            resolve()
        }).catch(err => {
            mainWindow.send('deploy', `压缩失败${err}`)
            reject()
        })
    })
}

//连接服务器
const connectSSH = async (config) => {
    return new Promise((resolve, reject) => {
        mainWindow.send('deploy', `正在连接服务器:${config.host}`)
        SSH.connect({
            host: config.host,
            username: config.username,
            password: config.password // 密码登录 方式二
        }).then(res => {
            mainWindow.send('deploy', `连接服务器成功:${config.host}`)
            resolve()
        }).catch(err => {
            mainWindow.send('deploy', `连接服务器失败:${err}`)
            reject()
        })
    })
}

//清空线上目标目录里的旧文件
const clearOldFile = async (config) => {
    mainWindow.send('deploy', `准备清空服务器部署目录${config.webDir}内的文件`)
    const commands = ['ls', 'rm -rf *'];
    await Promise.all(commands.map(async (item) => {
        return await SSH.execCommand(item, { cwd: config.webDir });
    }));
    mainWindow.send('deploy', `清空服务器目录${config.webDir}内的文件完成`)
}

//上传zip文件到服务器
const uploadZipBySSH = async (config) => {
    let distZipPath = path.resolve(config.distPath, `../dist.zip`);
    //线上目标文件清空
    await clearOldFile(config);
    try {
        await SSH.putFiles([{ local: distZipPath, remote: config.webDir + '/dist.zip' }]); //local 本地 ; remote 服务器 ;
        mainWindow.send('deploy', `上传文件到服务器成功:${config.webDir}`)
        await SSH.execCommand('unzip -o dist.zip && rm -f dist.zip', { cwd: config.webDir }); //解压
        mainWindow.send('deploy', `解压上传到服务器的文件成功`)
        await SSH.execCommand(`rm -rf ${config.webDir}/dist.zip`, { cwd: config.webDir }); //解压完删除线上压缩包
        mainWindow.send('deploy', `删除上传到服务器的文件成功`)

        //将解压后的文件夹内的所有文件移动到目标目录
        var dir = path.basename(path.join(config.distPath))
        mainWindow.send('deploy', `将${config.webDir}/${dir}/内解压的文件移动到目录${config.webDir}`)
        await SSH.execCommand(`mv - f ${config.webDir}/${dir}/*  ${config.webDir}`);
        await SSH.execCommand(`rm -rf ${config.webDir}/${dir}`); //移出后删除 dist 文件夹
        mainWindow.send('deploy', `全部完成`)
        SSH.dispose(); //断开连接
    } catch (error) {
        mainWindow.send('deploy', `文件上传到服务器失败:${error}`)
        // process.exit(); //退出流程
    }
}

export default deploy