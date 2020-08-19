const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const toKebabCase = str => str.replace(/[A-Z]/g, word => `-${word.toLowerCase()}`);
let namespace, label, parentNamespace, parentLabel, icon;
rl.question('模块英文名（必填）：', answer => {
  namespace = answer;
  rl.question('模块中文名（必填）：', answer => {
    label = answer;
    rl.question('父模块英文名（必填）：', answer => {
      parentNamespace = answer;
      rl.question('父模块中文名（父模块已存在则不用填）：', answer => {
        parentLabel = answer;
        rl.question('父模块图标（父模块已存在则不用填）：', answer => {
          icon = answer;
          rl.close();
          if (!namespace || !parentNamespace || !label) {
            console.log('必填项未填！');
            return;
          }

          const code = `${parentNamespace}.${namespace}`;
          const listCode = `${code}.list`;
          const detailCode = `${code}.detail`;
          const addCode = `${code}.add`;
          const editCode = `${code}.edit`;
          const deleteCode = `${code}.delete`;
          const parentPath = `/${toKebabCase(parentNamespace)}`;
          const path = `${parentPath}/${toKebabCase(namespace)}`;
          const listPath = `${path}/list`;
          const detailPath = `${path}/detail`;
          const addPath = `${path}/add`;
          const editPath = `${path}/edit`;
          const parentLocale = `menu.${parentNamespace}`;
          const locale = `${parentLocale}.${namespace}`;
          const listLocale = `${locale}.list`;
          const detailLocale = `${locale}.detail`;
          const addLocale = `${locale}.add`;
          const editLocale = `${locale}.edit`;
          const pageDir = `${parentNamespace[0].toUpperCase()}${parentNamespace.slice(
            1
          )}/${namespace[0].toUpperCase()}${namespace.slice(1)}`;

          // 创建model
          fs.readFile('./template/model.js', (err, data) => {
            if (!err) {
              const content = data.toString().replace(/\$namespace/g, namespace);
              fs.writeFile(`../src/models/${namespace}.js`, content, err => {
                if (!err) {
                  console.log(`../src/models/${namespace}.js创建成功！`);
                } else {
                  console.log(`../src/models/${namespace}.js创建失败！`);
                  console.log('错误原因：');
                  console.log(err);
                }
              });
            }
          });

          // 创建service
          fs.copyFile('./template/service.js', `../src/services/${namespace}.js`, err => {
            if (!err) {
              console.log(`../src/services/${namespace}.js创建成功！`);
            } else {
              console.log(`../src/services/${namespace}.js创建失败！`);
              console.log('错误原因：');
              console.log(err);
            }
          });

          // 创建页面
          const from = './template/page';
          const to = `../src/pages/${pageDir}`;
          const cb = (from, to) => {
            fs.mkdir(to, { recursive: true }, err => {
              if (!err) {
                fs.readdir(from, { withFileTypes: true }, (err, files) => {
                  if (!err) {
                    files.forEach(file => {
                      if (file.isFile()) {
                        fs.copyFile(`${from}/${file.name}`, `${to}/${file.name}`, err => {
                          if (!err) {
                            console.log(`${to}/${file.name}创建成功！`);
                          } else {
                            console.log(`${to}/${file.name}创建失败！`);
                            console.log('错误原因：');
                            console.log(err);
                          }
                        });
                      } else if (file.isDirectory()) {
                        cb(`${from}/${file.name}`, `${to}/${file.name}`);
                      }
                    });
                  }
                });
              }
            });
          };
          cb(from, to);

          // 创建config
          fs.readFile('./template/config.js', (err, data) => {
            if (!err) {
              const content = data
                .toString()
                .replace(/\$namespace/g, namespace)
                .replace(/\$detailCode/g, detailCode)
                .replace(/\$addCode/g, addCode)
                .replace(/\$editCode/g, editCode)
                .replace(/\$deleteCode/g, deleteCode)
                .replace(/\$listPath/g, listPath)
                .replace(/\$detailPath/g, detailPath)
                .replace(/\$addPath/g, addPath)
                .replace(/\$editPath/g, editPath)
                .replace(/\$parentLocale/g, parentLocale)
                .replace(/\$listLocale/g, listLocale)
                .replace(/\$detailLocale/g, detailLocale)
                .replace(/\$addLocale/g, addLocale)
                .replace(/\$editLocale/g, editLocale);
              fs.writeFile(`../src/pages/${pageDir}/config.js`, content, err => {
                if (!err) {
                  console.log(`../src/pages/${pageDir}/config.js创建成功！`);
                } else {
                  console.log(`../src/pages/${pageDir}/config.js创建失败！`);
                  console.log('错误原因：');
                  console.log(err);
                }
              });
            }
          });

          // 创建config样式文件
          fs.copyFile('./template/config.less', `../src/pages/${pageDir}/config.less`, err => {
            if (!err) {
              console.log(`../src/pages/${pageDir}/config.less创建成功！`);
            } else {
              console.log(`../src/pages/${pageDir}/config.less创建失败！`);
              console.log('错误原因：');
              console.log(err);
            }
          });

          // 修改locale
          fs.readFile('../src/locales/zh-CN.js', (err, data) => {
            if (!err) {
              const insertContent = `  '${locale}': '${label}管理',
  '${listLocale}': '${label}管理',
  '${detailLocale}': '${label}详情',
  '${addLocale}': '新增${label}',
  '${editLocale}': '编辑${label}',`;
              const list = data.toString().split('\n');
              let insertIndex = list.length,
                hasParentLocale = false;
              for (let i = 0; i < list.length; i++) {
                const arr = list[i].split('.');
                if (arr[1] === parentNamespace) {
                  insertIndex = i + 1;
                  hasParentLocale = true;
                } else if (insertIndex !== list.length) {
                  break;
                } else if (arr[0].includes('app')) {
                  insertIndex = i;
                  break;
                }
              }
              list.splice(
                insertIndex,
                0,
                hasParentLocale
                  ? insertContent
                  : `  '${parentLocale}': '${parentLabel}',
${insertContent}`
              );
              const content = list.join('\n');
              fs.writeFile('../src/locales/zh-CN.js', content, err => {
                if (!err) {
                  console.log('../src/locales/zh-CN.js修改成功');
                } else {
                  console.log('../src/locales/zh-CN.js修改失败');
                  console.log('错误原因：');
                  console.log(err);
                }
              });
            }
          });

          // 修改router
          fs.readFile('../config/router.config.js', (err, data) => {
            if (!err) {
              const list = data.toString().split('\n');
              let count = 0,
                flag = false,
                insertIndex = list.length,
                hasParentRouter = false;
              for (let i = 0; i < list.length; i++) {
                if (list[i].includes('BasicLayout')) {
                  flag = true;
                } else if (flag) {
                  if (list[i].trim().startsWith('/') || list[i].trim().startsWith('*')) {
                    continue;
                  }
                  if (list[i].includes(`'${parentNamespace}'`)) {
                    count = 0;
                    hasParentRouter = true;
                  } else {
                    if (list[i].includes('[')) {
                      count += 1;
                    }
                    if (list[i].includes(']')) {
                      count -= 1;
                      if (count === 0) {
                        insertIndex = i;
                        break;
                      }
                    }
                  }
                }
              }
              const insertContent = `
            // ${label}
            {
              path: '${path}',
              name: '${namespace}',
              code: '${code}',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '${path}',
                  redirect: '${listPath}',
                },
                {
                  path: '${listPath}',
                  name: 'list',
                  code: '${listCode}',
                  component: './${pageDir}/List',
                },
                {
                  path: '${detailPath}/:id',
                  name: 'detail',
                  code: '${detailCode}',
                  component: './${pageDir}/Form',
                },
                {
                  path: '${addPath}',
                  name: 'add',
                  code: '${addCode}',
                  component: './${pageDir}/Form',
                },
                {
                  path: '${editPath}/:id',
                  name: 'edit',
                  code: '${editCode}',
                  component: './${pageDir}/Form',
                },
              ],
            },`;
              list.splice(
                insertIndex,
                0,
                hasParentRouter
                  ? insertContent
                  : `
        // ${parentLabel}
        {
          path: '${parentPath}',
          icon: '${icon}',
          name: '${parentNamespace}',
          code: '${parentNamespace}',
          hideInMenu: false,
          routes: [
${insertContent}
          ],
        },`
              );
              const content = list.join('\n');
              fs.writeFile('../config/router.config.js', content, err => {
                if (!err) {
                  console.log('../config/router.config.js修改成功');
                } else {
                  console.log('../config/router.config.js修改失败');
                  console.log('错误原因：');
                  console.log(err);
                }
              });
            }
          });
        });
      });
    });
  });
});
