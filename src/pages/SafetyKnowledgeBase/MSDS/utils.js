import { Fragment } from 'react';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Cascader, DatePicker, Input, Radio, Select, TreeSelect } from 'antd';

import CompanySelect from '@/jingan-components/CompanySelect';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const { Group: RadioGroup } = Radio;
const { RangePicker } = DatePicker;

export const LIST_URL = '/safety-knowledge-base/msds/list';
// 只能在最后面加，顺序不可以变化，不然和后台对应的类型就全部乱了
// export const RISK_CATEGORIES = [
//   '爆炸物',
//   '易燃气体',
//   '气溶胶',
//   '氧化性气体',
//   '加压气体',
//   '易燃液体',
//   '易燃固体',
//   '自反应物质和混合物',
//   '自燃液体',
//   '自燃固体',
//   '自热物质和混合物',
//   '遇水放出易燃气体的物质和混合物',
//   '氧化性液体',
//   '氧化性固体',
//   '有机过氧化物',
//   '金属腐蚀物',
//   '急性毒性物质',
//   '腐蚀刺激性物质',
//   '其他危害物质',
// ];
export const RISK_CATEGORIES = [
  { title: '第1类：爆炸品', value: '1', children: [
    { title: '1.1项：有整体爆炸危险的物质和物品', value: '1.1' },
    { title: '1.2项：有迸射危险，但无整体爆炸危险的物质和物品', value: '1.2' },
    { title: '1.3项：有燃烧危险并有局部爆炸危险或局部迸射危险或两种危险都有，但无整体爆炸危险的物质和物品', value: '1.3' },
    { title: '1.4项：不呈现重大危险的物质和物品', value: '1.4' },
    { title: '1.5项：有整体爆炸危险的非常不敏感物质', value: '1.5' },
    { title: '1.6项：无整体爆炸危险的极端不敏感物品', value: '1.6' },
  ] },
  { title: '第2类：气体', value: '2', children: [
    { title: '2.1项：易燃气体', value: '2.1' },
    { title: '2.2项：非易燃无毒气体', value: '2.2' },
    { title: '2.3项：毒性气体', value: '2.3' },
  ] },
  { title: '第3类：易燃液体', value: '3' },
  { title: '第4类：易燃固体、易于自然的物质、遇水放出易燃气体的物质', value: '4', children: [
    { title: '4.1项：易燃固体、自反应物质和固态退敏爆炸品', value: '4.1' },
    { title: '4.2项：易于自然的物质', value: '4.2' },
    { title: '4.3项：遇水放出易燃气体的物质', value: '4.3' },
  ] },
  { title: '第5类：氧化物性质和有机过氧化物', value: '5', children: [
    { title: '5.1项：氧化物性质', value: '5.1' },
    { title: '5.2项：有机过氧化物', value: '5.2' },
  ] },
  { title: '第6类：毒性物质和感染性物质', value: '6', children: [
    { title: '6.1项：毒性物质', value: '6.1' },
    { title: '6.2项：感染性物质', value: '6.2' },
  ] },
  { title: '第7类：放射性物质', value: '7' },
  { title: '第8类：腐蚀性物质', value: '8' },
  { title: '第9类：杂项危险物质和物品，包括危害环境物质', value: '9' },
];
export function getRiskCategoryLabel(v, list) {
  if (!v || !Array.isArray(list)) return;

  for (let { title, value, children } of list) {
    if (value === v)
      return title;
    if (Array.isArray(children)) {
      const label = getRiskCategoryLabel(v, children);
      if (label !== undefined) return label;
    }
  }
}
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

export const FORMITEM_LAYOUT_EXTRA = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

// export const FORMITEM_LAYOUT1 = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 18 },
// };

function getOptions(options, props = ['key', 'value']) {
  if (!Array.isArray(options) || !options.length) return [];
  const type = typeof options[0];
  if (type !== 'object') return options.map((v, i) => ({ [props[0]]: i, [props[1]]: v }));
  return options;
}

function genFormItem(field, getFieldDecorator) {
  let {
    type = 'input',
    name,
    label,
    disabled = false,
    placeholder,
    onSelectChange,
    required = true,
    options,
    formItemOptions,
    component: compt,
    formExtraStyle,
    wrapperClassName,
    onChange,
    otherRule,
    icLabel,
    snLabel,
    treeData,
  } = field;

  let child = null;

  if (type === 'component') child = compt; // 不经过getFieldDecorator包裹
  else {
    const formOptions = formItemOptions || {};
    const opts = getOptions(options);
    const whiteSpaceRule = { whitespace: true, message: `${label}不能全为空字符串` };
    const otherLabel = icLabel || snLabel || label;
    let component = null;
    const rules = [];
    switch (type) {
      case 'compt': // getFieldDecorator包裹的
        component = compt;
        break;
      case 'text':
        placeholder = placeholder || `请输入${label}`;
        rules.push(whiteSpaceRule);
        component = <TextArea placeholder={placeholder} disabled={disabled} autoSize />;
        break;
      case 'select':
        placeholder = placeholder || `请选择${label}`;
        component = (
          <Select placeholder={placeholder} disabled={disabled} onChange={onChange} allowClear>
            {opts.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        );
        break;
      case 'treeSelect':
        placeholder = placeholder || `请选择${label}`;
        component = (
          <TreeSelect
            allowClear
            treeDefaultExpandAll
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            treeData={treeData}
          />
        );
        break;
      case 'radio':
        component = (
          <RadioGroup disabled={disabled} options={getOptions(options, ['value', 'label'])} />
        );
        break;
      case 'datepicker':
        component = <DatePicker disabled={disabled} allowClear />;
        break;
      case 'rangepicker':
        component = <RangePicker disabled={disabled} allowClear />;
        break;
      case 'cascader':
        placeholder = placeholder || `请选择${label}`;
        component = (
          <Cascader placeholder={placeholder} disabled={disabled} options={options} allowClear />
        );
        break;
      case 'companyselect':
        placeholder = placeholder || `请选择${label}`;
        component = <CompanySelect disabled={disabled} onChange={onSelectChange} />;
        break;
      default:
        placeholder = placeholder || `请输入${label}`;
        rules.push(otherRule || whiteSpaceRule);
        component = <Input placeholder={placeholder} disabled={disabled} allowClear />;
    }

    rules.unshift({ required, message: `${otherRule ? otherLabel : label}不能为空` });
    formOptions.rules = rules;

    child = getFieldDecorator(name, formOptions)(component);
  }

  let props = {
    label,
    key: name,
    className: wrapperClassName || undefined,
    ...(formExtraStyle ? FORMITEM_LAYOUT_EXTRA : FORMITEM_LAYOUT),
  };

  return <FormItem {...props}>{child}</FormItem>;
}

function renderSection(section, index, getFieldDecorator) {
  const { title, fields } = section;

  return (
    <Fragment key={title || index}>
      {title && (
        <FormItem>
          <p style={{ margin: 0, textAlign: 'center', fontSize: 16 }}>{title}</p>
        </FormItem>
      )}
      {fields.map(field => genFormItem(field, getFieldDecorator))}
    </Fragment>
  );
}

function getSections(sections) {
  if (!Array.isArray(sections) || !sections.length) return [];

  const first = sections[0];
  if (!first.fields) return [{ fields: sections }];
  return sections;
}

export function renderSections(
  sections,
  getFieldDecorator,
  handleSubmit,
  listUrl,
  fileLoading = false,
  loading = false
) {
  const secs = getSections(sections);
  const props = {};

  const submitBtn = handleSubmit ? (
    <FormItem wrapperCol={{ span: 24, offset: 10 }}>
      <Button onClick={e => router.push(listUrl)} style={{ marginRight: 20 }}>
        取消
      </Button>
      <Button type="primary" htmlType="submit" loading={fileLoading || loading}>
        提交
      </Button>
    </FormItem>
  ) : null;

  if (handleSubmit) props.onSubmit = handleSubmit;
  return (
    <Form {...props}>
      {secs.map((section, index) => renderSection(section, index, getFieldDecorator))}
      {submitBtn}
    </Form>
  );
}

export function convertSections(secs, detail) {
  return secs.map(({ title, fields }) => ({
    title,
    fields: fields.map(({ name, options, treeData, ...restProps }) => {
      const value = detail[name];
      const showValue = value === null || value === undefined || value === '' ? '-' : value;
      const field = {
        ...restProps,
        name,
        options,
        treeData,
        type: 'component',
        component: treeData ? getRiskCategoryLabel(value, treeData) : options ? findValueInOptions(value, options) : showValue,
      };
      console.log(value, treeData, getRiskCategoryLabel(value, treeData));
      // if (Array.isArray(options)) field.options = options;
      return field;
    }),
  }));
}

function findValueInOptions(value, options) {
  // 暂时只有一种，字符串数组，以后有其他的在添加
  return options[value];
}

export function getFieldLabels(sections) {
  return sections.reduce((prev, next) => {
    next.fields.forEach(({ name, label }) => (prev[name] = label));
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
      riskCateg: getRiskCategoryLabel(riskCateg, RISK_CATEGORIES),
    };
  });
}

export function deleteEmptyProps(obj) {
  Object.entries(obj).forEach(([k, v]) => {
    if (v === '') obj[k] = undefined;
  });
  return obj;
}
