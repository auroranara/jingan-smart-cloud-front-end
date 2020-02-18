import React, { Component } from 'react';
import { Input, Button, Card, Modal } from 'antd';
import ListPage from '@/templates/ListPage';
import Ellipsis from '@/components/Ellipsis';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import EmptyData from '@/jingan-components/EmptyData';
import Link from 'umi/link';
import router from 'umi/router';
import classNames from 'classnames';
import styles from './index.less';

const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'companyList',
  getList: 'getCompanyList',
};

export default class Company extends Component {
  state = {
    visible: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  setFormReference = form => {
    this.form = form;
  };

  getContent = ({ list: { pagination: { total, a } = {} } = {} }) => {
    const { name } = this.props;
    return (
      <div className={styles.content}>
        <span>
          单位总数：
          {total || 0}
        </span>
        {name && (
          <span>
            {name}
            总数：
            {a || 0}
          </span>
        )}
      </div>
    );
  };

  getFields = () => [
    {
      id: 'name',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入所属单位" maxLength={50} onPressEnter={onSearch} />
      ),
    },
  ];

  getAction = ({ renderAddButton }) => {
    const { name, addEnable = true } = this.props;
    return (
      name &&
      addEnable &&
      renderAddButton({ name: `新增单位${name}`, onClick: this.handleAddButtonClick })
    );
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
        const {
          route: { path },
        } = this.props;
        const { company } = values;
        router.push(path.replace(/:unitId.*/, `${company.key}/add`));
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

  handleLinkClick = () => {
    window.scrollTo(0, 0);
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
    const {
      name: menuName,
      route: { path },
    } = this.props;
    const address = [
      practicalProvinceLabel,
      practicalCityLabel,
      practicalDistrictLabel,
      practicalTownLabel,
      practicalAddress,
    ]
      .filter(v => v)
      .join('');
    const to = path.replace(/:unitId\?/, id);
    return (
      <Card
        className={menuName && styles.card}
        title={
          <Ellipsis className={styles.ellipsis} lines={1} tooltip>
            {name}
          </Ellipsis>
        }
        hoverable
        onClick={
          menuName
            ? undefined
            : () => {
                router.push(to);
                window.scrollTo(0, 0);
              }
        }
      >
        <div className={classNames(styles.cardContent, menuName && styles.hasCount)}>
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
          {menuName && (
            <Link
              className={styles.cardCountWrapper}
              to={to}
              onClick={this.handleLinkClick} /*  target="_blank" */
            >
              <Button className={styles.cardCount} shape="circle">
                {0}
              </Button>
            </Link>
          )}
        </div>
      </Card>
    );
  };

  render() {
    const { route, location, match, breadcrumbList } = this.props;
    const { visible } = this.state;
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
    const props = {
      route,
      location,
      match,
      breadcrumbList,
    };

    return (
      <ListPage
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        renderItem={this.renderItem}
        mapper={MAPPER}
        {...props}
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
      </ListPage>
    );
  }
}
