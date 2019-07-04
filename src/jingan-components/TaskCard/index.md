# TaskCard

## 参数列表

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器样式 | object | - |
| data | 源数据 | object | - |
| fieldNames | 自定义字段 | object | 见下面 |
| onClick | 处理动态按钮点击事件 | () => ... | - |

## fieldNames默认值

```js
  {
    id: 'id', // 主键
    type: 'type', // 类型
    companyName: 'companyName', // 企业名称
    partType: 'partType', // 设施部件类型
    loopNumber: 'loopNumber', // 回路号
    partNumber: 'partNumber', // 故障号
    area: 'area', // 区域
    location: 'location', // 位置
    startTime: 'startTime', // 报警/报修时间
    endTime: 'endTime', // 结束时间
    status: 'status', // 状态
    systemType: 'systemType', // 系统类型
    deviceName: 'deviceName', // 设备名称
    repairPersonName: 'repairPersonName', // 报修人员名称
    repairPersonPhone: 'repairPersonPhone', // 报修人员手机号
    process: 'process', // 处理状态
    repeat: 'repeat', // 重复次数
    firstTime: 'firstTime', // 首次发生时间
    lastTime: 'lastTime', // 最近发生时间
  };
```

## 示例

```jsx
  <TaskCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      id: 'id', // 主键
      type: 'type', // 类型
      companyName: 'companyName', // 企业名称
      partType: 'partType', // 设施部件类型
      loopNumber: 'loopNumber', // 回路号
      partNumber: 'partNumber', // 故障号
      area: 'area', // 区域
      location: 'location', // 位置
      startTime: 'startTime', // 报警/报修时间
      endTime: 'endTime', // 结束时间
      status: 'status', // 状态
      systemType: 'systemType', // 系统类型
      deviceName: 'deviceName', // 设备名称
      repairPersonName: 'repairPersonName', // 报修人员名称
      repairPersonPhone: 'repairPersonPhone', // 报修人员手机号
      process: 'process', // 处理状态
      repeat: 'repeat', // 重复次数
      firstTime: 'firstTime', // 首次发生时间
      lastTime: 'lastTime', // 最近发生时间
    }}
    fieldNames={{
      id: 'id', // 主键
      type: 'type', // 类型
      companyName: 'companyName', // 企业名称
      partType: 'partType', // 设施部件类型
      loopNumber: 'loopNumber', // 回路号
      partNumber: 'partNumber', // 故障号
      area: 'area', // 区域
      location: 'location', // 位置
      startTime: 'startTime', // 报警/报修时间
      endTime: 'endTime', // 结束时间
      status: 'status', // 状态
      systemType: 'systemType', // 系统类型
      deviceName: 'deviceName', // 设备名称
      repairPersonName: 'repairPersonName', // 报修人员名称
      repairPersonPhone: 'repairPersonPhone', // 报修人员手机号
      process: 'process', // 处理状态
      repeat: 'repeat', // 重复次数
      firstTime: 'firstTime', // 首次发生时间
      lastTime: 'lastTime', // 最近发生时间
    }}
  />
```
