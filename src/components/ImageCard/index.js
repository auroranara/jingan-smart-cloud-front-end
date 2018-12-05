import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import image from '@/assets/processing.png';

export default class ImageCard extends PureComponent {
  static propTypes = {
    isCardClick: PropTypes.bool, // 是否可点击
    onCardClick: PropTypes.func, // 点击触发
    showStatusLogo: PropTypes.bool, // 是否显示状态logo
    showRightIcon: PropTypes.bool, // 是否显示右上角图标
    cardPadding: PropTypes.string, // 外层padding
    contentList: PropTypes.array.isRequired, // 渲染图片右侧区块的列表
    photo: PropTypes.string.isRequired, // 图片地址
  };

  static defaultProps = {
    isCardClick: true,
    showRightIcon: true,
    showStatusLogo: true,
    cardPadding: '15px 20px 10px 20px',
  };

  renderItem = () => {
    const { contentList } = this.props;
    return contentList.map(({ label, value }, index) => (
      <div className={styles.line} key={index}>
        <span className={styles.label}>{label}</span>
        <span className={styles.colon}>：</span>
        <span className={styles.value}>{value}</span>
      </div>
    ));
  };

  render() {
    const {
      isCardClick,
      onCardClick,
      showStatusLogo,
      showRightIcon,
      cardPadding,
      photo,
      extraStyle = false,
    } = this.props;
    return (
      <div
        onClick={isCardClick ? onCardClick : null}
        className={styles.imageCard}
        style={{ padding: cardPadding, cursor: isCardClick ? 'pointer' : 'default' }}
      >
        <div className={styles.contentContainer}>
          <div className={styles.imageContainer}>
            <div
              className={styles.image}
              style={{
                background: `url(${photo})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
              }}
            />
          </div>
          <div className={extraStyle ? styles.extraContent : styles.content}>
            {this.renderItem()}
          </div>
        </div>
        {showStatusLogo && (
          <div
            className={styles.statusLogo}
            style={{
              background: `url(${image})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              right: '2%',
              bottom: '6%',
            }}
          />
        )}
        {showRightIcon && (
          <div
            className={styles.rightIcon}
            style={
              showStatusLogo
                ? {
                    top: '19px',
                    right: '20px',
                  }
                : {
                    top: 'calc(50% - 8px)',
                    right: '20px',
                  }
            }
          />
        )}
      </div>
    );
  }
}
