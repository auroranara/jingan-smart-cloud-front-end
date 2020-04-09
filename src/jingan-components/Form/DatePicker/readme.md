# DatePicker

## 属性说明

| 属性名 | 说明 | 类型 | 默认值 |
| :- | :- | :- | :- |
| mode | 当前模式，可选'add'，'edit'，'detail' | string | - |
| value | 受控值 | string | - |
| onChange | value发生变化时的回调 | function(value) | - |
| originalMode | 即antd的DatePicker组件的mode属性 | string | - |
| placeholder | 提示文字 | string | '请选择' |
| format | 日期格式 | string | 'YYYY-MM-DD' |
| allowClear | 是否显示清空按钮 | boolean | false |
| inputReadOnly | 输入框是否只读 | boolean | true |
| empty | mode为'detail'时起效果，当value为falsy时显示 | ReactNode | <EmptyText /> |
| ellipsis | mode为'detail'时起效果，当value超出容器宽度时是否显示省略号 | boolean/object  | true |
其它同Antd的DatePicker组件

## 示例

```js
import DatePicker from '@/jingan-components/Form/DatePicker';

<DatePicker
  value={this.state.value}
  onChange={value => this.setState({ value })}
  format="YYYY-MM-DD HH:mm:ss"
  showTime
  allowClear
  inputReadOnly={false}
  empty={<Empty />}
  ellipsis={{ lines: 3 }}
/>
```