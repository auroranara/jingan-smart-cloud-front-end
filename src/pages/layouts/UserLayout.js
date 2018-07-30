import React, { Fragment, PureComponent } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Icon } from 'antd';
import GlobalFooter from '../../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../../assets/logo.svg';
import DocumentTitle from 'react-document-title';

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

@connect(
  ({ login }) => ({
    login,
  })
)
export default class UserLayout extends PureComponent {

  componentDidMount() {
    // const { dispatch } = this.props
    // dispatch({
    //   type: 'login/fetchFooterInfo',
    // })
  }

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
    const { children, login: { serviceSupport, servicePhone } } = this.props;

    const copyright = (
      <Fragment>
        <p>Copyright <Icon type="copyright" /> 2018 &nbsp;技术支持：晶安智慧科技有限公司</p>
        {serviceSupport && <p style={{ marginTop: '5px' }}>服务支持：{serviceSupport}</p>}
        {servicePhone && <p style={{ marginTop: '5px' }}>服务电话：{servicePhone}</p>}
      </Fragment>
    );

    return (
      <DocumentTitle title="登录">
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                {/* <Link to="/"> */}
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>晶安智慧云平台</span>
                {/* </Link> */}
              </div>
              <div className={styles.desc} />
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

