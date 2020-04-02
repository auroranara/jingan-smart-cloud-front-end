import React, { PureComponent, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Tooltip } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './DangerSourceLvlDrawer.less';
import { CardItem } from '../components/Components';
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';

const uniqueByid = array => {
  return array.reduce((prev, next) => {
    const ids = prev.map(item => item.id);
    if (ids.indexOf(next.id) < 0) prev.push(next);
    return prev;
  }, []);
};
const NO_DATA = '暂无数据';

const fields = [
  { label: '存储物质', value: 'chineName' },
  {
    label: '危险性类别',
    value: 'riskCateg',
    render: (val, data) => {
      const betaStr = data.beta || data.beta === 0 ? `（β=${data.beta}）` : '';
      const rc = getRiskCategoryLabel(val, RISK_CATEGORIES);
      return rc ? `${rc}${betaStr}` : NO_DATA;
    },
  },
  // { label: '实时储量(q)', value: 'acture' },
  { label: '临界量(Q)', value: 'ljl', render: val => (val || val === 0 ? `${val}t` : NO_DATA) },
];

const getAlpha = number => {
  const num = +number;
  if (num === 0) return '0.5';
  else if (num >= 1 && num <= 29) return '1.0';
  else if (num >= 30 && num <= 49) return '1.2';
  else if (num >= 50 && num <= 99) return '1.5';
  else if (num >= 100) return '2.0';
};

export default class DangerSourceLvlDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickDetail = () => {
    const { setDrawerVisible } = this.props;
    setDrawerVisible('');
  };

  render() {
    const {
      visible,
      onClose,
      dangerSourceDetail: { r, personNum },
      dangerSourceMaterials: { miList = [], alpha },
    } = this.props;
    const materials = uniqueByid(miList);

    return (
      <DrawerContainer
        title="重大危险源等级影响因素"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1422}
        left={
          <div className={styles.container}>
            <div className={styles.rlvl}>
              <span className={styles.label}>R值：</span>
              {r}
              <Tooltip
                title="由专家根据公式评估算出，具体参照《GB 18218-2018 危险化学品重大危险源辨识》"
                overlayStyle={{ zIndex: 9999 }}
                placement={'right'}
              >
                <span className={styles.question}>
                  <LegacyIcon type="question-circle" />
                </span>
              </Tooltip>
            </div>
            <div className={styles.subTitle}>
              <span className={styles.circle} />
              <span className={styles.label}>周围500米内常住人口数量：</span>
              {personNum || NO_DATA}
              {personNum && ` (α=${getAlpha(personNum)})`}
            </div>

            {materials.length > 0 && (
              <div>
                <div className={styles.subTitle} style={{ marginBottom: '8px' }}>
                  <span className={styles.circle} />
                  <span className={styles.label}>重大危险源存储物质</span>
                </div>

                {/* {basicList.map((item, index) => (
              <CardItem key={index} data={item} fields={basicFields} />
            ))} */}
                {/* <div className={styles.title}>
              <span className={styles.rect} />
              重大危险源存储物质
            </div> */}
                {materials.map((item, index) => (
                  <CardItem key={index} data={item} fields={fields} />
                ))}
              </div>
            )}
          </div>
        }
      />
    );
  }
}
