...props 页面组件本身的props
initialize 对detail数据转换成控件需要的格式
transform 对控件值转换成提交的数据格式
error=true 接口错误时是否显示错误提示
editEnable=true 是否显示编辑按钮，可以为函数，参数为detail

示例

```javascript
import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import moment from 'moment';
import { isNumber } from '@/utils/utils';

const TYPE_LIST = [
  { key: '0', value: '安全设施' },
  { key: '1', value: '监控设施' },
  { key: '2', value: '生产装置' },
  { key: '3', value: '特种设备' },
];

export default class OperationRecordOther extends Component {
  initialize = ({
    companyId,
    companyName,
    type,
    time,
    person,
    evaluate,
    otherFiles,
  }) => ({
    company: companyId ? { key: companyId, label: companyName } : undefined,
    type: isNumber(type) ? type : undefined,
    time: time ? moment(time) : undefined,
    person: person || undefined,
    evaluate: evaluate || undefined,
    otherFiles: otherFiles || [],
  })

  transform = ({
    unitId,
    company,
    time,
    ...rest
  }) => ({
    companyId: unitId || company.key,
    time: time && time.format('YYYY-MM-DD'),
    ...rest,
  })

  render() {
    const fields = [
      {
        id: 'company',
        label: '单位名称',
        required: true,
        component: 'CompanySelect',
        hidden: ({ unitId }) => unitId,
      },
      {
        id: 'type',
        label: '设备设施类型',
        required: true,
        component: 'Select',
        props: {
          list: TYPE_LIST,
        },
      },
      {
        id: 'time',
        label: '运维时间',
        required: true,
        component: 'DatePicker',
      },
      {
        id: 'person',
        label: '运维人员',
        required: true,
        component: 'Input',
      },
      {
        id: 'evaluate',
        label: '运维评价',
        required: true,
        component: 'TextArea',
      },
      {
        id: 'otherFiles',
        label: '附件',
        component: 'CustomUpload',
      },
    ];

    return (
      <ThreeInOnePage
        initialize={this.initialize}
        transform={this.transform}
        fields={fields}
        {...this.props}
      />
    );
  }
}
```
