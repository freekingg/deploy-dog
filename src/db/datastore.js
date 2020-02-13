import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { app, remote } from 'electron' // 引入remote模块
const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录
if (process.type !== 'renderer') {
    if (!fs.pathExistsSync(STORE_PATH)) {
        fs.mkdirpSync(STORE_PATH)
    }
}

const adapter = new FileSync(path.join(STORE_PATH, '/data.json')) // 初始化lowdb读写的json文件名以及存储路径
const db = Datastore(adapter) // lowdb接管该文件

if (!db.has('project').value()) {
    db.set('project', []).write()
}

export default db // 暴露出去