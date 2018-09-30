/* 验证联系方式 */
const phoneReg = /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/g;

/* 验证邮箱 */
const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

/* 验证用户名（不能纯数字） */
const loginNameReg = /^.*[^\d].*$/;

/* 验证keyId和deviceId */
const numReg = /^([0-9]+[_]+[a-z]+[0-9]*)|([a-z]+[_]+[a-z0-9]+)$/;

export { phoneReg, emailReg, loginNameReg, numReg };
