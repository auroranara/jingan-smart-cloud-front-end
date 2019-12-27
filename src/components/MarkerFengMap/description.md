## 地图定位组件

* 用于在地图上标点，父元素传入form对象完成双向绑定 绑定值格式 { groupId[string], coord[object]{ x, y, z }, areaId[string] }；

* 组件参数

  | 参数 | 描述 | 是否必须 | 默认值 |
  | :-- | :-- | :-- | :-- |
  | id | 双向绑定的id | 是 | —— |
  | form | 父元素form对象 | 是 | —— |
  | companyId | 企业id，用于获取企业对应地图及区域 | 否 | —— |
  | initialData | 用于初始化marker标点及楼层 | 否 | { } |
