import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { isMobile, isIOS, isAndroid } from '@/utils/utils';
import config from '../config';
// 引入样式文件
import styles from './index.less';

/**
 * description: 南消下载页面
 * author: sunkai
 * date: 2019年01月25日
 */
export default function Download({
  location: {
    query: { type: configType },
    search,
  },
}) {
  const { logo, code, layer, ios, android } = global.PROJECT_CONFIG;
  const { projectName } = config[configType] || global.PROJECT_CONFIG;
  // 是否是手机端访问
  const isFromMobile = isMobile();

  return (
    <div className={isFromMobile ? styles.mobileContainer : styles.container}>
      {!isFromMobile && (
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.logo} style={{ backgroundImage: `url(${logo})` }} />
            <div className={styles.title}>{projectName}</div>
          </div>
          {/* <div className={styles.logo} /> */}
          <div className={styles.backButtonWrapper}>
            <Button
              className={styles.backButton}
              type="primary"
              size="large"
              onClick={() => {
                router.push(`/user/login${search}`);
              }}
            >
              返回
            </Button>
          </div>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {isFromMobile && (
            <div className={styles.titleWrapper}>
              <div className={styles.logo} style={{ backgroundImage: `url(${logo})` }} />
              <div className={styles.title}>{projectName}</div>
            </div>
            // <div className={styles.logo} />
          )}
          <div className={styles.layer}>
            <img src={layer} alt="" />
          </div>
          <div className={styles.codeWrapper}>
            <div className={styles.code} style={{ backgroundImage: `url(${code})` }} />
            <div className={styles.codeDescription}>手机扫一扫，快速下载智慧安全APP</div>
          </div>
          {isFromMobile && (
            <div className={styles.buttonWrapper}>
              <div className={styles.downloadButton} onClick={() => {
                if (isIOS() && ios) {
                  window.location.href = ios + Math.random();
                }
                else if (isAndroid() && android) {
                  window.location.href = android + Math.random();
                }
                else {
                  // 这里是做个提示还是什么的
                }
              }}>
                APP下载
              </div>
              <div
                className={styles.loginButton}
                onClick={() => {
                  router.push('/user/login');
                }}
              >
                登录
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
