import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import DescriptionList from 'components/DescriptionList';
import DrawerContainer from '../components/DrawerContainer';
import ImgSlider from '../components/ImgSlider';
import ReactEcharts from 'echarts-for-react';
import styles from './MaintenanceCheckDrawer.less';

const getEmptyData = () => {
  return '暂无数据';
};
const { Description } = DescriptionList;
const statusColor = ['#ff4848', '#ffb650', '#04fdff'];
export default class MaintenanceCheckDrawer extends PureComponent {
  getOption = score => {
    let color;
    if(+score < 60) color = statusColor[0];
    else if(+score >= 60 && +score < 80) color = statusColor[1];
    else color = statusColor[2];
    const option = {
      color: [color, '#00294a'],
      tooltip: {
        show: false,
      },
      title: {
        text: score,
        left: 'center',
        top: 'center',
        textStyle: {
          color: color,
          fontSize: 22,
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['85%', '95%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: false,
              position: 'center',
              textStyle: {
                fontSize: '22',
                color: '#fff',
              },
              formatter: '{d}%',
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: 80,
              name: '已发放',
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.8)',
                shadowBlur: 10,
              },
            },
            {
              value: 100 - 80,
              name: '未发放',
              itemStyle: { opacity: 0.6 },
              label: { show: false },
            },
          ],
        },
      ],
    };
    return option;
  };
  renderContent = () => {
    const {
      model: {
        maintenanceDetail: {
          checkCompanyName = '',
          checkDate = '',
          checkUsers = [],
          items = [],
          evaluate = '',
          opinion = '',
          files = [],
          score = '',
        },
      },
    } = this.props;

    return (
      <div className={styles.main}>
        <div className={styles.scoreChart}>
          <ReactEcharts
            option={this.getOption(+score)}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            className="echarts-for-echarts"
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '16px' }}>综合评分</div>

        <div className={styles.content} style={{ marginTop: '20px' }}>
          <DescriptionList col={1}>
            <Description term="维保单位">{checkCompanyName}</Description>
            <Description term="维保时间">{checkDate}</Description>
            <Description term="维保人员">
              <Row>
                {checkUsers.map(data => {
                  const { userName, phoneNumber } = data;
                  return (
                    <Col span={12}>
                      {userName}
                      <span className={styles.phone}>{phoneNumber}</span>
                    </Col>
                  );
                })}
                <Col span={12} />
              </Row>
            </Description>
          </DescriptionList>
        </div>

        <div className={styles.content}>
          <DescriptionList col={1}>
            <Description term="维保内容">
              {items.map(data => {
                const { content, statusName, status } = data;
                const statusStyle = {
                  color: statusColor[status - 1],
                  borderColor: statusColor[status - 1],
                };
                return (
                  <div className={styles.itemsWrapper}>
                    {content}
                    <span className={styles.statusName} style={{ ...statusStyle }}>
                      {statusName}
                    </span>
                  </div>
                );
              })}
            </Description>
          </DescriptionList>
        </div>

        <div className={styles.content}>
          <DescriptionList col={1}>
            <Description term="综合评价">{evaluate || getEmptyData()}</Description>
            <Description term="整改意见">{opinion || getEmptyData()}</Description>
          </DescriptionList>
          <DescriptionList col={1} layout={'vertical'}>
            <Description term="附件">
              <ImgSlider picture={files.map(data => data.webUrl)} />
            </Description>
          </DescriptionList>
        </div>
      </div>
    );
  };
  render() {
    const { ...restProps } = this.props;

    return (
      <DrawerContainer title="维保巡检" width={535} left={this.renderContent()} {...restProps} />
    );
  }
}
