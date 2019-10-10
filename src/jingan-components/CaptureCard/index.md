# CaptureCard

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
    name: 'name', // 姓名
    location: 'location', // 位置
    time: 'time', // 时间
    similarity: 'similarity', // 相似度
    image: 'image', // 图片
  };
```

## 示例

```jsx
  <CaptureCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      name: 'name', // 姓名
      location: 'location', // 位置
      time: 'time', // 时间
      similarity: 'similarity', // 相似度
      image: 'image', // 图片
    }}
    fieldNames={{
      name: 'name', // 姓名
      location: 'location', // 位置
      time: 'time', // 时间
      similarity: 'similarity', // 相似度
      image: 'image', // 图片
    }}
  />
```
