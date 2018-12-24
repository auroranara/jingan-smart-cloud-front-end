import React, { PureComponent, Fragment } from 'react';

import styles from './DangerDrawer.less';
// import DrawerContainer from '../components/DrawerContainer';
// import DrawerSection from '../components/DrawerSection';
// import GraphSwitch from '../components/GraphSwitch';
// import SearchBar from '../components/SearchBar';
// import DrawerStretchCard from '../components/DrawerStretchCard';
// import Ring from '../components/Ring';
import {
  DrawerContainer,
  DrawerSection,
  DrawerStretchCard,
  ChartBar,
  ChartRing,
  SearchBar,
} from '../components/Components';
import { fillZero, sortDangerRecords } from '../utils';
// import clockIcon from '../img/cardClock1.png';

const TYPE = 'danger';
const STATUS = [['-1'], ['7'], ['1', '2'], ['3']];
STATUS['-1'] = ['-1'];

// const CARDS = [...Array(10).keys()].map(i => ({
//   id: i,
//   name: '无锡市新吴区机械制造有限公司',
//   total: 10,
// }));

export default class DangerDrawer extends PureComponent {
  state = { searchValue: '' };

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClose = () => {
    const { handleDrawerVisibleChange, handleLabelClick } = this.props;
    handleDrawerVisibleChange(TYPE);
    handleLabelClick(-1);
    this.setState({ searchValue: '' });
  };

  render() {
    const {
      visible,
      cardLoading,
      selectedCompanyId='',
      labelIndex=0,
      handleLabelClick,
      data: {
        overview: {
          overdueNum=0,
          rectifyNum=0,
          reviewNum=0,
        },
        dangerList=[],
        dangerRecords=[],
      },
    } = this.props;
    const { searchValue } = this.state;

    const rings = [overdueNum, rectifyNum, reviewNum];
    const list = dangerList.slice(0, 10).map(({ companyId, companyName: name, total }, i) => {
      let newName = name;
      if (i === 9 && name.length > 10)
        newName = `${name.slice(0, 10)}...`;
      return { id: companyId, name: newName, value: total };
    });
    const filteredList = dangerList.filter(({ companyName }) => companyName.includes(searchValue));
    const filteredRecords = labelIndex && labelIndex !== -1 ? dangerRecords.filter(({ status }) => STATUS[labelIndex].includes(status)) : dangerRecords;
    sortDangerRecords(filteredRecords, STATUS[labelIndex][0]);

    const left = (
      <Fragment>
        <DrawerSection title="隐患状态统计" style={{ marginBottom: 50, position: 'relative' }}>
          <ChartRing data={rings} />
          <div className={styles.total}>
            <p className={styles.num}>{fillZero(rings.reduce((prev, next) => prev + next), 3)}</p>
            <p className={styles.text}>总数</p>
          </div>
        </DrawerSection>
        <DrawerSection title="隐患数量排名">
          <ChartBar data={list} labelRotate={-60} />
        </DrawerSection>
      </Fragment>
    );

    const right = (
        <SearchBar onSearch={this.handleSearch}>
          {filteredList.map((item, i) => {
            const { companyId } = item;
            // console.log(companyId, selectedCompanyId);

            return (
              <DrawerStretchCard
                loading={cardLoading}
                key={companyId}
                labelIndex={labelIndex}
                selected={companyId === selectedCompanyId}
                data={item}
                list={filteredRecords}
                handleLabelClick={handleLabelClick}
              />
            );
          })}
        </SearchBar>
    );

    return (
      <DrawerContainer
        title="隐患列表"
        visible={visible}
        left={left}
        right={right}
        onClose={this.handleClose}
      />
    );
  }
}