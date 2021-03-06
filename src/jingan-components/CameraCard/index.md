# CameraCard

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
    name: 'name', // 名称
    location: 'location', // 位置
    number: 'number', // 编号
    status: 'status', // 状态
    count: 'count', // 抓拍次数
  };
```

## 示例

```jsx
  <CameraCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      name: 'name', // 名称
      location: 'location', // 位置
      number: 'number', // 编号
      status: 'status', // 状态
      count: 'count', // 抓拍次数
    }}
    fieldNames={{
      name: 'name', // 名称
      location: 'location', // 位置
      number: 'number', // 编号
      status: 'status', // 状态
      count: 'count', // 抓拍次数
    }}
  />
```
