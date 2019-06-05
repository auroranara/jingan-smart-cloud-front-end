import React, { PureComponent } from 'react';
import { Drawer, Spin } from 'antd';
import CompanyRisk from '../../Components/CompanyRisk';
import HiddenDangerCard from '@/jingan-components/HiddenDangerCard'; // 隐患卡片
// import LoadMoreButton from '../../Company3/components/LoadMoreButton';
import LoadMore from '@/components/LoadMore'; // 加载更多按钮
import Lightbox from 'react-images';
import styles from '../../Government.less';

const FIELDNAMES = {
  status: 'status', // 隐患状态
  type: 'businessType', // 隐患类型
  id: 'id',
  description: 'description', // 隐患描述
  images(item) {
    return [item.background || '']
  },        // 图片地址
  name: 'item_name', // 点位名称
  source: 'report_source',  // 来源
  reportPerson: 'sbr',        // 上报人
  reportTime: 'sbsj',             // 上报时间
  planRectificationPerson: 'zgr',  // 计划整改人
  planRectificationTime: 'plan_zgsj', // 计划整改时间
  actualRectificationPerson: 'zgr', // 实际整改人
  actualRectificationTime: 'real_zgsj', // 实际整改时间
  designatedReviewPerson: 'fcr', // 指定复查人
}

class DangerInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentImage: 0,
      lightBoxVisible: false,
    };
  }

  componentDidMount() { }

  componentWillUnmount() { }

  handleLoadMore = pageNum => {
    const { handleLoadHiddenList } = this.props;
    handleLoadHiddenList(pageNum + 1);
  };

  /**
   * 显示图片详情
   */
  handleShow = (images) => {
    this.setState({ images, currentImage: 0, lightBoxVisible: true });
  }

  /**
  * 切换图片
  */
  handleSwitchImage = currentImage => {
    this.setState({
      currentImage,
    });
  };

  /**
   * 切换上一张图片
   */
  handlePrevImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage - 1,
    }));
  };

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage + 1,
    }));
  };

  /**
 * 关闭图片详情
 */
  handleClose = () => {
    this.setState({
      images: [],
      lightBoxVisible: false,
    });
  };

  render() {
    const {
      visible,
      handleParentChange,
      lastSection,
      hiddenDangerListByDate,
      riskDetailList,
      loading,
    } = this.props;
    const { images, currentImage, lightBoxVisible } = this.state
    let dataList = {
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
    };
    if (lastSection === 'checks') dataList = hiddenDangerListByDate;
    else dataList = riskDetailList;
    const {
      pagination: { total, pageNum, pageSize },
      list,
    } = dataList;
    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ dangerInfo: false });
          }}
          visible={visible}
          style={{ padding: 0 }}
          className={styles.drawer}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          zIndex={1666}
        >
          <div className={styles.main} style={{ padding: 0 }}>
            <div
              className={styles.mainBody}
              style={{ margin: 0, height: '100%', overflow: 'hidden' }}
            >
              <section className={styles.sectionWrapper}>
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    隐患详情
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ dangerInfo: false });
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.scrollContainer} id="hiddenDanger">
                        <Spin spinning={loading} wrapperClassName={styles.spin}>
                          {/* <CompanyRisk hiddenDangerListByDate={list} /> */}
                          {list && list.length ? (
                            list.map(item => (
                              <HiddenDangerCard
                                className={styles.card}
                                key={item.id}
                                data={item}
                                fieldNames={FIELDNAMES}
                                onClickImage={this.handleShow}
                              />
                            ))
                          ) : (
                              <div style={{ textAlign: 'center', color: '#fff' }}>暂无隐患</div>
                            )}
                          {pageNum * pageSize < total && (
                            <div className={styles.loadMoreWrapper}>
                              <LoadMore onClick={() => this.handleLoadMore(pageNum)} />
                            </div>
                          )}
                        </Spin>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Drawer>
        <Lightbox
          images={images.map((src) => ({ src }))}
          isOpen={lightBoxVisible}
          closeButtonTitle="关闭"
          currentImage={currentImage}
          onClickPrev={this.handlePrevImage}
          onClickNext={this.handleNextImage}
          onClose={this.handleClose}
          onClickThumbnail={this.handleSwitchImage}
          showThumbnails
        />
      </div>
    );
  }
}

export default DangerInfo;
