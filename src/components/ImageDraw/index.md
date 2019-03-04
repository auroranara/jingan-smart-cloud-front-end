| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器类名 | object | - |
| url | 背景图片地址 | string | - |
| data | 图形数组 | array | - |
| onUpdate | 用于更新data的回调，当namable为false时，需要为参数对象添加name属性，必传 | function | - |
| limit | 绘制图形的允许数量 | number | Infinity |
| drawable | 是否显示绘制按钮 | boolean | - |
| namable | 是否可以命名 | boolean | - |
| onClick | 图片上的标记的点击事件 | function | - |
| mapProps | 地图参数 | object | - |
| zoomControlProps | 缩放控制器参数 | object | - |
| zoomControl | 是否显示缩放控制器 | boolean | true |
| editControlProps | 绘制控件参数 | object | - |
| filled | 是否按照容器比例拉伸图片 | boolean | - |
| maxBoundsRatio | 最大边界比例 | number | 1 |
| shapes | 可以绘制的图形类型,['polygon', 'rectangle', 'circle', 'marker', 'circlemarker'] | array | ['polygon', 'rectangle', 'circle'] |
| color | 图形颜色 | string | #000 |
| hideBackground | 是否隐藏背景图片 | boolean | - |
| images | 区域图片，格式为[{ id, url, latlngs }] | array | - |
| arrows | 箭头图片，格式为[{ id, url, latlngs }] | array | - |
| reference | 根据哪一个图形定位 | object | - |
| autoZoom | 是否根据图片大小自动设置最佳的zoom等级 | boolean | - |
