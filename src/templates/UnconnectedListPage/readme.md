# UnconnectedListPage组件说明

## 参数

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| pageHeaderProps | PageHeader组件参数对象 | object | - |
| formProps | CustomForm组件参数对象 | object | - |
| listProps | InfiniteList组件参数对象 | object | - |

## 示例

```javascript
  <UnconnectedListPage
    pageHeaderProps={{
      breadcrumbList,
      title, // 可不传，自动取breadcrumbList最后一个元素的title值
      content,
    }}
    formProps={{
      fields,
      action,
    }}
    listProps={{
      list,
      loading,
      getList,
      renderItem,
    }}
  />
```
