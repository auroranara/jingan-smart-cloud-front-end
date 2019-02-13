import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { isMobile } from '@/utils/utils';
// 引入样式文件
import styles from './index.less';

/**
 * description: 利民下载页面
 * author: sunkai
 * date: 2019年01月25日
 */
export default function LiMinDownload(props) {
  // 是否是手机端访问
  const isFromMobile = isMobile();

  return (
    <div className={isFromMobile ? styles.mobileContainer : styles.container}>
      {!isFromMobile && (
        <div className={styles.header}>
          <div className={styles.logo} />
          <div className={styles.backButtonWrapper}>
            <Button
              className={styles.backButton}
              type="primary"
              size="large"
              onClick={() => {
                router.push('/limin/user/login');
              }}
            >
              返回
            </Button>
          </div>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {isFromMobile && <div className={styles.logo} />}
          <div className={styles.layer}>
            <img src="http://data.jingan-china.cn/v2/login/limin/limin_download_layer.png" alt="" />
          </div>
          <div className={styles.codeWrapper}>
            <div className={styles.code} />
            <div className={styles.codeDescription}>手机扫一扫，快速下载智慧安全APP</div>
          </div>
          {isFromMobile && (
            <div className={styles.buttonWrapper}>
              <div className={styles.downloadButton} onClick={() => {}}>
                APP下载
              </div>
              <div
                className={styles.loginButton}
                onClick={() => {
                  router.push('/limin/user/login');
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
