import React, { Fragment } from 'react';
import { Link } from 'dva/router';
// import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../../assets/logo.svg';

// TODO:remove
// import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';

const links = [
  {
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
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 晶安科技有限公司
  </Fragment>
);
// TODO:remove
// function getLoginPathWithRedirectPath() {
//   const params = getPageQuery();
//   const { redirect } = params;
//   return getQueryPath('/user/login', {
//     redirect,
//   });
// }

class UserLayout extends React.PureComponent {
  // TODO title
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
      // TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Ant Design</span>
              </Link>
            </div>
            <div className={styles.desc} />
          </div>
          {children}
          {/* <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
            </Switch> */}
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
      // </DocumentTitle>
    );
  }
}

export default UserLayout;
