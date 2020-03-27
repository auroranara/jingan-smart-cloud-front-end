import React, { Component } from 'react';
import Form from '@/jingan-components/Form';

const list = [{ key: '1', value: '是' }, { key: '0', value: '否' }];

export default class Test extends Component {
  state = {
    initialValues: {
      username: '123',
      unitId: '123456789',
      remember: '1',
    },
  };

  render() {
    const { initialValues } = this.state;

    return (
      <div>
        <Form
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
                // picker: 'week',
                // originalMode: 'month',
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
