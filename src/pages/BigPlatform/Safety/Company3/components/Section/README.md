# Section

## 属性

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器样式 | object | - |
| titleStyle | 标题样式 | object | - |
| contentClassName | 内容类名 | string | - |
| contentStyle | 内容样式 | object | - |
| title | 标题栏 | ReactNode | - |
| action | 显示在右上角的内容 | ReactNode | - |
| extra | 额外的内容，可以用来设置定位元素 | ReactNode | - |
| fixedContent | 内容区域的固定元素 | ReactNode | - |
| scrollProps | 滚动条相关设置属性，请查看Scroll组件 | object | - |
| onClick | 添加在容器上的点击事件 | function | - |
| refScroll | 对Scroll组件的引用 | function | - |

## 示例

```jsx
  <Section
    className={styles.container}
    style={{ fontSize: 14 }}
    titleStyle={{ fontSize: 16 }}
    contentClassName={styles.content}
    contentStyle={{ fontSize: 14 }}
    title="标题"
    action={<span>前往首页</span>}
    extra={<span>重点企业</span>}
    fixedContent={<span>分数：1</span>}
    scrollProps={{ className: styles.scroll }}
    onClick={this.handleClick}
    refScroll={(scroll) => { this.scroll = scroll; }}
    spinProps={{ loading: true, wrapperClassName: styles.spin }}
  >
    子组件
  </Section>
```
