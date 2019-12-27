## 地图定位组件

* 用于在地图上标点（单点），使用getFieldDecorator包裹，绑定值格式 { groupId[string], coord[object]{ x, y, z }, areaId[string] }；

* 组件参数

  | 参数 | 描述 | 是否必须 | 类型 |默认值 |
  | :-- | :-- | :-- | :-- | :-- |
  | companyId | 企业id，用于获取企业对应地图及区域 | 是 | string | —— |
  | noDataContent | 没有地图显示内容 | 否 | string或ReactNode | 该单位暂无地图 |
  | readonly | 是否只读 | 否 | boolean | false |
