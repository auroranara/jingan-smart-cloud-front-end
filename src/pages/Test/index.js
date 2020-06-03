import React, { Component, useEffect, useState } from 'react';
import Form from '@/jingan-components/Form';

export default class Test extends Component {
  state = {
    key: 1,
  };

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     key: 2,
    //   });
    // }, 2000);
  }

  render() {
    const { key } = this.state;

    return (
      <div>
        <Form
          mode="add"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          fields={[
            {
              name: '测试',
              label: '测试',
              component: 'SelectModalSelect',
              props: {
                preset: 'personListByCompany',
                multiple: true,
                title: '选择责任人',
              },
            },
          ]}
        />
      </div>
    );
  }
}
