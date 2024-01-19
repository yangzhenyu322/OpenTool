// 检测字符串是否全是数字
export function isNumeric(str) {
    return /^\d+$/.test(str);
}