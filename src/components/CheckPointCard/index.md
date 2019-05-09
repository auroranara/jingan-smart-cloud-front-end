# CheckPointCard

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
    level: 'level', // 风险等级
    name: 'name', // 点位名称
    lastCheckPerson: 'lastCheckPerson', // 上次巡查人员
    lastCheckTime: 'lastCheckTime', // 上次巡查时间
    nextCheckTime: 'nextCheckTime', // 下次巡查时间
    extendedDays: 'extendedDays', // 超期天数
    expiryDays: 'expiryDays', // 距到期天数
    status: 'status', // 检查状态
  };
```

## 示例

```jsx
  <CheckPointCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      riskLevel: 1, // 风险等级
      pointName: '风险点一', // 点位名称
      lastCheckName: '张三', // 上次巡查人员
      lastCheckDate: 1557368848756, // 上次巡查时间
      nextCheckDate: 1557368848756, // 下次巡查时间
      extendedDays: 5, // 超期天数
      expiryDays: 0, // 距到期天数
      status: 4, // 检查状态
    }}
    fieldNames={{
      level: 'riskLevel', // 风险等级
      name: 'pointName', // 点位名称
      lastCheckPerson: 'lastCheckName', // 上次巡查人员
      lastCheckTime: 'lastCheckDate', // 上次巡查时间
      nextCheckTime: 'nextCheckDate', // 下次巡查时间
      extendedDays: 'extendedDays', // 超期天数
      expiryDays: 'expiryDays', // 距到期天数
      status: 'status', // 检查状态
    }}
  />
```
