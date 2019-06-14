# HiddenDangerCard

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
    status: 'status', // 隐患状态
    type: 'type', // 隐患类型
    description: 'description', // 隐患描述
    images: ['src'], // 图片地址
    name: 'name', // 点位名称
    source: 'source', // 来源
    reportPerson: 'reportPerson', // 上报人
    reportTime: 'reportTime', // 上报时间
    planRectificationPerson: 'planRectificationPerson', // 计划整改人
    planRectificationTime: 'planRectificationTime', // 计划整改时间
    actualRectificationPerson: 'actualRectificationPerson', // 实际整改人
    actualRectificationTime: 'actualRectificationTime', // 实际整改时间
    designatedReviewPerson: 'designatedReviewPerson', // 指定复查人
    reviewTime: 'reviewTime', // 复查时间
  };
```

## 示例

```jsx
  <HiddenDangerCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      status: 7, // 隐患状态
      type: 1, // 隐患类型
      description: '设备年久失修', // 隐患描述
      images: ['http://data.jingan-china.cn/hello/gsafe/hidden_danger/190426-153557-q96x.png'], // 图片地址
      name: 'name', // 点位名称
      source: 1, // 来源
      reportPerson: '张三', // 上报人
      reportTime: 1557387345788, // 上报时间
      planRectificationPerson: '张三', // 计划整改人
      planRectificationTime: 1557387345788, // 计划整改时间
      actualRectificationPerson: '张三', // 实际整改人
      actualRectificationTime: 1557387345788, // 实际整改时间
      designatedReviewPerson: '张三', // 指定复查人
      reviewTime: 'reviewTime', // 复查时间
    }}
    fieldNames={{
      status: 'status', // 隐患状态
      type: 'type', // 隐患类型
      description: 'description', // 隐患描述
      images: 'images', // 图片地址
      name: 'name', // 点位名称
      source: 'source', // 来源
      reportPerson: 'reportPerson', // 上报人
      reportTime: 'reportTime', // 上报时间
      planRectificationPerson: 'planRectificationPerson', // 计划整改人
      planRectificationTime: 'planRectificationTime', // 计划整改时间
      actualRectificationPerson: 'actualRectificationPerson', // 实际整改人
      actualRectificationTime: 'actualRectificationTime', // 实际整改时间
      designatedReviewPerson: 'designatedReviewPerson', // 指定复查人
      reviewTime: 'reviewTime', // 复查时间
    }}
  />
```
