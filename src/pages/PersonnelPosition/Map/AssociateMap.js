import { PureComponent } from 'react';
import { Button, Card, Col, Icon, Divider } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import styles from './AssociateMap.less';

const title = '关联地图';

export default class AssociateMap extends PureComponent {

  state = {
    unitScale: 1,
  }

  // 放大图片
  handleIncrease = () => {
    let { unitScale } = this.state
    unitScale += 0.2
    this.refs.unitMap.style.transform = `translate(-50%, -50%) scale(${unitScale})`
    this.setState({ unitScale })
  }

  // 缩小图片
  handleDecrease = () => {
    let { unitScale } = this.state
    if (unitScale <= 0.3) return
    unitScale -= 0.2
    this.refs.unitMap.style.transform = `translate(-50%, -50%) scale(${unitScale})`
    this.setState({ unitScale })
  }

  // 点击图片
  handleClick = (e) => {
    const domUnitMap = this.refs.unitMap

    console.log(e.movementX);


    const x = e.pageX - e.target.offsetLeft
    const y = e.pageY - e.target.offsetTop
    console.log(`x:${e.pageX},y:${e.clientY}`);


  }

  /*  addParentOffset=(node,total)=>{
     if(node.parent)
   } */

  render() {
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { name: '地图管理', title: '地图管理', href: '/personnel-position/map-management/list' },
      // {name:'地图列表',title:'地图列表',href:`/personnel-position/map-management/company-map/${companyId}`},
      { name: title, title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card className={styles.AssociateMap}>
          <Col span={16}>
            <div className={styles.unitMapContainer}>
              <img ref="unitMap" className={styles.unitMap} onClick={e => this.handleClick(e)} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549011137&di=cf7e7ec5eb9a0e85ac6054647b5abdb7&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fa71ea8d3fd1f4134509ed2442e1f95cad1c85e5b.jpg" alt="" />
              <div className={styles.operation}>
                <Icon type="zoom-in" onClick={this.handleIncrease} />
                <Divider type='vertical' />
                <Icon type="zoom-out" onClick={this.handleDecrease} />
              </div>
            </div>
          </Col>
          <Col span={8}></Col>
        </Card>
      </PageHeaderLayout>
    )
  }
}
