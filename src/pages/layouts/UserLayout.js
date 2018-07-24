import React, { Fragment } from 'react';
import { Link } from 'dva/router';
import { Icon } from 'antd';
import GlobalFooter from '../../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../../assets/logo.svg';

const links = [
  /* {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  }, */
];

const copyright = (
  <Fragment>
    <p>Copyright <Icon type="copyright" /> 2018 &nbsp;技术支持：晶安智慧科技有限公司</p>
    <p style={{ marginTop: '5px' }}>服务电话：400-928-5656</p>
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>晶安智慧云平台</span>
              </Link>
            </div>
            <div className={styles.desc} />
          </div>
          {children}
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
