import React, { Fragment, PureComponent } from 'react';
import { Row, Col, Input, Form } from 'antd';
import DrawerContainer from '../DrawerContainer';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import ChartGauge from '../../components/ChartGauge';
import styles from './index.less';
import cameraIcon from '../../images/camera.png';

const Search = Input.Search;
const FormItem = Form.Item;
@Form.create()
export default class WaterDrawer extends PureComponent {
  state = {
    videoVisible: false,
    videoKeyId: '',
    videoList: [],
    filterName: '',
  };

  handleClickCamera = videoList => {
    // const { cameraList } = this.props;
    this.setState({
      videoVisible: true,
      videoList,
      videoKeyId: videoList.length ? videoList[0].key_id : '',
    });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: '' });
  };

  renderItems = () => {
    const {
      dataSet: {
        valName = '数据',
        newLine = true,
        dataList = [],
        useGauge = false,
        abnormalImg,
        normalImg,
        lostImg,
      },
    } = this.props;
    const { filterName } = this.state;
    const list = filterName
      ? dataList.filter(item => item && item.name.includes(filterName))
      : dataList;
    return (
      <div className={styles.devScroll}>
        <Row gutter={16}>
          {list.length ? (
            list.map(item => {
              if (!item) return null;
              const {
                name,
                value,
                unit,
                normalRange,
                range,
                location,
                status,
                id,
                isLost,
                videoList,
              } = item;
              let valColor;
              if (!!isLost) valColor = '#bbbbbc';
              else if (+status !== 0) valColor = '#f83329';
              else valColor = '#fff';
              const rangeStr =
                (!normalRange[0] && normalRange[0] !== 0) ||
                (!normalRange[1] && normalRange[1] !== 0)
                  ? '暂无'
                  : `${normalRange[0]}~${normalRange[1]}${unit}`;
              return (
                <Col span={12} key={id}>
                  <div
                    className={styles.deviceWrapper}
                    style={{
                      color: !!isLost ? '#bbbbbc' : '#fff',
                      borderColor: +status !== 0 ? '#ff4848' : '#04fdff',
                    }}
                  >
                    {+status !== 0 && <div className={styles.status}>异常</div>}
                    <div
                      className={styles.deviceImg}
                      style={{ width: useGauge ? '120px' : '80px' }}
                    >
                      {useGauge ? (
                        <ChartGauge
                          showName={false}
                          showValue={false}
                          name={name}
                          value={value}
                          status={+status}
                          range={range}
                          isLost={isLost}
                          normalRange={normalRange}
                          style={{ width: '110px', height: '110px' }}
                          unit={unit}
                        />
                      ) : (
                        <img
                          src={!!isLost ? lostImg : +status === 0 ? normalImg : abnormalImg}
                          alt=""
                        />
                      )}
                    </div>
                    <div className={styles.infoWrapper}>
                      <div>
                        <div className={styles.name}>{name}</div>
                        <div className={styles.position}>{`位置：${location}`}</div>
                        <Row gutter={8}>
                          <Col span={newLine ? 24 : 12}>
                            {`当前${valName}：`}
                            <span style={{ color: valColor }}>{`${
                              !value && value !== 0 ? '---' : value + unit
                            }`}</span>
                          </Col>
                          <Col span={newLine ? 24 : 12}>{`参考范围：${rangeStr}`}</Col>
                        </Row>
                      </div>

                      <div className={styles.extraWrapper}>
                        {!!videoList.length && (
                          <div
                            className={styles.camraImg}
                            style={{ backgroundImage: `url(${cameraIcon})` }}
                            onClick={e => this.handleClickCamera(videoList)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })
          ) : (
            <div
              style={{
                width: '100%',
                height: '135px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#4f678d',
              }}
            >
              暂无相关监测数据
            </div>
          )}
        </Row>
      </div>
    );
  };

  handleReset = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ filterName: '' });
    setFieldsValue({ searchPoint: '' });
  };

  render() {
    const {
      visible,
      dataSet: { subTitle, abnormal, normal, abnormalImg, normalImg, dataList },
      onClose,
      form: { getFieldDecorator, getFieldValue },
      title,
    } = this.props;
    const { videoVisible, videoKeyId, filterName, videoList } = this.state;

    const left = (
      <Fragment>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>
              <span className={styles.rectIcon} />
              {subTitle}
              统计数据
            </h3>
            <div className={styles.section}>
              <div className={styles.statisticsWrapper}>
                <div className={styles.statisticsItem}>
                  <img src={abnormalImg} alt="" />
                  <div className={styles.infoWrapper}>
                    <div className={styles.name}>异常</div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          backgroundColor: '#ff4848',
                          width:
                            normal + abnormal > 0
                              ? (100 * abnormal) / (normal + abnormal) + '%'
                              : 0,
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.value} style={{ color: '#ff4848' }}>
                    {abnormal}
                  </div>
                </div>
                <div className={styles.statisticsItem}>
                  <img src={normalImg} alt="" />
                  <div className={styles.infoWrapper}>
                    <div className={styles.name}>正常</div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          backgroundColor: '#00fbfc',
                          width:
                            normal + abnormal > 0 ? (100 * normal) / (normal + abnormal) + '%' : 0,
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.value} style={{ color: '#00fbfc' }}>
                    {normal}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.chartContainer}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', marginRight: -10 }}
          >
            <h3 className={styles.chartTitle}>
              <span className={styles.rectIcon} />
              实时监测数据
              {dataList.length && (
                <div className={styles.search}>
                  {/* {filterName && (
                    <div className={styles.resetBtn} onClick={this.handleReset}>
                      重置
                    </div>
                  )} */}
                  <Form style={{ position: 'absolute', right: 0 }}>
                    <FormItem>
                      {getFieldDecorator('searchPoint')(
                        <Search
                          placeholder="搜索点位名称"
                          onSearch={value => {
                            this.setState({ filterName: value });
                          }}
                          onChange={() => {
                            getFieldValue('searchPoint');
                            console.log(
                              `getFieldValue('searchPoint')`,
                              getFieldValue('searchPoint')
                            );
                          }}
                          style={{ width: 200 }}
                        />
                      )}
                    </FormItem>
                  </Form>
                </div>
              )}
            </h3>
            <div className={styles.section} style={{ flex: 1, overflow: 'hidden' }}>
              {this.renderItems()}
            </div>
          </div>
          <VideoPlay
            showList={true}
            videoList={videoList}
            visible={videoVisible}
            keyId={videoKeyId}
            handleVideoClose={this.handleVideoClose}
          />
        </div>
      </Fragment>
    );

    return (
      <DrawerContainer
        title={title}
        width={700}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={() => {
          onClose();
          this.handleVideoClose();
          this.handleReset();
        }}
      />
    );
  }
}
