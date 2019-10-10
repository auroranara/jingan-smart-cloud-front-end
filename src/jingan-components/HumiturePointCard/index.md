# HumiturePointCard

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
    name: 'name', // 点位名称
    temperature: 'temperature', // 当前温度
    minTemperature: 'minTemperature', // 最小温度
    maxTemperature: 'maxTemperature', // 最大温度
    humidity: 'humidity', // 当前湿度
    minHumidity: 'minHumidity', // 最小湿度
    maxHumidity: 'maxHumidity', // 最大湿度
    area: 'area', // 所在区域
    location: 'location', // 所在位置
    status: 'status', // 状态
    videoList: 'videoList', // 视频列表
  };
```

## 示例

```jsx
  <HumiturePointCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      name: 'name', // 点位名称
      temperature: 'temperature', // 当前温度
      minTemperature: 'minTemperature', // 最小温度
      maxTemperature: 'maxTemperature', // 最大温度
      humidity: 'humidity', // 当前湿度
      minHumidity: 'minHumidity', // 最小湿度
      maxHumidity: 'maxHumidity', // 最大湿度
      area: 'area', // 所在区域
      location: 'location', // 所在位置
      status: 'status', // 状态
      videoList: 'videoList', // 视频列表
    }}
    fieldNames={{
      name: 'name', // 点位名称
      temperature: 'temperature', // 当前温度
      minTemperature: 'minTemperature', // 最小温度
      maxTemperature: 'maxTemperature', // 最大温度
      humidity: 'humidity', // 当前湿度
      minHumidity: 'minHumidity', // 最小湿度
      maxHumidity: 'maxHumidity', // 最大湿度
      area: 'area', // 所在区域
      location: 'location', // 所在位置
      status: 'status', // 状态
      videoList: 'videoList', // 视频列表
    }}
  />
```
