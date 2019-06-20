# CustomDrawer

## 属性

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 类名 | string | -- |
| style | 样式 | object | -- |
| visible | 是否显示抽屉 | boolean | -- |
| title | 抽屉标题 | string | -- |
| onClose | 关闭事件 | () => ... | -- |
| 以及其他drawer组件支持的属性 |
| sectionProps | Section组件相关参数 | object | - |

## 示例

```jsx
  <CustomDrawer
    title={标题}
    visible={this.state.visible}
    onClose={() => this.setState({ visible: false })}
    sectionProps={{
      scrollProps: { ref: (scroll) => this.scroll = scroll && scroll.dom, className: styles.scroll },
    }}
  >
    子组件
  </CustomDrawer>
```
