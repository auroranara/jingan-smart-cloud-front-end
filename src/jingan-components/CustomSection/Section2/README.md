# CustomSection2

## 属性

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器样式 | object | - |
| title | 标题栏 | ReactNode | - |
| action | 显示在右上角的内容 | ReactNode | - |
| extra | 额外的内容，可以用来设置定位元素 | ReactNode | - |
| fixedContent | 内容区域的固定元素 | ReactNode | - |
| scrollProps | 滚动条相关设置属性，请查看Scroll组件 | object | - |
| spinProps | spin相关设置属性，请查看Spin组件 | object | - |

## 示例

```jsx
  <CustomSection2
    className={styles.container}
    style={{ fontSize: 14 }}
    title="标题"
    action={<span>前往首页</span>}
    extra={<span>重点企业</span>}
    fixedContent={<span>分数：1</span>}
    scrollProps={{ ref: (scroll) => this.scroll = scroll && scroll.dom, className: styles.scroll }}
    spinProps={{ loading: true, wrapperClassName: styles.spin }}
  >
    子组件
  </CustomSection2>
```
