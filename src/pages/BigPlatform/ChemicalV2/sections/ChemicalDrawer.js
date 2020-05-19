import React, { PureComponent, Fragment } from 'react';
import { Tooltip } from 'antd';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import { CardItem } from '../components/Components';
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import Ellipsis from 'components/Ellipsis';
import styles from './ChemicalDetailDrawer.less';

import detailImg from '../imgs/chemical-detail.png';
import locationImg from '../imgs/chemical-location.png';

const Types = ['生产原料', '中间产品', '最终产品'];
const NO_DATA = '暂无数据';
const fields = [
  { label: '物料类型', value: 'type', render: val => Types[val - 1] },
  { label: '化学品名称', value: 'chineName' },
  { label: 'CAS号', value: 'casNo' },
  // {
  //   label: '最大储量',
  //   value: 'maxStoreDay',
  //   render: (val, row) => val + (+row.maxStoreDayUnit === 1 ? 't' : 'm³'),
  // },
  {
    label: '危险性类别',
    value: 'riskCateg',
    // render: val => RISK_CATEGORIES[val] || NO_DATA,
    render: val => (
      <Tooltip
        placement="top"
        title={getRiskCategoryLabel(val, RISK_CATEGORIES) || NO_DATA}
        overlayStyle={{ zIndex: 9999 }}
      >
        <span className={styles.riskCateg}>
          {getRiskCategoryLabel(val, RISK_CATEGORIES) || NO_DATA}
        </span>
      </Tooltip>
    ),
  },
];

export default class ChemicalDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visible,
      onClose,
      materialsList,
      handleShowChemicalDetail,
      handleShowChemicalStore,
    } = this.props;
    // const {} = this.state;

    return (
      <DrawerContainer
        title="重点监管危化品列表"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div>
            {materialsList.map((item, index) => (
              <CardItem
                key={index}
                data={item}
                fields={fields}
                extraBtn={
                  <div className={styles.btnWrapper}>
                    <Tooltip
                      placement="top"
                      title={'安全措施和应急处置措施'}
                      overlayStyle={{ zIndex: 9999 }}
                    >
                      <span
                        className={styles.btnIcon}
                        style={{
                          background: `url(${detailImg}) center center / 100% 100% no-repeat`,
                        }}
                        onClick={() => handleShowChemicalDetail(item)}
                      />
                    </Tooltip>
                    <Tooltip
                      placement="top"
                      title={'存储/生产场所'}
                      overlayStyle={{ zIndex: 9999 }}
                    >
                      <span
                        className={styles.btnIcon}
                        style={{
                          background: `url(${locationImg}) center center / 100% 100% no-repeat`,
                        }}
                        onClick={() => handleShowChemicalStore(item)}
                      />
                    </Tooltip>
                  </div>
                }
              />
            ))}
          </div>
        }
      />
    );
  }
}
