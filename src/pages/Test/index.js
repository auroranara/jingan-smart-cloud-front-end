import React, { Component } from 'react';
import Form from '@/jingan-components/Form';

const list = [{ key: '1', value: '是' }, { key: '0', value: '否' }];

export default class Test extends Component {
  state = {
    key: 1,
    initialValues: undefined,
  };

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     key: 2,
    //     initialValues: {
    //       username: '123',
    //       unitId: '123456789',
    //       remember: '1',
    //       companyId: ['8vdotq1ct7b6at7a', 'DccBRhlrSiu9gMV7fmvizw'],
    //     },
    //   });
    // }, 2000);
  }

  render() {
    const { key, initialValues } = this.state;

    return (
      <div>
        <Form
          key={key}
          initialValues={initialValues}
          fields={[
            {
              key: 'username',
              label: '用户名',
              component: 'Input',
              props: {
                maxLength: 10,
                allowClear: true,
              },
              enableDefaultRules: true,
            },
            {
              key: 'password',
              label: '密码',
              component: 'Password',
              props: {
                maxLength: 10,
                allowClear: true,
              },
              enableDefaultRules: true,
            },
            {
              key: 'mark',
              label: '备注',
              component: 'TextArea',
              props: {
                maxLength: 100,
                allowClear: true,
              },
              enableDefaultRules: true,
            },
            {
              key: 'remember',
              label: '是否记住密码',
              component: 'Radio',
              props: {
                list,
              },
              enableDefaultRules: true,
            },
            {
              key: 'date',
              label: '日期',
              component: 'DatePicker',
              props: {
                format: 'YYYY-MM-DD HH:mm:ss',
                showTime: true,
                // picker: 'week',
                // originalMode: 'month',
              },
              enableDefaultRules: true,
            },
            {
              key: 'range',
              label: '范围',
              component: 'RangePicker',
              props: {
                format: 'YYYY-MM-DD HH:mm:ss',
                showTime: true,
                ranges: ['最近一周', '最近一个月', '最近一年'],
                // picker: 'week',
                // originalMode: 'month',
                onChange: v => console.log(v),
              },
              enableDefaultRules: true,
            },
            {
              key: 'companyId',
              label: '单位名称',
              component: 'Select',
              props: {
                mapper: { namespace: 'common', list: 'unitList', getList: 'getUnitList' },
                fieldNames: {
                  key: 'id',
                  value: 'name',
                },
                showSearch: true,
                filterOption: false,
                allowClear: true,
                // labelInValue: true,
                originalMode: 'tags',
                onChange: v => console.log(v),
              },
              enableDefaultRules: true,
            },
          ]}
        />
      </div>
    );
  }
}
