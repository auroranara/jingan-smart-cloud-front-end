/* 验证联系方式 */
const phoneReg = /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/g;

/* 验证邮箱 */
const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

/* 验证用户名（不能纯数字） */
const loginNameReg = /^.*[^\d].*$/;

/* 验证身份证 */
const idReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

/* 验证邮政编码 */
const postcodeReg = /^[0-9]\d{5}(?!\d)$/;

/* 验证keyId和deviceId */
// const numReg = /^(?!_)(?=.*[a-z])(?=.*_)[0-9a-z_]{6,}(?<!_)$/;

export { phoneReg, emailReg, loginNameReg, idReg, postcodeReg };
