/*
    index.js: webpack入口文件

    1.运行指令
      开发环境：webpack ./src/index.js -o ./build --mode=development(/production)
       webpack 以./src/index.js为入口文件开始打包，打包后输出到./build
       整体打包环境，是开发环境

    2.结论
      1.webpack可以处理js/json，不能处理css/img等资源
      2.生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化
      3.生产环境比开发环境多一个压缩js代码。
 */
import './index.css';
import './index.less';
import './icon-font/iconfont.css';
// import data from './data';

function add(x, y) {
  return x + y;
}
// console.log(data);
console.log(add(1, 2));
