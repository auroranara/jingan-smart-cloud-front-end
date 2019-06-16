# DeviceCard

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
    monitoringType: 'monitoringType', // 监测类型
    name: 'name', // 传感器名称
    relationId: 'relationId', // 传感器id
    location: 'location', // 区域位置
    statuses: 'statuses', // 状态
    params: 'params', // 参数
    time: 'time', // 报警时间
  };
```

## 示例

```jsx
  <DeviceCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      monitoringType: 'monitoringType', // 监测类型
      name: 'name', // 传感器名称
      relationId: 'relationId', // 传感器id
      location: 'location', // 区域位置
      statuses: 'statuses', // 状态
      params: 'params', // 参数
      time: 'time', // 报警时间
    }}
    fieldNames={{
      monitoringType: 'monitoringType', // 监测类型
      name: 'name', // 传感器名称
      relationId: 'relationId', // 传感器id
      location: 'location', // 区域位置
      statuses: 'statuses', // 状态
      params: 'params', // 参数
      time: 'time', // 报警时间
    }}
  />
```
