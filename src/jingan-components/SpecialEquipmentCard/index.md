# SpecialEquipmentCard

## 参数列表

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器样式 | object | - |
| data | 源数据 | object | - |
| fieldNames | 自定义字段 | object | 见下面 |

## fieldNames默认值

```js
  {
    name: 'name', // 设备名称
    number: 'number', // 出厂编号
    person: 'person', // 负责人
    expiryDate: 'expiryDate', // 有效期至
    status: 'status', // 1为已过期，0为未过期
  };
```

## 示例

```jsx
  <SpecialEquipmentCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      name: 'name', // 设备名称
      number: 'number', // 出厂编号
      person: 'person', // 负责人
      expiryDate: 'expiryDate', // 有效期至
      status: 'status', // 1为已过期，0为未过期
    }}
    fieldNames={{
      name: 'name', // 设备名称
      number: 'number', // 出厂编号
      person: 'person', // 负责人
      expiryDate: 'expiryDate', // 有效期至
      status: 'status', // 1为已过期，0为未过期
    }}
  />
```
