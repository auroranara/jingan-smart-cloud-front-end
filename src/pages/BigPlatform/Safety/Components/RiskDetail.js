import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import debounce from 'lodash/debounce';
import HiddenDanger from './HiddenDanger';
import noHiddenDanger from '../img/noHiddenDanger.png';

import styles from './RiskDetail.less';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const detailBorder = `${iconPrefix}detail_border.png`

// 获取当前子元素高度
const getCurrentItemHeight = () => {
  const width = window.innerWidth;
  if (width >= 1600) {
    return 226;
  }
  else if( width < 1600 && width >= 1200) {
    return 191;
  }
  else {
    return 164;
  }
};

export default class App extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fieldNames: PropTypes.object,
  };

  static defaultProps = {
    fieldNames: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      // 当前页码
      currentIndex: 0,
      // 页面显示数量
      pageSize: 3,
    }
    this.myTimer = null;
    this.handleResize = debounce(this.handleResize, 300);
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    // 初始化
    this.handleResize();
    // 添加resize事件
    window.addEventListener('resize', this.handleResize, false);
  }

  /**
   * 组件更新
   */
  componentDidUpdate({ data: prevData }) {
    // 如果源数据更新，则重新返回到第一页
    if (prevData !== this.props.data) {
      this.setState({
        currentIndex: 0,
      });
    }
  }

  /**
   * 组件销毁
   */
  componentWillUnmount() {
    // 销毁时移出事件
    window.removeEventListener('resize', this.handleResize);
    clearInterval(this.myTimer);
  }

  /**
   * 根据当前容器高度计算页面显示数量
   */
  handleResize = () => {
    this.myTimer = setInterval(() => {
      if (this.container && this.container.offsetHeight !== 0) {
        clearInterval(this.myTimer);
        this.myTimer = null;
        this.setState({
          pageSize: Math.max(Math.floor(this.container.offsetHeight / getCurrentItemHeight()), 1),
        });
      }
    }, 2);
  }

  /**
   * 上一页
   */
  handlePrevPage = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: currentIndex - 1,
    }));
  }

  /**
   * 下一页
   */
  handleNextPage = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: currentIndex + 1,
    }));
  }

  handleMouseEnter = () => {
    const { onMouseEnter } = this.props;
    if (onMouseEnter) {
      onMouseEnter();
    }
  };

  handleMouseLeave = () => {
    const { onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  render() {
    const {
      className,
      style,
      data,
      fieldNames,
    } = this.props;
    const { currentIndex, pageSize } = this.state;
    // 页数
    const pageCount = Math.max(Math.ceil(data.length / pageSize), 1);
    // 是否为第一页
    const isFirst = currentIndex === 0;
    // 是否为最后一页
    const isLast = currentIndex === pageCount - 1;
    // 当前页的第一个元素
    const currentFirstIndex = currentIndex * pageSize;

    return (
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 1.8em #000',
          ...style,
        }}
      >
        <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} className={styles.riskDetailWrapper} style={{ borderImage: `url(${detailBorder}) 10` }}>
          <div className={styles.riskDetailTitleWrapper}>
            <div className={styles.riskDetailTitleBorder} />
            <div className={styles.riskDetailTitle}>隐患详情 ({data.length})</div>
            <div className={styles.riskDetailTitleBorder} />
          </div>
          <div className={styles.riskDetailListContainer} ref={(container) => { this.container = container; }}>
            {data.length !== 0 ? data.map((ele, index) => {
              if (index % pageSize === 0) {
                const top = (index < currentFirstIndex && '-110%') || (index > currentFirstIndex && '110%') || 0;
                return (
                  <div className={styles.riskDetailList} style={{ top, transition: currentFirstIndex === index?'top 0.55s, bottom 0.55s':'top 0.5s, bottom 0.5s' }} key={ele.id}>
                    {data.slice(index, index+pageSize).map(item => {
                      const { id } = item;
                      return (
                        <HiddenDanger key={id} data={item} fieldNames={fieldNames} />
                      );
                    })}
                  </div>
                );
              }
              return null;
            }) : <div className={styles.noHiddenDanger} style={{ backgroundImage: `url(${noHiddenDanger})` }}></div>}
          </div>
          {pageCount > 1 && (
            <div style={{ flex: 'none', lineHeight: '1' }}>
              <div style={{ textAlign: 'center' }}><Icon type="caret-up" style={{ color: isFirst?'#022D5B':'#0967D3', cursor: isFirst?'not-allowed':'pointer' }} onClick={() => { !isFirst && this.handlePrevPage();}} /></div>
              <div style={{ textAlign: 'center' }}><Icon type="caret-down" style={{ color: isLast?'#022D5B':'#0967D3', cursor: isLast?'not-allowed':'pointer' }} onClick={() => { !isLast && this.handleNextPage();}} /></div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
