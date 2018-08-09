import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import Ellipsis from '../../../../components/Ellipsis';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const detailBorder = `${iconPrefix}detailBorder.png`
const descriptionBlueIcon = `${iconPrefix}description_blue.png`;
const descriptionRedIcon = `${iconPrefix}description_red.png`;
const sbrIcon = `${iconPrefix}sbr.png`;
const sbsjIcon = `${iconPrefix}sbsj.png`;
const zgrIcon = `${iconPrefix}zgr.png`;
const zgsjIcon = `${iconPrefix}zgsj.png`;
const fcrIcon = `${iconPrefix}fcr.png`;
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

  state = {
    currentIndex: 0,
  }

  timer = null

  addInterVal() {
    this.timer = setInterval(() => {
      if (-Number.parseFloat(this.list.style.top, 10) >= this.list.children[0].offsetHeight) {
        this.setState(({ currentIndex }) => ({
          currentIndex: currentIndex === this.list.children.length - 1 ? 0 : currentIndex + 1,
        }));
        this.list.style.top = '0px';
      }
      else {
        this.list.style.top = `${Number.parseFloat(this.list.style.top, 10) - 1}px`;
      }
    }, 25);
  }

  componentDidMount() {
    if (this.list.offsetHeight > this.container.offsetHeight) {
      this.addInterVal();
    }
  }

  componentDidUpdate() {
    clearInterval(this.timer);
    this.list.style.top = '0px';
    if (this.list.offsetHeight > this.container.offsetHeight) {
      this.addInterVal();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleMouseEnter = () => {
    const { onMouseEnter } = this.props;
    clearInterval(this.timer);
    if (onMouseEnter) {
      onMouseEnter();
    }
  }

  handleMouseLeave = () => {
    const { onMouseLeave } = this.props;
    if (this.list.offsetHeight > this.container.offsetHeight) {
      this.addInterVal();
    }
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
    const { currentIndex } = this.state;

    const { id, description, sbr, sbsj, zgr, zgsj, fcr, status, background } = { ...defaultFieldNames, ...fieldNames };


    return (
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
      >
        <div
          style={{
            display: 'flex',
            marginBottom: '10px',
            padding: '0 20px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'inline-block', flex: 1, height: '2px', backgroundColor: '#00A8FF', verticalAlign: 'middle' }} />
          <div style={{ display: 'inline-block', padding: '0 20px', color: '#fff', borderLeft: '8px solid #00A8FF', borderRight: '8px solid #00A8FF', fontSize: '16px', verticalAlign: 'middle' }}>隐患详情 ({data.length})</div>
          <div style={{ display: 'inline-block', flex: 1, height: '2px', backgroundColor: '#00A8FF', verticalAlign: 'middle' }} />
        </div>
        <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} style={{ display: 'flex', flex: 1, padding: '24px 16px', boxShadow: '0 0 1.1em rgba(9, 103, 211, 0.9) inset', backgroundColor: 'rgba(9, 103, 211, 0.06)' }}>
          <div style={{ flex: 1, overflow: 'hidden' }} ref={(container) => { this.container = container; }}>
            <div style={{ position: 'relative', top: 0 }} ref={(list) => { this.list = list; }}>
              {data.length !== 0 ? [...data.slice(currentIndex), ...data.slice(0, currentIndex)].map(item => {
                return (
                  <div key={item[id]} style={{ paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', backgroundColor: 'rgba(6, 38, 78, 0.8)', maxHeight: '240px', overflow: 'hidden' }}>
                      <div style={{ position: 'relative', display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(6, 38, 78, 0.55)' }} />
                        <img src={item[background]} alt="隐患图" style={{ display: 'inline-block', width: '100%', height: 'auto' }} />
                      </div>
                      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <img src={getSeal(item[status])} alt="未过期" style={{ display: 'inline-block', width: '80px', height: '80px' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', padding: '4px 8px' }}><Avatar style={{ marginRight: '8px' }} src={item[status] === 2 ? descriptionRedIcon : descriptionBlueIcon} size="small" /><Ellipsis lines={1} style={{ flex: 1, color: item[status] === 2 ? '#ff4848' : '#00A8FF', lineHeight: '24px' }} >{item[description] || '暂无信息'}</Ellipsis></div>
                    <div style={{ display: 'flex', padding: '4px 8px' }}><Avatar style={{ marginRight: '8px' }} src={sbrIcon} size="small" /><span style={{ display: 'flex', color: '#00A8FF', alignItems: 'center', justifyContent: 'flex-start' }}>上报人</span><span style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end', color: '#fff' }}>{item[sbr]}</span></div>
                    <div style={{ display: 'flex', padding: '4px 8px' }}><Avatar style={{ marginRight: '8px' }} src={sbsjIcon} size="small" /><span style={{ display: 'flex', color: '#00A8FF', alignItems: 'center', justifyContent: 'flex-start' }}>上报时间</span><span style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end', color: '#fff' }}>{item[sbsj]}</span></div>
                    <div style={{ display: 'flex', padding: '4px 8px' }}><Avatar style={{ marginRight: '8px' }} src={zgrIcon} size="small" /><span style={{ display: 'flex', color: '#00A8FF', alignItems: 'center', justifyContent: 'flex-start' }}>整改人</span><span style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end', color: '#fff' }}>{item[zgr]}</span></div>
                    <div style={{ display: 'flex', padding: '4px 8px' }}><Avatar style={{ marginRight: '8px' }} src={zgsjIcon} size="small" /><span style={{ display: 'flex', color: '#00A8FF', alignItems: 'center', justifyContent: 'flex-start' }}>整改时间</span><span style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end', color: item[status] === 2 ? '#ff4848' : '#fff' }}>{item[zgsj]}</span></div>
                    {item[status] === 1 && <div style={{ display: 'flex', padding: '4px 8px' }}><Avatar style={{ marginRight: '8px' }} src={fcrIcon} size="small" /><span style={{ display: 'flex', color: '#00A8FF', alignItems: 'center', justifyContent: 'flex-start' }}>复查人</span><span style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end', color: '#fff' }}>{item[fcr]}</span></div>}
                  </div>
                );
              }) : <div style={{ textAlign: 'center', color: '#fff' }}>暂无隐患</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };
}
