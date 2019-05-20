# FileCard

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
    infoType: 'infoType', // 信息类型
    name: 'name', // 名称
    expiredType: 'expiredType', // 过期类型
    expireDate: 'expireDate', // 到期日期
    expiredDays: 'expiredDays', // 过期天数
  };
```

## 示例

```jsx
  <FileCard
    className={styles.card}
    style={{ fontSize: 14 }}
    data={{
      infoType: '信息类型', // 信息类型
      name: 'name', // 名称
      expiredType: '过期类型', // 过期类型
      expireDate: 1557890508978, // 到期日期
      expiredDays: 2, // 过期天数
    }}
    fieldNames={{
      infoType: 'infoType', // 信息类型
      name: 'name', // 名称
      expiredType: 'expiredType', // 过期类型
      expireDate: 'expireDate', // 到期日期
      expiredDays: 'expiredDays', // 过期天数
    }}
  />
```
