# Input

## 属性说明

| 属性名 | 说明 | 类型 | 默认值 |
| :- | :- | :- | :- |
| mode | 当前模式，可选'add'，'edit'，'detail' | string | - |
| value | 受控值 | string | - |
| onChange | value发生变化时的回调 | function(value) | - |
| placeholder | 提示文字 | string | '请输入' |
| maxLength | 可输入的最大长度 | number | 100 |
| allowClear | 是否显示清空按钮 | boolean | false |
| empty | mode为'detail'时起效果，当value为falsy时显示 | ReactNode | <EmptyText /> |
| ellipsis | mode为'detail'时起效果，当value超出容器宽度时是否显示省略号 | boolean/object  | true |
其它同Antd的Input组件

## 示例

```js
import Input from '@/jingan-components/Form/Input';

<Input
  value={this.state.value}
  onChange={value => this.setState({ value })}
  placeholder="请输入用户名"
  maxLength={50}
  allowClear
  empty={<Empty />}
  ellipsis={{ lines: 3 }}
/>
```