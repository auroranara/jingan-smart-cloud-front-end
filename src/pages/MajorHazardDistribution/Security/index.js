import React, { Component } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { message, Spin, Card, Row, Col, Radio } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import TextAreaEllipsis from '@/jingan-components/View/TextAreaEllipsis';
import { connect } from 'dva';
import router from 'umi/router';
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMB_LIST_PREFIX, NAMESPACE, SECURITY_LIST_API } from '../config';
import styles from './index.less';

const TYPE_LIST = [
  { key: '1', value: '危险性概述' },
  { key: '2', value: '管控措施' },
  { key: '3', value: '接触控制 / 个体防护' },
];

@connect(
  (
    {
      user: {
        currentUser: { unitType, unitId: unitId1 },
      },
      [NAMESPACE]: { securityList },
      loading: {
        effects: { [SECURITY_LIST_API]: loadingSecurityList },
      },
    },
    {
      location: { pathname },
      match: {
        params: { unitId: unitId2 },
      },
      route: { path, name },
    }
  ) => {
    const isUnit = unitType === 4;
    const unitId = isUnit ? unitId1 : unitId2;
    const companyUrl = path.replace(new RegExp(':.*'), 'list');
    return {
      isUnit,
      unitId,
      breadcrumbList: BREADCRUMB_LIST_PREFIX.concat(
        [
          !isUnit && {
            title: '单位列表',
            name: '单位列表',
            href: companyUrl,
          },
          {
            title: '重大危险源分布',
            name: '重大危险源分布',
            href: pathname.replace(new RegExp(`detail.*`), 'list'),
          },
          {
            title: '重大危险源详情',
            name: '重大危险源详情',
            href: pathname.replace(new RegExp(`/${name}.*`), ''),
          },
          { title: '化学品安防措施', name: '化学品安防措施' },
        ].filter(v => v)
      ),
      securityList,
      loadingSecurityList,
      goToCompany() {
        router.push(companyUrl);
      },
    };
  },
  null,
  (stateProps, { dispatch }, ownProps) => {
    const {
      match: {
        params: { parentId, id },
      },
    } = ownProps;
    return {
      ...stateProps,
      ...ownProps,
      getSecurityList(payload, callback) {
        dispatch({
          type: SECURITY_LIST_API,
          payload: {
            dangerSourceId: parentId,
            targetId: id,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取安防措施列表失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
    };
  }
)
export default class Security extends Component {
  state = {
    activeTabKey: undefined,
    type: undefined,
  };

  componentDidMount() {
    const { unitId, getSecurityList, goToCompany } = this.props;
    if (unitId) {
      getSecurityList(undefined, (success, data) => {
        if (success) {
          this.handleActiveTabKeyChange('0');
        }
      });
    } else {
      goToCompany();
    }
  }

  componentDidUpdate({
    unitId: prevUnitId,
    match: {
      params: { parentId: prevParentId, id: prevId },
    },
  }) {
    const {
      unitId,
      match: {
        params: { parentId, id },
      },
    } = this.props;
    if (unitId) {
      if (unitId !== prevUnitId || parentId !== prevParentId || id !== prevId) {
        const { getSecurityList } = this.props;
        getSecurityList(undefined, (success, data) => {
          if (success) {
            this.handleActiveTabKeyChange('0');
          }
        });
      }
    } else {
      const { goToCompany } = this.props;
      goToCompany();
    }
  }

  handleActiveTabKeyChange = activeTabKey => {
    this.setState({
      activeTabKey,
      type: TYPE_LIST[0].key,
    });
  };

  handleTypeChange = ({ target: { value: type } }) => {
    this.setState({
      type,
    });
  };

  render() {
    const { breadcrumbList, securityList = [], loadingSecurityList } = this.props;
    const { activeTabKey, type } = this.state;
    const tabList = securityList.map(({ chineName }, index) => ({
      key: `${index}`,
      tab: chineName,
    }));
    const {
      chineName,
      engName,
      casNo,
      bookCode,
      injurant,
      injurantCas,
      riskCateg,
      correctionCoefficient,
      limitValue,
      invasionRoute,
      healthHazard,
      environmentalHarm,
      deflagration,
      skinContact,
      eyeContact,
      inhalHazard,
      ingestHazard,
      hazardChara,
      combustionProducts,
      extinMethod,
      leakDisposal,
      operationCautions,
      storaTransNotice,
      occupationalExposureLimit,
      macCn,
      macSov,
      tlvtn,
      tlvwn,
      monitoringMethod,
      enginContr,
      respiProtect,
      eyeProtect,
      bodyProtect,
      handProtect,
      otherProtect,
    } = securityList[activeTabKey] || {};

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
      >
        <Spin spinning={loadingSecurityList}>
          <Card
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={this.handleActiveTabKeyChange}
          >
            <div className={styles.fieldContainer}>
              <Row>
                {[
                  { key: '化学品中文名称', value: chineName },
                  { key: '化学品英文名称', value: engName },
                  { key: 'CAS号', value: casNo },
                  { key: '技术说明书编码', value: bookCode },
                  { key: '有害成分', value: injurant },
                  { key: '有害物CAS号', value: injurantCas },
                ].map(({ key, value, span }) => (
                  <Col key={key} span={span || 8}>
                    <div className={styles.fieldWrapper}>
                      <div className={styles.fieldName}>{key}：</div>
                      <div className={styles.fieldValue}>
                        {value ? (
                          <Ellipsis lines={1} tooltip>
                            {value}
                          </Ellipsis>
                        ) : (
                          <EmptyText />
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <div className={styles.radioWrapper}>
                <Radio.Group value={type} onChange={this.handleTypeChange} buttonStyle="solid">
                  {TYPE_LIST.map(({ key, value }) => (
                    <Radio.Button key={key} value={key}>
                      {value}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
              {type === TYPE_LIST[0].key && (
                <Row>
                  {[
                    { key: '危险性类别', value: getRiskCategoryLabel(riskCateg, RISK_CATEGORIES) },
                    { key: '矫正系数β值', value: correctionCoefficient },
                    { key: '临界量（Q）', value: limitValue !== null && `${limitValue}t` },
                    {
                      key: '侵入途径',
                      value: invasionRoute && <TextAreaEllipsis value={invasionRoute} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '健康危害',
                      value: healthHazard && <TextAreaEllipsis value={healthHazard} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '环境危害',
                      value: environmentalHarm && <TextAreaEllipsis value={environmentalHarm} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '爆燃危险',
                      value: deflagration && <TextAreaEllipsis value={deflagration} />,
                      span: 24,
                      standalone: true,
                    },
                  ].map(({ key, value, span, standalone }) => (
                    <Col key={key} span={span || 8}>
                      <div className={styles.fieldWrapper}>
                        <div className={styles.fieldName}>{key}：</div>
                        <div className={styles.fieldValue}>
                          {value ? (
                            standalone ? (
                              value
                            ) : (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            )
                          ) : (
                            <EmptyText />
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
              {type === TYPE_LIST[1].key && (
                <Row>
                  <Col span={24}>
                    <div className={styles.subTitle}>急救措施</div>
                  </Col>
                  {[
                    {
                      key: '皮肤接触',
                      value: skinContact && <TextAreaEllipsis value={skinContact} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '眼镜接触',
                      value: eyeContact && <TextAreaEllipsis value={eyeContact} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '吸入危害',
                      value: inhalHazard && <TextAreaEllipsis value={inhalHazard} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '食入危害',
                      value: ingestHazard && <TextAreaEllipsis value={ingestHazard} />,
                      span: 24,
                      standalone: true,
                    },
                  ].map(({ key, value, span, standalone }) => (
                    <Col key={key} span={span || 8}>
                      <div className={styles.fieldWrapper}>
                        <div className={styles.fieldName}>{key}：</div>
                        <div className={styles.fieldValue}>
                          {value ? (
                            standalone ? (
                              value
                            ) : (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            )
                          ) : (
                            <EmptyText />
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                  <Col span={24}>
                    <div className={styles.subTitle}>消防措施</div>
                  </Col>
                  {[
                    {
                      key: '危险特性',
                      value: hazardChara && <TextAreaEllipsis value={hazardChara} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '有害燃烧产物',
                      value: combustionProducts && <TextAreaEllipsis value={combustionProducts} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '灭火方法',
                      value: extinMethod && <TextAreaEllipsis value={extinMethod} />,
                      span: 24,
                      standalone: true,
                    },
                  ].map(({ key, value, span, standalone }) => (
                    <Col key={key} span={span || 8}>
                      <div className={styles.fieldWrapper}>
                        <div className={styles.fieldName}>{key}：</div>
                        <div className={styles.fieldValue}>
                          {value ? (
                            standalone ? (
                              value
                            ) : (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            )
                          ) : (
                            <EmptyText />
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                  <Col span={24}>
                    <div className={styles.subTitle}>泄露应急处理</div>
                  </Col>
                  {[
                    {
                      key: '泄漏处置',
                      value: leakDisposal && <TextAreaEllipsis value={leakDisposal} />,
                      span: 24,
                      standalone: true,
                    },
                  ].map(({ key, value, span, standalone }) => (
                    <Col key={key} span={span || 8}>
                      <div className={styles.fieldWrapper}>
                        <div className={styles.fieldName}>{key}：</div>
                        <div className={styles.fieldValue}>
                          {value ? (
                            standalone ? (
                              value
                            ) : (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            )
                          ) : (
                            <EmptyText />
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                  <Col span={24}>
                    <div className={styles.subTitle}>操作处置与储存</div>
                  </Col>
                  {[
                    {
                      key: '操作注意事项',
                      value: operationCautions && <TextAreaEllipsis value={operationCautions} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '存储注意事项',
                      value: storaTransNotice && <TextAreaEllipsis value={storaTransNotice} />,
                      span: 24,
                      standalone: true,
                    },
                  ].map(({ key, value, span, standalone }) => (
                    <Col key={key} span={span || 8}>
                      <div className={styles.fieldWrapper}>
                        <div className={styles.fieldName}>{key}：</div>
                        <div className={styles.fieldValue}>
                          {value ? (
                            standalone ? (
                              value
                            ) : (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            )
                          ) : (
                            <EmptyText />
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
              {type === TYPE_LIST[2].key && (
                <Row>
                  {[
                    { key: '职业接触限值', value: occupationalExposureLimit, span: 24 },
                    { key: '中国MAC（mg/m³）', value: macCn, span: 24 },
                    { key: '前苏联MAC（mg/m³）', value: macSov, span: 24 },
                    {
                      key: 'TLVTN',
                      value: tlvtn,
                      span: 24,
                    },
                    {
                      key: 'TLVWN',
                      value: tlvwn,
                      span: 24,
                    },
                    {
                      key: '监测方法',
                      value: monitoringMethod && <TextAreaEllipsis value={monitoringMethod} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '工程控制',
                      value: enginContr && <TextAreaEllipsis value={enginContr} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '呼吸系统防护',
                      value: respiProtect && <TextAreaEllipsis value={respiProtect} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '眼睛防护',
                      value: eyeProtect && <TextAreaEllipsis value={eyeProtect} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '身体防护',
                      value: bodyProtect && <TextAreaEllipsis value={bodyProtect} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '手防护',
                      value: handProtect && <TextAreaEllipsis value={handProtect} />,
                      span: 24,
                      standalone: true,
                    },
                    {
                      key: '其他防护',
                      value: otherProtect && <TextAreaEllipsis value={otherProtect} />,
                      span: 24,
                      standalone: true,
                    },
                  ].map(({ key, value, span, standalone }) => (
                    <Col key={key} span={span || 8}>
                      <div className={styles.fieldWrapper}>
                        <div className={styles.fieldName}>{key}：</div>
                        <div className={styles.fieldValue}>
                          {value ? (
                            standalone ? (
                              value
                            ) : (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            )
                          ) : (
                            <EmptyText />
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
