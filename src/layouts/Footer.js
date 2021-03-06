import React, { Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Layout } from 'antd';
import GlobalFooter from 'components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={
        [
          // {
          //   key: 'Pro 首页',
          //   title: 'Pro 首页',
          //   href: 'http://pro.ant.design',
          //   blankTarget: true,
          // },
          // {
          //   key: 'github',
          //   title: <Icon type="github" />,
          //   href: 'https://github.com/ant-design/ant-design-pro',
          //   blankTarget: true,
          // },
          // {
          //   key: 'Ant Design',
          //   title: 'Ant Design',
          //   href: 'http://ant.design',
          //   blankTarget: true,
          // },
        ]
      }
      copyright={
        <Fragment>
          Copyright <LegacyIcon type="copyright" /> 2020
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
