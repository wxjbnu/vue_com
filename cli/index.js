#! node

'use strict';

require('colors');
var path = require('path');
var fs = require('fs');
var readlineSync = require('readline-sync');

var program = require('commander');
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');

// ==========驼峰和-互相转换==========
var  pascalify = str => {
  var  camelized = str.replace(/-([a-z])/g, c => c[1].toUpperCase())
  return camelized.charAt(0).toUpperCase() + camelized.slice(1)
}
var  kebabcase = string => {
  return string
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/\s+/g, '-')
  .toLowerCase()
}

// ==========判断文件是否存在==========
var  ensureDirectoryExists = filePath => {
  var  dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    // console.log('文件已经存在')
    return true
  }
  ensureDirectoryExists(dirname)
  fs.mkdirSync(dirname)
}
// ==========替换文件变量==========
var  replaceVars = function replaceVars(str, vars) {
  let newstr = str
  Object.keys(vars).forEach(key => {
    var  rx = new RegExp('{{\\s?' + key + '\\s?}}', 'g')
    newstr = newstr.replace(rx, vars[key])
  })
  return newstr
}


// =============生成文件=============
function genFile(npmName) {
  var  componentName = kebabcase(npmName)
  var  componentNamePascal = pascalify(componentName)

  var  vars = {
    npmName,
    componentName,
    componentNamePascal
  }

  var  savePath = path.join(process.cwd(), componentName)

  // 
  // var  savePath = readlineSync.questionPath(
  //   'Enter a location to save the component files: (./' + componentName + ') ',
  //   {
  //     defaultInput: path.join(process.cwd(), componentName),
  //     exists: false,
  //     isDirectory: true,
  //     create: true
  //   }
  // )

  var  newFiles = {
    package: '',
    rollupConfig: '',
    indexjs: '',
    component: '',
  }

  newFiles.package = replaceVars(
    fs.readFileSync(path.join(__dirname, '../templates', 'package.json')).toString(),
    vars
  )
  newFiles.rollupConfig = replaceVars(
    fs
      .readFileSync(
        path.join(__dirname, '../templates', 'build', 'rollup.config.js')
      )
      .toString(),
    vars
  )
  newFiles.indexjs = replaceVars(
    fs
      .readFileSync(path.join(__dirname, '../templates', 'src', 'index.js'))
      .toString(),
    vars
  )
  newFiles.component = replaceVars(
    fs
      .readFileSync(path.join(__dirname, '../templates', 'src', 'component.vue'))
      .toString(),
    vars
  )

  // 输出的文件
  var  paths = {
    package: path.join(savePath, 'package.json'),
    rollupConfig: path.join(savePath, 'build', 'rollup.config.js'),
    indexjs: path.join(savePath, 'src', 'index.js'),
    component: path.join(savePath, 'src', componentNamePascal + '.vue'),
    // testjs: path.join(savePath, 'test', testFileName),
    // storybookConfig: path.join(savePath, '.storybook', 'config.js'),
    // story: path.join(savePath, 'stories', 'index.js')
  }
  Object.keys(paths).forEach(key => {
    ensureDirectoryExists(paths[key])
    fs.writeFileSync(paths[key], newFiles[key])
  })
}



// try{
//   var stat = fs.statSync(path.join(process.cwd(), 'name'))
//   if (stat.isDirectory()) {
//     console.log('文件已经存在'.red)
//     return true
//   } else {
//     console.log('文件不存在'.red)
//   }
// }catch(e){
//   //捕获异常
//   console.log('新建文件'.yellow)
//   genFile('name')
// }

// npm输入
program
  .command('create <name>')
  .alias('c')
  .description('下载模板')
  .action((template, name, options) => {
    // let rootDir = path.join(process.cwd(), name)
    // console.log(path.join(process.cwd(), name))
    try{
      var stat = fs.statSync(path.join(process.cwd(), name))
      if (stat.isDirectory()) {
        console.log('文件已经存在'.red)
        return true
      } else {
        console.log('文件不存在'.red)
      }
    }catch(e){
      //捕获异常
      console.log('新建文件'.yellow)
      console.log('初始化项目...'.green)
      genFile(name)
    }
    // download(template, rootDir, (err) => {
    //     console.log('下载完毕'.green)
    // })
})