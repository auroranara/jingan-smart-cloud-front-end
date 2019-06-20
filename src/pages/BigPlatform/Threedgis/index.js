import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import Exception from '@/components/Exception';

export default class Threedgis extends PureComponent {
  render() {
    return (
      <Exception
        img=""
        title="网站建设中"
        desc="抱歉，网站正在开发中..."
        style={{ minHeight: 500, height: '80%' }}
        linkElement={Link}
      />
    );
  }
}
