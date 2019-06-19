# RealTimeMessage

## 属性

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| 所有CustomSection支持的属性 |
| data | 源数据，必传 | array | - |
| render | 子项渲染函数，必传 | (item) => ReactNode | - |
| length | 收缩时显示个数 | number | 1 |

## 示例

```jsx
  <RealTimeMessage
    data={[{id:1,name:1}]}
    render={({ id, name }) => <div key={id}>{name}</div>}
    length={3}
  />
```
