import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Icon } from 'antd';
import debounce from 'lodash/debounce';
import Ellipsis from '../../../../components/Ellipsis';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const detailBorder = `${iconPrefix}detail_border.png`
const descriptionBlueIcon = `${iconPrefix}description_blue.png`;
const descriptionRedIcon = `${iconPrefix}description_red.png`;
const ycqIcon = `${iconPrefix}ycq.png`;
const wcqIcon = `${iconPrefix}wcq.png`;
const dfcIcon = `${iconPrefix}dfc.png`;

// const statuses = ['未超期', '待复查', '已超期'];
// 字段名
const defaultFieldNames = {
  id: 'id',
  description: 'description',
  sbr: 'sbr',
  sbsj: 'sbsj',
  zgr: 'zgr',
  zgsj: 'zgsj',
  fcr: 'fcr',
  status: 'status',
  background: 'background',
};
// 获取图章
const getSeal = (status) => {
  switch (status) {
    case 1:
      return dfcIcon;
    case 2:
      return ycqIcon;
    default:
      return wcqIcon;
  }
};

export default class App extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fieldNames: PropTypes.object,
  }

  static defaultProps = {
    fieldNames: {},
  }

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
          pageSize: Math.max(Math.floor(this.container.offsetHeight / 250), 1),
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
  }

  handleMouseLeave = () => {
    const { onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave();
    }
  }

  render() {
    const {
      className,
      style,
      data,
      fieldNames,
    } = this.props;
    const { currentIndex, pageSize } = this.state;
    const { id, description, sbr, sbsj, zgr, zgsj, fcr, status, background } = { ...defaultFieldNames, ...fieldNames };
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
        <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px', border: '10px solid transparent', borderWidth: '10px 5px', borderImage: `url(${detailBorder}) 10`, backgroundColor: 'rgba(9, 103, 211, 0.06)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px 0 12px',
            }}
          >
            <div style={{ display: 'inline-block', flex: 1, height: '2px', backgroundColor: '#00A8FF', verticalAlign: 'middle' }} />
            <div style={{ display: 'inline-block', height: '24px', lineHeight: '24px', padding: '0 20px', color: '#fff', borderLeft: '8px solid #00A8FF', borderRight: '8px solid #00A8FF', fontSize: '16px', verticalAlign: 'middle' }}>隐患详情 ({data.length})</div>
            <div style={{ display: 'inline-block', flex: 1, height: '2px', backgroundColor: '#00A8FF', verticalAlign: 'middle' }} />
          </div>
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }} ref={(container) => { this.container = container; }}>
            {data.length !== 0 ? data.map((ele, index) => {
              if (index % pageSize === 0) {
                const top = (index < currentFirstIndex && '-110%') || (index > currentFirstIndex && '110%') || 0;
                return (
                  <div style={{ position: 'absolute', top, left: 0, width: '100%', height: '100%', transition: currentFirstIndex === index?'top 0.55s, bottom 0.55s':'top 0.5s, bottom 0.5s' }} key={ele[id]}>
                    {data.slice(index, index+pageSize).map(item => (
                      <div key={item[id]} style={{ position: 'relative', marginBottom: '12px', boxShadow: '3px 3px 3px #000', background: `rgba(1, 21, 57, 0.9) url(${getSeal(item[status])}) no-repeat right bottom / 120px` }}>
                        <div style={{ display: 'flex', padding: '12px 0' }}><Avatar style={{ margin: '0 10px' }} src={item[status] === 2 ? descriptionRedIcon : descriptionBlueIcon} size="small" /><Ellipsis lines={1} style={{ flex: 1, color: item[status] === 2 ? '#ff4848' : '#fff', fontSize: '16px', lineHeight: '24px' }} >{item[description] || '暂无信息'}</Ellipsis></div>
                        <div style={{ display: 'flex', padding: '0 0 10px 6px' }}>
                          <div style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '135px', height: '180px', backgroundColor: '#021C42', overflow: 'hidden'  }}>
                            <div style={{ position: 'relative', width: '100%' }}>
                              <img src={item[background]} alt="" style={{ display: 'block', width: '100%' }} />
                              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 168, 255, 0.3)' }} />
                            </div>
                          </div>
                          <div style={{ flex: 1  }}>
                            <div style={{ display: 'flex', padding: '5px 0 5px 18px', alignItems: 'center', justifyContent: 'center', fontSize: '16px', lineHeight: '24px' }}><span style={{ color: '#00A8FF' }}>上报：</span><Ellipsis lines={1} style={{ flex: 1, color: '#fff' }} ><span style={{ marginRight: '20px' }}>{item[sbr]}</span>{item[sbsj]}</Ellipsis></div>
                            <div style={{ display: 'flex', padding: '5px 0 5px 18px', alignItems: 'center', justifyContent: 'center', fontSize: '16px', lineHeight: '24px' }}><span style={{ color: '#00A8FF' }}>整改：</span><Ellipsis lines={1} style={{ flex: 1, color: '#fff', lineHeight: 1 }} ><span style={{ marginRight: '20px' }}>{item[zgr]}</span>{item[zgsj]}</Ellipsis></div>
                            {item[status] === 1 && <div style={{ display: 'flex', padding: '5px 0 5px 18px', alignItems: 'center', justifyContent: 'center', fontSize: '16px', lineHeight: '24px' }}><span style={{ color: '#00A8FF' }}>复查：</span><Ellipsis lines={1} style={{ flex: 1, color: '#fff' }} ><span style={{ marginRight: '20px' }}>{item[fcr]}</span></Ellipsis></div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }) : <div style={{ textAlign: 'center', color: '#fff' }}>暂无隐患</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', height: 36 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon type="caret-up" style={{ fontSize: 18, color: isFirst?'#022D5B':'#0967D3', cursor: isFirst?'not-allowed':'pointer' }} onClick={() => { !isFirst && this.handlePrevPage();}} /></div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon type="caret-down" style={{ fontSize: 18, color: isLast?'#022D5B':'#0967D3', cursor: isLast?'not-allowed':'pointer' }} onClick={() => { !isLast && this.handleNextPage();}} /></div>
          </div>
        </div>
      </div>
    );
  };
}
