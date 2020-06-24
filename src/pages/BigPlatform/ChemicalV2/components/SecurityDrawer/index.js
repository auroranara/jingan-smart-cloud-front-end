import React, { useRef, useState, useEffect } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import Link from '@/jingan-components/View/Link';
import EmptyText from '@/jingan-components/View/EmptyText';
import Ellipsis from '@/components/Ellipsis';
import RadioBtns from '../RadioBtns';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { connect } from 'dva';
import classNames from 'classnames';
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import icon from '../../imgs/drawer/drawer-chemical.png';
import styles from './index.less';

const NAMESPACE = 'materials';
const API = `${NAMESPACE}/getMaterialDetail`;
const TYPES = ['生产原料', '中间产品', '最终产品'];
const FORMS = ['固态', '液态', '气态', '等离子态'];
const YES_OR_NO = ['否', '是'];

export default connect(
  state => state,
  null,
  (
    {
      [NAMESPACE]: { materialDetail: detail },
      loading: {
        effects: { [API]: loading },
      },
    },
    { dispatch },
    ownProps
  ) => ({
    ...ownProps,
    detail,
    loading,
    getDetail(payload, callback) {
      dispatch({
        type: API,
        payload: {
          pageNum: 1,
          pageSize: 1,
          ...payload,
        },
        callback,
      });
    },
  }),
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.visible === nextProps.visible &&
        props.data === nextProps.data &&
        props.detail === nextProps.detail &&
        props.loading === nextProps.loading
      );
    },
  }
)(
  ({
    visible,
    onClose,
    data,
    detail: {
      type,
      unifiedCode,
      chineName,
      casNo,
      dangerChemcataSn,
      riskCateg,
      materialForm,
      highlyToxicChem,
      easyMakePoison,
      easyMakeExplode,
      safetyMeasures,
      emergencyMeasure,
      msds,
    } = {},
    loading,
    getDetail,
  }) => {
    const scroll = useRef(null);
    const [value, setValue] = useState(undefined);
    console.log(data);
    useEffect(
      () => {
        setValue(data && data.length ? data[0].key : undefined);
        if (scroll.current) {
          scroll.current.dom.scrollTop();
        }
      },
      [data]
    );
    useEffect(
      () => {
        if (value) {
          getDetail({
            id: value,
          });
        }
      },
      [value]
    );
    return (
      <CustomDrawer
        title={
          <div className={styles.titleContainer}>
            <img src={icon} alt="" />
            <span>重点监管危化品安全措施和应急处置措施</span>
          </div>
        }
        visible={visible}
        onClose={onClose}
        width={535}
        zIndex={1344}
        sectionProps={{
          hideIcon: true,
          fixedContent: data &&
            data.length > 1 && (
              <div className={styles.radioGroup}>
                <RadioBtns
                  value={value}
                  onClick={value => {
                    setValue(value);
                    if (scroll.current) {
                      console.log(scroll.current);
                      scroll.current.dom.scrollTop();
                    }
                  }}
                  fields={data.map(item => ({
                    key: item.key,
                    label: item.value,
                    render: () => {
                      return (
                        <Ellipsis tooltip lines={1}>
                          {item.value}
                        </Ellipsis>
                      );
                    },
                  }))}
                  nextIcon={<LegacyIcon type="right" />}
                  prevIcon={<LegacyIcon type="left" />}
                />
              </div>
            ),
          scrollProps: {
            refScroll: scroll,
          },
          spinProps: {
            loading: loading || false,
            wrapperClassName: data && data.length > 1 && styles.spin,
          },
        }}
      >
        <div className={styles.container}>
          <div className={styles.subTitle}>
            <span>基本信息：</span>
            <Link to={`/safety-knowledge-base/msds/edit/${msds}`} target="_blank">
              化学品说明书&gt;&gt;
            </Link>
          </div>
          <div className={styles.subContent}>
            {[
              {
                name: '物料类型',
                value: TYPES[type - 1] || <EmptyText className={styles.empty} />,
              },
              { name: '统一编码', value: unifiedCode || <EmptyText className={styles.empty} /> },
              { name: '化学品名称', value: chineName || <EmptyText className={styles.empty} /> },
              { name: 'CAS号', value: casNo || <EmptyText className={styles.empty} /> },
              {
                name: '年消耗量',
                value: dangerChemcataSn || <EmptyText className={styles.empty} />,
              },
              {
                name: '危险化学品目录序号',
                value: dangerChemcataSn || <EmptyText className={styles.empty} />,
              },
              {
                name: '危险性类别',
                value: getRiskCategoryLabel(riskCateg, RISK_CATEGORIES) || (
                  <EmptyText className={styles.empty} />
                ),
              },
              {
                name: '物质形态',
                value: FORMS[materialForm - 1] || <EmptyText className={styles.empty} />,
              },
              {
                name: '是否剧毒化学品',
                value: YES_OR_NO[highlyToxicChem] || <EmptyText className={styles.empty} />,
              },
              {
                name: '是否易制毒',
                value: YES_OR_NO[easyMakePoison] || <EmptyText className={styles.empty} />,
              },
              {
                name: '是否易制爆',
                value: YES_OR_NO[easyMakeExplode] || <EmptyText className={styles.empty} />,
              },
            ].map(item => (
              <div key={item.name} className={styles.item}>
                <span className={styles.itemName}>{item.name}：</span>
                <span className={styles.itemValue}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className={styles.subTitle}>安全措施：</div>
          <div className={classNames(styles.subContent, styles.textArea)}>
            {safetyMeasures || <EmptyText className={styles.empty} />}
          </div>
          <div className={styles.subTitle}>应急处置措施：</div>
          <div className={classNames(styles.subContent, styles.textArea)}>
            {emergencyMeasure || <EmptyText className={styles.empty} />}
          </div>
        </div>
      </CustomDrawer>
    );
  }
);
