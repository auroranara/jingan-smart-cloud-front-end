import { Fragment } from 'react';
import { Form, Input, Select } from 'antd';
const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;

export const LIST_URL = '/safety-knowledge-base/msds/list';
// 只能在最后面加，顺序不可以变化，不然和后台对应的类型就全部乱了
export const RISK_CATEGORIES = [
  '爆炸物',
  '易燃气体',
  '气溶胶',
  '氧化性气体',
  '加压气体',
  '易燃液体',
  '易燃固体',
  '自反应物质和混合物',
  '自燃液体',
  '自燃固体',
  '自热物质和混合物',
  '遇水放出易燃气体的物质和混合物',
  '氧化性液体',
  '液化性固体',
  '有机过氧化物',
  '金属腐蚀物',
  '急性毒性物质',
  '腐蚀刺激性物质',
  '其他危害物质',
];
export const FORMITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

function getOptions(options) {
  if (!Array.isArray(options) || !options.length)
    return []
  const type = typeof options[0];
  if (type !== 'object')
    return options.map((v, i) => ({ key: i, value: v }));
  return options;
}

function genFormItem(field, getFieldDecorator) {
  const { type='input', name, label, required=true, options } = field;
  const typ = options ? 'select' : type;
  const opts = getOptions(options);
  let component = null;
  let placeholder;
  switch(typ) {
    case 'text':
      placeholder = `请输入${label}`;
      component = <TextArea placeholder={placeholder} />;
      break;
    case 'select':
      placeholder = `请选择${label}`;
      component = <Select placeholder={placeholder}>{opts.map(({ key, value }) => <Option key={key}>{value}</Option>)}</Select>;
      break;
    default:
      placeholder = `请输入${label}`;
      component = <Input placeholder={placeholder} />;
  }

  return (
    <FormItem label={label}>
      {getFieldDecorator(name, { rules: [{ required, message: placeholder }] })(component)}
    </FormItem>
  )
}

function renderSection(section, getFieldDecorator) {
  const { title, fields } = section;
  return (
    <Fragment>
      <FormItem><p style={{ margin: 0, textAlign: 'center' }}>{title}</p></FormItem>
      {fields.map(field => genFormItem(field, getFieldDecorator))}
    </Fragment>
  )
}

export function renderSections(sections, getFieldDecorator) {
  return (
    <Form {...FORMITEM_LAYOUT}>
      {sections.map(section => renderSection(section, getFieldDecorator))}
    </Form>
  );
}

export function getFieldLabels(sections) {
  return sections.reduce((prev, next) => {
    next.fields.forEach(({ name, label }) => prev[name] = label);
    return prev;
  }, {});
}

export const INDEXES = ['一', '二'];

export function handleTableData(list = [], indexBase) {
  return list.map((item, index) => {
    const { id, casNo, chineName, chineName2, engName, engName2, riskCateg, bookCode } = item;

    return {
      id,
      index: indexBase + index + 1,
      chineNames: [chineName, chineName2].filter(n => n),
      engName: [engName, engName2].filter(n => n),
      casNo,
      bookCode,
      riskCateg,
    };
  });
}
