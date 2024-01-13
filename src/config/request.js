// axios全局配置
const axiosConfig = {
    baseURL: "http://localhost:8080/api/v1", // 请求的基础URL
    timeout: 120000, //请求超时时间,
    withCredentials: true // 解决服务器设置token到cookies中，浏览器Application的cookies中没有存入token
}

export default axiosConfig