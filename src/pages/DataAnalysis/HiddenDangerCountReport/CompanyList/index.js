import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  List,
  Card,
  Input,
  Spin,
  // TreeSelect,
} from 'antd';
import router from 'umi/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import { Link } from 'dva/router';
import ToolBar from '@/components/ToolBar';
import CustomTreeSelect from '@/components/CustomTreeSelect';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { mapMutations, getMappedFields } from '@/utils/utils';
import styles from './index.less';

// 默认页面显示数量
const DEFAULT_PAGE_SIZE = 18;
// 默认字段名称
const FIELDNAMES = {
  name: 'name',
  gridId: 'gridId',
};
// 网格字段
const GRID_FIELD_NAMES = {
  key: 'grid_id',
  value: 'grid_name',
};
// 获取无数据
const EmptyData = () => <span className={styles.emptyData}>暂无数据</span>;

@connect(({ hiddenDangerCountReport, user, loading }) => ({
  hiddenDangerCountReport,
  user,
  loading: loading.models.hiddenDangerCountReport,
}))
export default class CompanyList extends PureComponent {
  constructor(props) {
    super(props);
    const {
      user: { currentUser: { unitType } = {} },
    } = props;
    if (unitType === 4) {
      this.goToDetail();
    }
    mapMutations(this, {
      namespace: 'hiddenDangerCountReport',
      types: ['fetchCompanyList', 'fetchGridDict'],
    });
  }

  componentDidMount() {
    this.fetchGridDict();
    this.getCompanyList();
  }

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  getValues() {
    const values = this.form.getFieldsValue();
    const fields = getMappedFields(values, FIELDNAMES);
    return fields;
  }

  getCompanyList = params => {
    const values = this.getValues();
    this.fetchCompanyList({
      pageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...values,
      ...params,
    });
  };

  goToDetail = data => {
    if (data) {
      sessionStorage.setItem('HIDDEN_DANGER_COUNT_REPORT', JSON.stringify(data));
    }
    // router.push('/data-analysis/hidden-danger-count-report/detail');
  };

  handleSearch = () => {
    this.getCompanyList();
  };

  handleReset = () => {
    this.getCompanyList();
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      hiddenDangerCountReport: { companyList: { pagination: { pageNum = 1 } = {} } = {} },
    } = this.props;
    this.getCompanyList({
      pageNum: pageNum + 1,
    });
  };

  handleCardClick = ({ id, name }) => {
    this.goToDetail({ id, name });
  };

  renderForm() {
    const {
      hiddenDangerCountReport: { gridDict = [] },
      user: { currentUser: { unitType } = {} },
    } = this.props;
    const fields = [
      {
        id: 'name',
        label: '单位名称',
        render: () => <Input placeholder="请输入" />,
      },
    ];
    if (unitType !== 1) {
      // 维保不显示网格
      fields.unshift({
        id: 'gridId',
        label: '所属网格',
        render: () => <CustomTreeSelect data={gridDict} fieldNames={GRID_FIELD_NAMES} />,
      });
    }
    return (
      <Card bordered={false} className={styles.card}>
        <ToolBar
          wrappedComponentRef={this.setFormReference}
          fields={fields}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      hiddenDangerCountReport: { companyList: { list = [] } = {} },
    } = this.props;
    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          // loading={loading}
          grid={{ gutter: 24, xl: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              name,
              practicalAddress,
              industryCategoryLabel,
              safetyName,
              safetyPhone,
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
            } = item;
            const practicalAddressLabel = [
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
              practicalAddress,
            ]
              .filter(v => v)
              .join('');
            return (
              <List.Item key={id}>
                <Link
                  to={'/data-analysis/hidden-danger-count-report/detail'}
                  onClick={() => this.handleCardClick(item)}
                  target="_blank"
                >
                  <Card
                    title={name}
                    className={styles.cardItem}
                    // onClick={() => this.handleCardClick(item)}
                    hoverable
                  >
                    <div>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        地址：
                        {practicalAddressLabel || <EmptyData />}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        行业类别：
                        {industryCategoryLabel || <EmptyData />}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        负责人：
                        {safetyName || <EmptyData />}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        联系电话：
                        {safetyPhone || <EmptyData />}
                      </Ellipsis>
                    </div>
                  </Card>
                </Link>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      hiddenDangerCountReport: {
        companyList: {
          pagination: { pageNum = 1, pageSize = DEFAULT_PAGE_SIZE, total = 0 } = {},
        } = {},
      },
      loading,
    } = this.props;
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '数据分析', name: '数据分析' },
      { title: '隐患统计报表', name: '隐患统计报表' },
    ];

    return (
      <PageHeaderLayout
        title="单位列表"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
            {total}
          </div>
        }
      >
        {this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={total > pageNum * pageSize}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          {this.renderList()}
        </InfiniteScroll>
      </PageHeaderLayout>
    );
  }
}
