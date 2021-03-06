import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      prefix: <LegacyIcon type="user" className={styles.prefixIcon} />,
      placeholder: '用户名',
    },
    rules: [
      {
        required: true,
        message: '请输入用户名/手机号!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LegacyIcon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <LegacyIcon type="mobile" className={styles.prefixIcon} />,
      placeholder: '手机号',
    },
    rules: [
      {
        required: true,
        message: '请输入手机号!',
      },
      {
        pattern: /^1\d{10}$/,
        message: '手机号格式错误!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <LegacyIcon type="mail" className={styles.prefixIcon} />,
      placeholder: '验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码!',
      },
    ],
  },
};
