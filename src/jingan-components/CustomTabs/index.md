# CustomTabs

## 属性

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器样式 | object | - |
| data | 源数据 | array | - |
| fieldNames | 源数据字段映射 | object | 见下方 |
| activeKey | 选中的tab的key | string | - |
| onClick | tab点击事件 | (key) => ... | - |

## fieldNames默认值

```js
  {
    key: 'key',
    value: 'value',
  }
```

## 示例

```jsx
  <CustomTabs
    className={styles.container}
    style={{ fontSize: 14 }}
    data={[{ key: 1, value: 1 },{ key: 2, value: 2 }]}
    activeKey={this.state.activeKey}
    onClick={(activeKey) => this.setState({ activeKey })}
  />
```
