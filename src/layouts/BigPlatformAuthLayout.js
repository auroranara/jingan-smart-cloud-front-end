import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import { Spin } from 'antd';

import Exception from '@/components/Exception';
import Authorized from '@/utils/Authorized';
import { formatter, getCodeMap, generateAuthFn } from '@/utils/customAuth';
import styles from '../index.less';
import config from '../../config/config';

const BIG_PLAT_PATH = '/big-platform';
const menuData = config['routes'];
const mData = formatter(menuData.find(({ path }) => path === BIG_PLAT_PATH).routes);
const codeMap = {};
const pathArray = [];
getCodeMap(mData, codeMap, pathArray);

@connect(({ user }) => ({ user }))
export default class BigPlatformAuthLayout extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'user/fetchCurrent' });
  }

  render() {
    const {
      user: {
        currentUser: { permissionCodes: codes },
      },
      location: { pathname },
      children,
    } = this.props;

    const currentUserLoaded = !!codes;
    console.log(codes, codeMap, pathArray);
    const page403 = (
      <Exception
        type="403"
        desc={formatMessage({ id: 'app.exception.description.403' })}
        linkElement={Link}
        backText={formatMessage({ id: 'app.exception.back' })}
      />
    );

    return currentUserLoaded ? (
      <Authorized authority={generateAuthFn(codes, codeMap, pathArray)(pathname)} noMatch={page403}>
        {children}
      </Authorized>
    ) : (
      <Spin size="large" className={styles.globalSpin} />
    );
  }
}
