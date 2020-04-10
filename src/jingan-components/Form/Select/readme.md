# Select

## 属性说明

| 属性名 | 说明 | 类型 | 默认值 |
| :- | :- | :- | :- |
| mode | 当前模式，可选'add'，'edit'，'detail' | string | - |
| value | 受控值 | string | - |
| onChange | value发生变化时的回调 | function(value, data) | - |
| list | 外界传入的源数据 | array | - |
| getList | 外界传入的获取数据的方法 | function | - |
| loading | 外界传入的加载状态 | boolean | false |
| originalMode | 即antd的DatePicker组件的mode属性 | string | - |
| placeholder | 提示文字 | string | '请选择' |
| allowClear | 是否显示清空按钮 | boolean | false |
| showArrow | 是否显示箭头 | boolean | true |
| showSearch | 是否开启搜索功能 | boolean | false |
| labelInValue | 是否转换value格式为对象 | boolean | false |
| filterOption | 是否开启本地筛选，showSearch为true时有效 | boolean | true |
| fieldNames | 字段键值映射对象，如：{ key: 'id', value: 'name' } | object | { key: 'key', value: 'value' } |
| mapper | 源数据及接口映射对象，如：{ namespace: 'common', list: 'unitList', getList: 'getUnitList' } | object | - |
| params | 通过mapper请求接口时传递的额外参数 | object | - |
| empty | mode为'detail'时起效果，当value为falsy时显示 | ReactNode | <EmptyText /> |
| ellipsis | mode为'detail'时起效果，当文本超出容器宽度时是否显示省略号 | boolean/object  | true |
其它同Antd的Select组件

## 备注

* 当开启后台筛选且labelInValue为false时，model方法写法请参考common/getUnitList

## 示例

> 手动传入源数据不开启筛选

  ```js
  import Select from '@/jingan-components/Form/Select';

  <Select
    fieldNames={{ key: 'id', value: 'name' }}
    list={[{ id: '1', name: '123' }]}
  />
  ```

> 手动传入源数据并开启本地筛选

  ```js
  import Select from '@/jingan-components/Form/Select';

  <Select
    fieldNames={{ key: 'id', value: 'name' }}
    list={[{ id: '1', name: '123' }]}
    showSearch
  />
  ```

> 自动请求接口不开启筛选

  ```js
  import Select from '@/jingan-components/Form/Select';

  <Select
    fieldNames={{ key: 'id', value: 'name' }}
    mapper={{ namespace: 'common', list: 'unitList', getList: 'getUnitList' }}
    params={{ companyId: '1' }}
  />
  ```

> 自动请求接口并开启本地筛选

  ```js
  import Select from '@/jingan-components/Form/Select';

  <Select
    fieldNames={{ key: 'id', value: 'name' }}
    mapper={{ namespace: 'common', list: 'unitList', getList: 'getUnitList' }}
    params={{ companyId: '1' }}
    showSearch
  />
  ```

> 自动请求接口并开启后台筛选（后台支持根据key值筛选，慎用）

  ```js
  import Select from '@/jingan-components/Form/Select';

  <Select
    fieldNames={{ key: 'id', value: 'name' }}
    mapper={{ namespace: 'common', list: 'unitList', getList: 'getUnitList' }}
    params={{ companyId: '1' }}
    showSearch
    filterOption={false}
  />
  ```

> 自动请求接口并开启后台筛选（后台不支持根据key值筛选）

  ```js
  import Select from '@/jingan-components/Form/Select';

  <Select
    fieldNames={{ key: 'id', value: 'name' }}
    mapper={{ namespace: 'common', list: 'unitList', getList: 'getUnitList' }}
    params={{ companyId: '1' }}
    showSearch
    filterOption={false}
    labelInValue
  />
  ```

> 多人输入框

  ```js
  import Select from '@/jingan-components/Form/Select';

  <Select
    originalMode="tags"
    notFoundContent={null}
    showArrow={false}
    showSearch
  />
  ```