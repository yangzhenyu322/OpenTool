/**
 * @description 复制
 * @param {*} id DOM ID
 */
import { message } from 'ant-design-vue';

// 复制Dom文本
export function copyDomText (id) {
    const node = document.getElementById(id)
    if (node) {
        let createRange = document.createRange()
        createRange.selectNodeContents(document.getElementById(id))
        const selection = document.getSelection()
        selection.removeAllRanges()
        selection.addRange(createRange)
        document.execCommand('Copy')
        selection.removeAllRanges()
        message.success('已复制', 1)
    }
}

// 随机生成字符串
export function generateRandomStr(length){
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) { 
        result += characters.charAt(Math.floor(Math.random() * charactersLength)); 
    } 
    return result
}