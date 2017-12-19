// let sleep = function sleep(time) {
// 	return new Promise((resolve, reject) => {
// 		setTimeout(function () {
// 			resolve("sleep");
// 		}, time)
// 	})
// };
// let start = async function () {
// 	console.log("start");
// 	let result = await sleep(3000);
// 	console.log(result);
// 	console.log("end");
// };
// start();
// /**
//  * 立刻输出start，等待3s后输出sleep，end
//  * 有了async/awit，我们就不必使用Promise的 .then()等方法，
//  * 也可以直接使用try catch来捕捉错误，而不是使用reject等方法了
//  */
// console.log(Math.floor(Math.random() * 1e8));
// var a = undefined;
// if (a) {
// 	console.log('233');
// }
// a = '124'
// if(a){
// 	console.log('344');
// }
// 101 登录名或密码错误
// 2070 验证码不正确
// http://login.sina.com.cn/cgi/pin.php?r=25211120&s=0&p=gz-e8366846fee072022da19e16ceff8fedd2d6
// &pcid=gz-0a18822163edba8d8c754f13718184743348&door=pxhnk
const querystring = require('querystring');
let a = `location.replace("http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack&retcode=2070&reason=%CA%E4%C8%EB%B5%C4%D1%E9%D6%A4%C2%EB%B2%BB%D5%FD%C8%B7")`;
let b = `location.replace('http://passport.weibo.com/wbsso/login?url=http%3A%2F%2Fweibo.com%2Fajaxlogin.php%3Fframelogin%3D1%26callback%3Dparent.sinaSSOController.feedBackUrlCallBack&ticket=ST-MTc0NTYwMjYyNA==-1486528422-gz-65257E06B36DA93D6921A0123CDC1CA1-1&retcode=0');})`;
let reg = /location\.replace\(("|')(.*)("|')\)/;
let loginUrl = reg.exec(b)[2];
console.log(loginUrl);
let parseLoginUrl = querystring.parse(loginUrl);
console.log(parseLoginUrl);
console.log()