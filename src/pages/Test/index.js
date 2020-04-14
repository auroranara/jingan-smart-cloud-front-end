import React, { Component, useEffect, useState } from 'react';
import Form from '@/jingan-components/Form';

const list = [{ key: '1', value: '是' }, { key: '0', value: '否' }];
const A = () => {
  useEffect(() => {
    console.log('A');
  }, []);
  return <div>123</div>;
};
const B = ({ children }) => {
  const [key, setKey] = useState(1);
  useEffect(() => {
    console.log('B');
    setTimeout(() => {
      setKey(2);
    }, 2000);
  }, []);
  return <div key={key}>{children}</div>;
};

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
        <B>
          <A />
        </B>
      </div>
    );
  }
}
