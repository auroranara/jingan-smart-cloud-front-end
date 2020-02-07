import React, { Component } from 'react';
import { Input, Button, Card, Modal, message } from 'antd';
import UnconnectedListPage from '@/templates/UnconnectedListPage';
import Ellipsis from '@/components/Ellipsis';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { BREADCRUMB_LIST, URL_PREFIX, EmptyData } from '..';
import styles from '../index.less';
const API = 'licensePlateRecognitionSystem/getCompanyList';
const FIELDS = [
  {
    id: 'name',
    transform: v => v.trim(),
    render: ({ onSearch }) => (
      <Input placeholder="请输入所属单位" maxLength={50} onPressEnter={onSearch} />
    ),
  },
];

@connect(
  ({ licensePlateRecognitionSystem, loading }) => ({
    licensePlateRecognitionSystem,
    loading: loading.effects[API],
  }),
  dispatch => ({
    getCompanyList(payload, callback) {
      dispatch({
        type: API,
        payload,
        callback: (success, data) => {
          if (!success) {
            message.error('获取企业列表失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class Company extends Component {
  state = {
    visible: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.licensePlateRecognitionSystem !== this.props.licensePlateRecognitionSystem ||
      nextProps.loading !== this.props.loading ||
      nextState !== this.state
    );
  }

  setFormReference = form => {
    this.form = form;
  };

  handleAddButtonClick = () => {
    this.setState({
      visible: true,
    });
  };

  handleModalOk = () => {
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { company } = values;
        router.push(`${URL_PREFIX}/${company.key}/add`);
      }
    });
  };

  handleModalCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleModalAfterClose = () => {
    this.form && this.form.resetFields();
  };

  renderItem = ({
    id,
    name,
    practicalProvinceLabel,
    practicalCityLabel,
    practicalDistrictLabel,
    practicalTownLabel,
    practicalAddress,
    safetyName,
    safetyPhone,
  }) => {
    const address = [
      practicalProvinceLabel,
      practicalCityLabel,
      practicalDistrictLabel,
      practicalTownLabel,
      practicalAddress,
    ]
      .filter(v => v)
      .join('');
    return (
      <Card
        className={styles.card}
        title={
          <Ellipsis className={styles.ellipsis} lines={1} tooltip>
            {name}
          </Ellipsis>
        }
        hoverable
      >
        <div className={styles.cardContent}>
          <div className={styles.cardRow}>
            <div>地址：</div>
            <div>
              {address ? (
                <Ellipsis lines={1} tooltip>
                  {address}
                </Ellipsis>
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
          <div className={styles.cardRow}>
            <div>安全负责人：</div>
            <div>
              {safetyName ? (
                <Ellipsis lines={1} tooltip>
                  {safetyName}
                </Ellipsis>
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
          <div className={styles.cardRow}>
            <div>联系电话：</div>
            <div>
              {safetyPhone ? (
                <Ellipsis lines={1} tooltip>
                  {safetyPhone}
                </Ellipsis>
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
          <Link
            className={styles.cardCountWrapper}
            to={`${URL_PREFIX}/${id}/list`} /*  target="_blank" */
          >
            <Button className={styles.cardCount} shape="circle">
              {0}
            </Button>
          </Link>
        </div>
      </Card>
    );
  };

  render() {
    const {
      hasAddAuthority,
      licensePlateRecognitionSystem: { companyList },
      loading,
      getCompanyList,
    } = this.props;
    const { visible } = this.state;
    const breadcrumbList = BREADCRUMB_LIST.concat({ title: '单位车辆信息', name: '单位车辆信息' });
    const fields = [
      {
        id: 'company',
        label: '单位名称',
        span: 24,
        options: {
          rules: [
            {
              required: true,
              type: 'object',
              message: '请选择单位名称',
            },
          ],
        },
        render: () => <CompanySelect />,
      },
    ];

    return (
      <UnconnectedListPage
        pageHeaderProps={{
          breadcrumbList,
          content: (
            <div className={styles.content}>
              <span>
                单位总数：
                {0}
              </span>
              <span>
                车辆总数：
                {0}
              </span>
            </div>
          ),
        }}
        formProps={{
          fields: FIELDS,
          action: (
            <Button type="primary" onClick={this.handleAddButtonClick} disabled={!hasAddAuthority}>
              新增单位车辆
            </Button>
          ),
        }}
        listProps={{
          list: companyList,
          loading,
          getList: getCompanyList,
          renderItem: this.renderItem,
        }}
      >
        <Modal
          title="新增单位"
          visible={visible}
          zIndex={1009}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          afterClose={this.handleModalAfterClose}
        >
          <CustomForm
            fields={fields}
            searchable={false}
            resetable={false}
            ref={this.setFormReference}
          />
        </Modal>
      </UnconnectedListPage>
    );
  }
}
