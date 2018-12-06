import React, { PureComponent } from 'react';
import { Carousel } from 'antd';

import Section from '../Section';
import styles from './FireDevice.less';

import normal from '../imgs/normal.png';
import fine from '../imgs/fine.png';
import error from '../imgs/error.png';

export default class FireDevice extends PureComponent {

  getImageByStatus = (status) => {
    switch (+status) {
      case 1:
        return error;
      case 2:
        return normal;
      case 3:
        return fine;
      default:
        return;
    }
  }

  render() {
    const {
      systemScore: { list = [] },
      onClick,
    } = this.props;

    // 移除没有状态的成员
    const arr = list.filter(({ status }) => status);
    // 分为4个一组
    const result = arr.reduce((total, item, index) => {
      const i = Math.floor(index / 4);
      if (index % 4 === 0) {
        total[i] = [item];
      }
      else {
        total[i].push(item);
      }
      return total;
    }, []);
    return (
      <Section title="消防设施情况">
        <div className={styles.container}>
          <Carousel autoplay autoplaySpeed={5000}>
            {result.map((cols, index) => {
              const [{ sysId }] = cols;
              return (
                <div key={sysId} className={styles.wrapper}>
                  {cols.map(({ sysId, sysName, status }) => (
                    <div className={styles.item} key={sysId} onClick={() => { onClick({ sysId, sysName }) }}>
                      <div className={styles.icon} style={{ backgroundImage: `url(${this.getImageByStatus(status)})` }} />
                      <div className={styles.label}>{sysName}</div>
                    </div>
                  ))}
                </div>
              );
              // return <div key={index}>{index}</div>
            })}
          </Carousel>
        </div>
      </Section>
    );
  }
}
