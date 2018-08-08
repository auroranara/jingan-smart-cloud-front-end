import React, { PureComponent, Fragment } from 'react';
import RiskImage from './RiskImage.js';
import RiskPoint from './RiskPoint.js';
import RiskInfo from './RiskInfo.js';
import RiskDetail from './RiskDetail.js';
import bg from './bg.png';
import red from './red.png';
import orange from './orange.png';
import yellow from './yellow.png';
import blue from './blue.png';
import sRed from './s_red.png';
import sOrange from './s_orange.png';
import sYellow from './s_yellow.png';
import sBlue from './s_blue.png';
import exception from './exception.png';
import selected from './selected.png';
import pointIcon from './point.png';
import areaIcon from './area.png';
import accidentTypeIcon from './accidentType.png';
import riskLevelIcon from './riskLevel.png';
import statusIcon from './status.png';

// 选中高度
const selectedHeight = 538;
// 信息offset
const defaultInfoOffset = {
  x: 100,
  y: -selectedHeight-100,
}
// 正常点的样式
const normalStyle = {
  width: 78,
  height: 81,
};
// 正常点的偏移
const normalOffset = {
  x: -4,
  y: 0,
};
// 选中点的样式
const selectedStyle = {
  width: 66,
  height: 80,
};
// 选中点的偏移
const selectedOffset = {
  x: 1,
  y: 0,
};
// 点图标，0为正常，1为选中，2为异常
const pointImages = [
  [
    {
      src: red,
      style: normalStyle,
      offset: normalOffset,
    },
    {
      src: orange,
      style: normalStyle,
      offset: normalOffset,
    },
    {
      src: yellow,
      style: normalStyle,
      offset: normalOffset,
    },
    {
      src: blue,
      style: normalStyle,
      offset: normalOffset,
    },
  ],
  [
    {
      src: sRed,
      style: selectedStyle,
      offset: selectedOffset,
    },
    {
      src: sOrange,
      style: selectedStyle,
      offset: selectedOffset,
    },
    {
      src: sYellow,
      style: selectedStyle,
      offset: selectedOffset,
    },
    {
      src: sBlue,
      style: selectedStyle,
      offset: selectedOffset,
    },
  ],
  [
    {
      src: exception,
      style: normalStyle,
      offset: normalOffset,
    },
  ],
];

const companyLetter = [
  {
    "localPictureUrlList": [],
    "warningSignUrlList": [],
    "companyInfo": {
      "company_name": "常熟市古里镇泽豪织造厂",
      "headOfSecurityPhone": "",
      "headOfSecurity": "",
    },
    "hdLetterInfo": {
      "id": "3X2gvK6nSkKWVichzZAgHw",
      "remarks": null,
      "itemId": "PRDGvk_0TsivW9SHb5MNVA",
      "areaName": null,
      "riskType": null,
      "accidentTypeCode": null,
      "dangerFactor": null,
      "preventMeasures": null,
      "emergencyMeasures": null,
      "accidentTypeName": null,
      "riskTypeName": null,
      "localPicture": null,
      "warningSign": null,
      "riskLevelName": {
        "color": "#FC1F02",
        "desc": "红",
      },
      "pointName": "梳毛机、现场管理+消防",
      "pointCode": null,
      "status": null,
    },
  },
  {
    "localPictureUrlList": [
      {
        "webUrl": null,
        "dbUrl": "[]",
      },
    ],
    "warningSignUrlList": [],
    "companyInfo": {
      "company_name": "常熟市古里镇泽豪织造厂",
      "headOfSecurityPhone": "",
      "headOfSecurity": "",
    },
    "hdLetterInfo": {
      "id": "FgrhkAV6Qb6Lfhpdz2H0fw",
      "remarks": null,
      "itemId": "TNR7yNPLTFmRowRvLuy2OQ",
      "areaName": "嗯嗯",
      "riskType": null,
      "accidentTypeCode": "7gwryIM8Q_ObVyvU2Ki_LA,HoE77_13Rg6TwCeCa1m9Xg",
      "dangerFactor": "确认热无",
      "preventMeasures": "而且热无热情",
      "emergencyMeasures": "全肉而我却",
      "accidentTypeName": "容器爆炸,锅炉爆炸",
      "riskTypeName": null,
      "localPicture": null,
      "warningSign": null,
      "riskLevelName": {
        "color": "#FC1F02",
        "desc": "红",
      },
      "pointName": "问问",
      "pointCode": "厄齐尔",
      "status": null,
    },
  },
  {
    "localPictureUrlList": [
      {
        "webUrl": null,
        "dbUrl": "[]",
      },
    ],
    "warningSignUrlList": [],
    "companyInfo": {
      "company_name": "常熟市古里镇泽豪织造厂",
      "headOfSecurityPhone": "",
      "headOfSecurity": "",
    },
    "hdLetterInfo": {
      "id": "Htim_rOxThOkUS5W36BRJw",
      "remarks": null,
      "itemId": "u7ZTZqJhTWeU86X_ua3Diw",
      "areaName": " 发多少",
      "riskType": null,
      "accidentTypeCode": "7gwryIM8Q_ObVyvU2Ki_LA,MYflXJP3Ru62TWxusemmiA",
      "dangerFactor": "第三方asd",
      "preventMeasures": "阿萨德发的f",
      "emergencyMeasures": "发放d",
      "accidentTypeName": "容器爆炸,触电",
      "riskTypeName": null,
      "localPicture": null,
      "warningSign": null,
      "riskLevelName": {
        "color": "#ED7E11",
        "desc": "橙",
      },
      "pointName": "打发asd",
      "pointCode": "阿萨德大范德萨",
      "status": null,
    },
  },
  {
    "localPictureUrlList": [],
    "warningSignUrlList": [],
    "companyInfo": {
      "company_name": "常熟市古里镇泽豪织造厂",
      "headOfSecurityPhone": "",
      "headOfSecurity": "",
    },
    "hdLetterInfo": {
      "id": "Mf38E0KBQiioSL1sHfne1w",
      "remarks": null,
      "itemId": "OrO1B38qQrKWFYiCO__oLA",
      "areaName": null,
      "riskType": null,
      "accidentTypeCode": null,
      "dangerFactor": null,
      "preventMeasures": null,
      "emergencyMeasures": null,
      "accidentTypeName": null,
      "riskTypeName": null,
      "localPicture": null,
      "warningSign": null,
      "riskLevelName": {
        "color": "#ED7E11",
        "desc": "橙",
      },
      "pointName": "网格检查点",
      "pointCode": null,
      "status": null,
    },
  },
  {
    "localPictureUrlList": [],
    "warningSignUrlList": [],
    "companyInfo": {
      "company_name": "常熟市古里镇泽豪织造厂",
      "headOfSecurityPhone": "",
      "headOfSecurity": "",
    },
    "hdLetterInfo": {
      "id": "tgoktGupRaaEiQO4FYf0pw",
      "remarks": null,
      "itemId": "C__TIRO_SOSdVpTLFYDPcA",
      "areaName": null,
      "riskType": null,
      "accidentTypeCode": null,
      "dangerFactor": null,
      "preventMeasures": null,
      "emergencyMeasures": null,
      "accidentTypeName": null,
      "riskTypeName": null,
      "localPicture": null,
      "warningSign": null,
      "riskLevelName": {
        "color": "#FC1F02",
        "desc": "红",
      },
      "pointName": "剪毛机、现场管理+消防",
      "pointCode": null,
      "status": null,
    },
  },
  {
    "localPictureUrlList": [
      {
        "webUrl": "[\"http:/pak93s58x.bkt.clouddn.com/development/gsafe/localPicture/180502-092709-DPM0.png\"]",
        "dbUrl": "[\"@@IPEXP_IMP_FILES_WEB/gsafe/localPicture/180502-092709-DPM0.png\"]",
      },
    ],
    "warningSignUrlList": [],
    "companyInfo": {
      "company_name": "常熟市古里镇泽豪织造厂",
      "headOfSecurityPhone": "",
      "headOfSecurity": "",
    },
    "hdLetterInfo": {
      "id": "yrajlfNiQyG_69CNqTB_qQ",
      "remarks": null,
      "itemId": "Ct_AyG3WSwe481c97W9nvA",
      "areaName": "dfadsddd",
      "riskType": null,
      "accidentTypeCode": "7gwryIM8Q_ObVyvU2Ki_LA,Y4l5vxkLTgeDEi_BC2bkwg",
      "dangerFactor": "打发",
      "preventMeasures": "dafds",
      "emergencyMeasures": "大范德萨da",
      "accidentTypeName": "容器爆炸,火灾",
      "riskTypeName": null,
      "localPicture": null,
      "warningSign": null,
      "riskLevelName": {
        "color": "#FC1F02",
        "desc": "红",
      },
      "pointName": "发电房",
      "pointCode": "dfads",
      "status": null,
    },
  },
];
// 根据颜色筛选图片
const switchImageColor = (list, color) => {
  switch(color) {
    case '红':
      return list[0];
    case '橙':
      return list[1];
    case '黄':
      return list[2];
    default:
      return list[3];
  }
}

const points = [
  {
    "itemId": "C__TIRO_SOSdVpTLFYDPcA",
    "yNum": 0,
    "xNum": 0,
  },
  {
    "itemId": "Ct_AyG3WSwe481c97W9nvA",
    "yNum": 100,
    "xNum": 100,
  },
  {
    "itemId": "PRDGvk_0TsivW9SHb5MNVA",
    "yNum": 300,
    "xNum": 300,
  },
  {
    "itemId": "TNR7yNPLTFmRowRvLuy2OQ",
    "yNum": 600,
    "xNum": 600,
  },
  {
    "itemId": "u7ZTZqJhTWeU86X_ua3Diw",
    "yNum": 300,
    "xNum": 600,
  },
];

export default class Text extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null,
      selectedBottom: 0,
      selectedIndex: 0,
    };
    this.points = [];
    this.timer = null;
  }

  componentDidMount() {
    this.points[0].handleClick();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleClick = (id, index, point) => {
    const { selectedId } = this.state;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const { selectedIndex } = this.state;
      if (selectedIndex === points.length-1) {
        this.points[0].handleClick();
      }
      else {
        this.points[selectedIndex+1].handleClick();
      }
    }, 5000);
    if (selectedId === id) {
      return;
    }
    this.setState({
      selectedId: id,
      selectedIndex: index,
      selectedBottom: `${Number.parseInt(point.style.bottom, 10) + selectedHeight}px`,
    });
  }

  render() {
    const { selectedId, selectedBottom } = this.state;

    return (
      <div>
        <div style={{ /* position: 'absolute', top: '10px', left: '10px', */ color: '#00A8FF', fontSize: '20px' }}>
          <div>安全风险四色图</div>
        </div>
        <RiskImage
          src={bg}
          perspective='30em'
          rotate='45deg'
        >
          {points.map(({ itemId: id, yNum: y, xNum: x }, index) => {
            const changedStyle = selectedId === id ? { bottom: selectedBottom } : {};
            const info = companyLetter.filter(({ hdLetterInfo: { itemId } }) => itemId === id)[0];
            if (info) {
              const position = { x, y };
              const { src, style, offset } = selectedId === id ? switchImageColor(pointImages[1], info.hdLetterInfo.riskLevelName.desc) : (+info.status !== 2 ? switchImageColor(pointImages[0], info.hdLetterInfo.riskLevelName.desc) : pointImages[2][1]);
              const infoData = [
                {
                  icon: pointIcon,
                  title: info.hdLetterInfo.pointName,
                  render: (title) => (<span style={{ fontSize: '16px' }}>{title}</span>),
                },
                {
                  icon: areaIcon,
                  title: info.hdLetterInfo.areaName,
                },
                {
                  icon: accidentTypeIcon,
                  title: info.hdLetterInfo.accidentTypeName,
                },
                {
                  icon: statusIcon,
                  title: info.hdLetterInfo.status,
                  render: (title) => { const list = ['#20DE3A', '#E8292D', '#794277', '#EF5150']; return (<span style={{ color: list[(title-1) || 0] }}>{title}</span>)},
                },
                {
                  icon: riskLevelIcon,
                  title: info.hdLetterInfo.riskLevelName.desc,
                  render: (title) => (<span style={{ color: info.hdLetterInfo.riskLevelName.color }}>{title}</span>),
                },
              ];
              return (
                <Fragment key={id}>
                  <RiskPoint
                    position={position}
                    src={src}
                    style={{
                      ...style,
                      ...changedStyle,
                    }}
                    offset={offset}
                    onClick={(point) => {this.handleClick(id, index, point);}}
                    ref={(point)=>{this.points[index] = point;}}
                  />
                  <RiskPoint
                    position={position}
                    src={selected}
                    style={{
                      width: 127,
                      height: selectedId === id ? selectedHeight : 0,
                    }}
                  />
                  <RiskInfo
                    position={position}
                    offset={defaultInfoOffset}
                    data={infoData}
                    background={bg}
                    style={{
                      opacity: selectedId === id ? '1' : 0,
                    }}
                  />
                </Fragment>
              );
            }
            else {
              return null;
            }
          })}
        </RiskImage>
        <div style={{ display: 'flex', height: '24px', padding: '16px 0' }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '4px', width: '16px', height: '16px', backgroundColor: '#BF6C6E' }} />
            <span>重大风险</span>
          </div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '4px', width: '16px', height: '16px', backgroundColor: '#CC964B' }} />
            <span>较大风险</span>
          </div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '4px', width: '16px', height: '16px', backgroundColor: '#C6BC7A' }} />
            <span>一般风险</span>
          </div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '4px', width: '16px', height: '16px', backgroundColor: '#4C9ED6' }} />
            <span>低风险</span>
          </div>
        </div>
        <RiskDetail
          style={{
            height: '600px',
          }}
          data={[
            {
              id: 1,
              description: 'description',
              sbr: 'sbr',
              sbsj: 'sbsj',
              zgr: 'zgr',
              zgsj: 'zgsj',
              fcr: 'fcr',
              status: 0,
              background: bg,
            },
            {
              id: 2,
              description: 'description',
              sbr: 'sbr',
              sbsj: 'sbsj',
              zgr: 'zgr',
              zgsj: 'zgsj',
              fcr: 'fcr',
              status: 1,
              background: bg,
            },
            {
              id: 3,
              description: 'description',
              sbr: 'sbr',
              sbsj: 'sbsj',
              zgr: 'zgr',
              zgsj: 'zgsj',
              fcr: 'fcr',
              status: 2,
              background: bg,
            },
          ]}
        />
      </div>
    );
  }
}
