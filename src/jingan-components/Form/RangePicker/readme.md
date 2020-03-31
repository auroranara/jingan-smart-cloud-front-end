# RangePicker

## 属性说明

| 属性名 | 说明 | 类型 | 默认值 |
| :- | :- | :- | :- |
| mode | 当前模式，可选'add'，'edit'，'detail' | string | - |
| value | 受控值 | string | - |
| onChange | value发生变化时的回调 | function(value) | - |
| originalMode | 即antd的DatePicker组件的mode属性 | string | - |
| placeholder | 提示文字 | array | ['开始时间', '结束时间'] |
| format | 日期格式 | string | 'YYYY-MM-DD' |
| allowClear | 是否显示清空按钮 | boolean | false |
| inputReadOnly | 输入框是否只读 | boolean | true |
| separator | 分隔符 | string | '~' |
| ranges | 预设的快捷范围选择，可选'今天'，'最近一周'，'最近一个月'，'最近三个月'，'最近半年'，'最近一年'或者antd原生格式 | array/object | ['今天', '最近一周', '最近一个月'] |
| emtpy | mode为'detail'时起效果，当value为falsy时显示 | ReactNode | <EmptyText /> |
| ellipsis | mode为'detail'时起效果，当value超出容器宽度时是否显示省略号 | boolean/object  | true |
其它同Antd的DatePicker.RangePicker组件

## 示例

```js
import RangePicker from '@/jingan-components/Form/RangePicker';

<RangePicker
  value={this.state.value}
  onChange={value => this.setState({ value })}
  format="YYYY-MM-DD HH:mm:ss"
  showTime
  allowClear
  inputReadOnly={false}
  ranges={['今天', '最近一周', '最近一个月', '最近三个月', '最近半年', '最近一年']}
  emtpy={<Empty />}
  ellipsis={{ lines: 3 }}
/>
```