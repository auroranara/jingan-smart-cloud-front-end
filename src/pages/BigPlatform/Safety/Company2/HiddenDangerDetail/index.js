import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import debounce from 'lodash/debounce';
import HiddenDanger from '../HiddenDanger';
import noHiddenDanger from '../../img/noHiddenDanger.png';

import styles from './index.less';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const detailBorder = `${iconPrefix}detail_border.png`

// // 获取当前子元素高度
// const getCurrentItemHeight = () => {
//   const width = window.innerWidth;
//   if (width >= 1600) {
//     return 226;
//   }
//   else if( width < 1600 && width >= 1200) {
//     return 191;
//   }
//   else {
//     return 164;
//   }
// };

/**
 * description: 隐患详情
 * author: sunkai
 * date: 2018年12月10日
 */
export default class HiddenDangerDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 当前页码
      currentIndex: 0,
      // 页面显示数量
      pageSize: 3,
      // 数据
      data: [],
    }
    this.myTimer = null;
    this.debouncedHandleResize = debounce(this.handleResize, 300);
  }

  componentDidMount() {
    // 初始化
    this.handleResize();
    // 添加resize事件
    window.addEventListener('resize', this.debouncedHandleResize, false);
  }

  componentDidUpdate({
    model: { hiddenDangerList: oldHiddenDangerList },
    selectedPointIndex: oldSelectedPointIndex,
    points: oldPoints,
    currentHiddenDangerVisible: oldCurrentHiddenDangerVisible }, { data: oldData }) {
    const {
      model: { hiddenDangerList },
      selectedPointIndex,
      points,
      currentHiddenDangerVisible,
    } = this.props;
    // 选中点位时显示当前隐患，点击关闭按钮隐藏当前隐患
    /**
     * s: 1, p: undefined, v: false 显示点位1
     * s: 1, p: undefined, v: true 显示点位1
     * s: undefined, p: 1, v: true 显示点位1
     * s: undefined, p: 1, v: false 显示点位1
     * s: 1, p: undefined, v: false 显示点位1
     */
    // 选中点位时显示当前隐患，点击点位隐藏当前隐患
    /**
     * s: 1, p: undefined, v: false 显示点位1
     * s: 1, p: undefined, v: true 显示点位1
     * s: undefined, p: 1, v: true 显示点位1
     * s: 2, p: undefined, v: false 显示点位2
     */
    // 未选中点位时显示当前隐患，点击关闭按钮隐藏当前隐患
    /**
     * s: 1, p: undefined, v: false 显示点位1
     * s: undefined, p: 1, v: false 显示全部
     * s: undefined, p: 1, v: true 显示全部
     * s: undefined, p: 1, v: true 显示全部
     * s: undefined, p: 1, v: false 显示全部
     * s: 1, p: undefined, v: false 显示点位1
     */
    // 未选中点位时显示当前隐患，点击点位隐藏当前隐患
    /**
     * s: 1, p: undefined, v: false 显示点位1
     * s: undefined, p: 1, v: false 显示全部
     * s: undefined, p: 1, v: true 显示全部
     * s: undefined, p: 1, v: true 显示全部
     * s: 2, p: undefined, v: false 显示点位2
     */
    /* 综上，当true=>false时，和false=>false时需要考虑 */
    if (oldHiddenDangerList !== hiddenDangerList || oldPoints !== points || (!currentHiddenDangerVisible && oldSelectedPointIndex !== selectedPointIndex)) {
      const { ycq = [], wcq = [], dfc = [] } = hiddenDangerList;
      const list = ycq.concat(wcq, dfc);
      // 获取点位id列表
      const pointIds = points.map(({ itemId }) => itemId);
      // 获取当前选中的点位id
      const selectedPointId = pointIds[selectedPointIndex];
      // 筛选数据
      const data = selectedPointId
      ? list.filter(({ item_id }) => item_id === selectedPointId)
      : list.filter(({ item_id }) => pointIds.includes(item_id));
      // 排除第一种情况
      if (oldHiddenDangerList === hiddenDangerList && oldPoints === points && !oldCurrentHiddenDangerVisible) {
        if (oldData.length === data.length && oldData.every((item, index) => item === data[index])) {
          return;
        }
      }
      // 更新数据
      this.setState({ currentIndex: 0, data });
    }
  }

  componentWillUnmount() {
    // 销毁时移出事件
    window.removeEventListener('resize', this.debouncedHandleResize);
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
          pageSize: Math.max(Math.floor(this.container.offsetHeight / 228), 1),
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

  render() {
    const {
      // 模型
      model: {
        hiddenDangerList: { ycq = [], wcq = [], dfc = [] },
      },
      // 当前选中的点位索引
      selectedPointIndex,
      // 之前选中的点位索引
      prevSelectedPointIndex,
      // 当前四色图上的点位列表
      points,
      // 鼠标移入
      onMouseEnter,
      // 鼠标移出
      onMouseLeave,
      // 当前隐患是否显示
      currentHiddenDangerVisible,
    } = this.props;
    const { currentIndex, pageSize, data } = this.state;
    // // 合并隐患详情，并按照已超期，未超期，待复查排序
    // const hiddenDangerList = ycq.concat(wcq, dfc);
    // // 获取点位id列表
    // const pointIds = points.map(({ itemId }) => itemId);
    // // 获取当前选中的点位id
    // const selectedPointId = pointIds[selectedPointIndex];
    // // 获取之前选中的点位id
    // const prevSelectedPointId = pointIds[prevSelectedPointIndex];
    // // 从隐患列表中筛选出当前点位对应的隐患
    // const data = currentHiddenDangerVisible
    // ? prevSelectedPointId
    //   ? hiddenDangerList.filter(({ item_id }) => item_id === prevSelectedPointId)
    //   : hiddenDangerList.filter(({ item_id }) => pointIds.includes(item_id))
    // : selectedPointId
    //   ? hiddenDangerList.filter(({ item_id }) => item_id === selectedPointId)
    //   : hiddenDangerList.filter(({ item_id }) => pointIds.includes(item_id));
    // 页数
    const pageCount = Math.max(Math.ceil(data.length / pageSize), 1);
    // 是否为第一页
    const isFirst = currentIndex === 0;
    // 是否为最后一页
    const isLast = currentIndex === pageCount - 1;
    // 当前页的第一个元素
    const currentFirstIndex = currentIndex * pageSize;

    // 当没有四色图时，默认显示当前隐患，否则显示选中的风险点对应的隐患详情
    return (
      <div
        className={styles.container}
        style={{ borderImage: `url(${detailBorder}) 10` }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* 标题 */}
        <div className={styles.titleWrapper}>
          <div className={styles.titleBorder} />
          <div className={styles.title}>隐患详情 ({data.length})</div>
          <div className={styles.titleBorder} />
        </div>
        {/* 列表 */}
        <div className={styles.contentWrapper} ref={(container) => { this.container = container; }}>
          {data.length !== 0 ? data.map((ele, index) => {
            if (index % pageSize === 0) {
              // 获取top
              const top = (index < currentFirstIndex && '-105%') || (index > currentFirstIndex && '105%') || 0;
              return (
                <div className={styles.list} style={{ top, transition: currentFirstIndex === index?'top 0.55s, bottom 0.55s':'top 0.5s, bottom 0.5s' }} key={ele.id}>
                  {data.slice(index, index+pageSize).map(item => (
                    <HiddenDanger key={item.id} data={item} />
                  ))}
                </div>
              );
            }
            return null;
          }) : <div className={styles.noHiddenDanger} style={{ backgroundImage: `url(${noHiddenDanger})` }} />}
        </div>
        {/* 分页按钮 */}
        {pageCount > 1 && (
          <div style={{ flex: 'none', lineHeight: '1' }}>
            <div style={{ textAlign: 'center' }}><Icon type="caret-up" style={{ color: isFirst?'#022D5B':'#0967D3', cursor: isFirst?'not-allowed':'pointer' }} onClick={() => { !isFirst && this.handlePrevPage();}} /></div>
            <div style={{ textAlign: 'center' }}><Icon type="caret-down" style={{ color: isLast?'#022D5B':'#0967D3', cursor: isLast?'not-allowed':'pointer' }} onClick={() => { !isLast && this.handleNextPage();}} /></div>
          </div>
        )}
      </div>
    );
  }
}
