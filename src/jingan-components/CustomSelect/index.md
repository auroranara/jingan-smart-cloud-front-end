# CustomSelect

## 属性

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| data | 源数据 | array | - |
| fieldNames | 源数据字段映射 | object | 见下方 |
| 以及其他select组件支持的属性 |

## fieldNames默认值

```js
  {
    key: 'key',
    value: 'value',
  }
```

## 示例

```jsx
  <CustomSelect
    className={styles.container}
    style={{ fontSize: 14 }}
    data={[{ key: 1, value: 1 },{ key: 2, value: 2 }]}
    fieldNames={{
      key: 'key',
      value: 'value',
    }}
  />
```
