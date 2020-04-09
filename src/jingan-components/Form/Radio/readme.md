# Radio

## 属性说明

| 属性名 | 说明 | 类型 | 默认值 |
| :- | :- | :- | :- |
| mode | 当前模式，可选'add'，'edit'，'detail' | string | - |
| value | 受控值 | string | - |
| onChange | value发生变化时的回调 | function(value, data) | - |
| list | 外界传入的源数据 | array | - |
| getList | 外界传入的获取数据的方法 | function | - |
| loading | 外界传入的加载状态 | boolean | false |
| buttonStyle | 默认为普通的圆形单选框，可选'outline'，'solid' | string | - |
| fieldNames | 字段键值映射对象，如：{ key: 'id', value: 'name' } | object | { key: 'key', value: 'value' } |
| mapper | 源数据及接口映射对象，如：{ namespace: 'common', list: 'unitList', getList: 'getUnitList' } | object | - |
| params | 通过mapper请求接口时传递的额外参数 | object | - |
| empty | mode为'detail'时起效果，当value为falsy时显示 | ReactNode | <EmptyText /> |
| ellipsis | mode为'detail'时起效果，当文本超出容器宽度时是否显示省略号 | boolean/object  | true |
其它同Antd的Radio.Group组件

## 示例

> 普通

  ```js
  import Radio from '@/jingan-components/Form/Radio';

  <Radio
    value={this.state.value}
    onChange={(value, data) => { this.setState({ value });console.log(data); }}
    buttonStyle="solid"
    fieldNames={{ key: 'id', value: 'name' }}
    mapper={{ namespace: 'common', list: 'unitList', getList: 'getUnitList' }}
    params={{ companyId: '1' }}
    empty={<Empty />}
    ellipsis={{ lines: 3 }}
  />
  ```


> 自动请求接口

  ```js
  import Radio from '@/jingan-components/Form/Radio';

  <Radio
    fieldNames={{ key: 'id', value: 'name' }}
    mapper={{ namespace: 'common', list: 'unitList', getList: 'getUnitList' }}
    params={{ companyId: '1' }}
  />
  ```


> 手动传递源数据

  ```js
  import Radio from '@/jingan-components/Form/Radio';

  <Radio
    fieldNames={{ key: 'id', value: 'name' }}
    list={[{ id: '1', name: '123' }]}
  />
  ```


> 按钮样式

  ```js
  import Radio from '@/jingan-components/Form/Radio';

  <Radio
    buttonStyle="solid"
  />
  ```