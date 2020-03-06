import React, { PureComponent } from 'react';
import { Row, Col, Carousel } from 'antd';
import { NoData } from '../components/Components';
import Section from '@/pages/BigPlatform/Safety/Company3/components/Section';
// 引入样式文件
import styles from './Remind.less';

// const data = [
//   { value: 2, name: '特种作业操作证', url: 'operation-safety/special-operation-permit/list' },
//   { value: 1, name: '工业产品安全许可证', url: 'unit-license/industrial-product-licence/list' },
//   { value: 1, name: '注册安全工程师', url: 'base-info/registered-engineer-management/list' },
//   { value: 3, name: '危化品企业安全许可证', url: 'unit-license/danger-chemicals-permit/list' },
// ];

const list = [
  {
    name: '注册安全工程师',
    key: 'safetyEng',
    url: 'base-info/registered-engineer-management/list',
  },
  {
    name: '工业产品生产许可证',
    key: 'productLicence',
    url: 'unit-license/industrial-product-licence/list',
  },
  {
    name: '危化品企业安全许可证',
    key: 'hazardchemicalCertificate',
    url: 'unit-license/danger-chemicals-permit/list',
  },
  { name: '特种设备', key: 'specialEquip', url: 'facility-management/special-equipment/list' },
  { name: '安全设施', key: 'safeFacilities', url: 'facility-management/safety-facilities/list' },
  {
    name: '安全制度管理',
    key: 'securityRuleManage',
    url: 'safety-production-regulation/safety-system/list',
  },
  {
    name: '特种作业操作证人员',
    key: 'specialworkPerson',
    url: 'operation-safety/special-operation-permit/list',
  },
  {
    name: '特种设备作业人员',
    key: 'specialequipPerson',
    url: 'operation-safety/special-equipment-operators/list',
  },
  { name: '应急预案', key: 'emergencyPlan', url: 'emergency-management/emergency-plan/list' },
  { name: '应急装备', key: 'emergencyEquip', url: 'emergency-management/emergency-equipment/list' },
];
const Size = 4;

export default class Remind extends PureComponent {
  state = {};

  componentDidMount() {
    setTimeout(() => {
      this.carousel && this.carousel.goTo(0, true);
    }, 1000);
  }

  handleClick = url => {
    if (!url) return;
    window.open(`${window.publicPath}#/${url}`, `_blank`);
  };

  setCarouselReference = carousel => {
    this.carousel = carousel;
  };

  render() {
    const { pastStatusCount } = this.props;
    const data = list
      .map(item => ({ ...item, value: pastStatusCount[item.key] }))
      .filter(item => item.value);
    const page = Math.ceil(data.length / Size);

    return (
      <Section title="到期提醒" className={styles.container}>
        {data.length > 0 ? (
          <Carousel  autoplaySpeed={5000} ref={this.setCarouselReference}>
            {new Array(page).fill(true).map((_, i) => (
              <Row gutter={10} key={i}>
                {data.slice(i * Size, (i + 1) * Size).map((item, index) => (
                  <Col span={12} key={item.key} className={styles.item}>
                    <div className={styles.number} onClick={() => this.handleClick(item.url)}>
                      {item.value}
                    </div>
                    <span className={styles.name} onClick={() => this.handleClick(item.url)}>
                      {item.name}
                    </span>
                  </Col>
                ))}
              </Row>
            ))}
          </Carousel>
        ) : (
          <NoData />
        )}
      </Section>
    );
  }
}
