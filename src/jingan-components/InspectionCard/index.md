# InspectionCard

## 参数列表

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器样式 | object | - |
| data | 源数据 | object | - |
| fieldNames | 自定义字段 | object | 见下面 |
| onClickImage | 图片点击事件 | (images) => {} |- |

## fieldNames默认值

```js
  {
    date: 'date', // 巡查日期
    person: 'person', // 巡查人
    status: 'status', // 巡查结果 
    result: 'result', // 处理结果
  };
```

## 示例

```jsx
  <InspectionCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      date: 'date', // 巡查日期
      person: 'person', // 巡查人
      status: 'status', // 巡查结果 
      result: 'result', // 处理结果
    }}
    fieldNames={{
      date: 'date', // 巡查日期
      person: 'person', // 巡查人
      status: 'status', // 巡查结果 
      result: 'result', // 处理结果
    }}
  />
```
