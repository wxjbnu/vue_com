require('colors')
const path = require('path')
const fs = require('fs')
const readlineSync = require('readline-sync')

const program = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

// ==========驼峰和-互相转换==========
const pascalify = str => {
  const camelized = str.replace(/-([a-z])/g, c => c[1].toUpperCase())
  return camelized.charAt(0).toUpperCase() + camelized.slice(1)
}
const kebabcase = string => {
  return string
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/\s+/g, '-')
  .toLowerCase()
}

// ==========判断文件是否存在==========
const ensureDirectoryExists = filePath => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    console.log('文件已经存在'.red)
    return true
  }
  ensureDirectoryExists(dirname)
  fs.mkdirSync(dirname)
}
// ==========替换文件变量==========
const replaceVars = function replaceVars(str, vars) {
  let newstr = str
  Object.keys(vars).forEach(key => {
    const rx = new RegExp('{{\\s?' + key + '\\s?}}', 'g')
    newstr = newstr.replace(rx, vars[key])
  })
  return newstr
}


// =============生成文件=============
function genFile(npmName) {
  const componentName = kebabcase(npmName)
  const componentNamePascal = pascalify(componentName)

  const vars = {
    npmName,
    componentName,
    componentNamePascal
  }

  const savePath = path.join(process.cwd(), componentName)

  // 
  // const savePath = readlineSync.questionPath(
  //   'Enter a location to save the component files: (./' + componentName + ') ',
  //   {
  //     defaultInput: path.join(process.cwd(), componentName),
  //     exists: false,
  //     isDirectory: true,
  //     create: true
  //   }
  // )

  const newFiles = {
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
  const paths = {
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
// npm输入
program
  .command('create <name>')
  .alias('c')
  .description('下载模板')
  .action((template, name, options) => {
    // let rootDir = path.join(process.cwd(), name)
    // console.log(path.join(process.cwd(), name))
    
    if (fs.existsSync(path.join(process.cwd(), name))) {
      console.log('文件已经存在'.red)
      return true
    }
    genFile(name)
    console.log('初始化项目...'.green)
    // download(template, rootDir, (err) => {
    //     console.log('下载完毕'.green)
    // })
})