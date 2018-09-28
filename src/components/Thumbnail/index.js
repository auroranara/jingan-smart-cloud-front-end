import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

/**
 * 暂时认为图片地址是不重复的，否则需要改key
 */

const disabledStyle = {
  cursor: 'not-allowed',
  color: '#eee',
  backgroundColor: '#fff',
};
/**
 * 缩略图
 */
export default class App extends PureComponent {
  render() {
    const {
      // 高除以宽得到的百分比
      ratio='75%',
      // 点击事件
      // onClick,
      // 图片地址列表
      urls=['1','2'],
      // 一行多少个
      number=4,
      index,
      pageNum,
      onPage,
      onClick,
    } = this.props;
    const count = Math.max(Math.ceil(urls.length / number), 1);
    // 是否在第一页
    const isFirst = pageNum === 1;
    // 是否在最后一页
    const isLast = pageNum === count;

    return (
      <div className={styles.container}>
        <div
          className={styles.leftSection}
          style={isFirst?disabledStyle:undefined}
          onClick={isFirst?undefined:() => onPage(pageNum-1)}
        >
          <Icon type="left" />
        </div>
        <div className={styles.centerSection}>
          <div className={styles.list} style={{ width: `${urls.length / number * 100}%`, left: `${(pageNum-1) * -100}%` }}>
            {urls.map(({ id, webUrl }, i) => {
              const isSelected = index === i;
              return (
                <div key={id} className={styles.itemWrapper} style={{ width: `${1 / urls.length * 100}%` }}>
                  <div
                    className={styles.item}
                    style={{
                      paddingBottom: ratio,
                      backgroundImage: `url(${webUrl})`,
                      borderColor: isSelected ? '#0967D3' : undefined,
                      cursor: isSelected ? 'auto' : undefined,
                    }}
                    onClick={() => !isSelected && onClick(i)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={styles.rightSection}
          style={isLast?disabledStyle:undefined}
          onClick={isLast?undefined:() => onPage(pageNum+1)}
        >
          <Icon type="right" />
        </div>
      </div>
    );
  }
}
