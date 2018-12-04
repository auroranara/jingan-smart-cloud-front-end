## 所需参数
* isCardClick: PropTypes.bool,          //  整块是否可点击
* onCardClick: PropTypes.func,          // 点击触发
* showStatusLogo: PropTypes.bool,       // 是否显示状态logo
* showRightIcon: PropTypes.bool,        // 是否显示右上角图标
* cardPadding: PropTypes.string,        // 外层padding
* contentList: PropTypes.array.isRequired,       // 所需的数据对象
* photo: PropTypes.string.isRequired,    // 左侧图片地址
```
<div style={{ width: '73%', height: '100%', border: '1px solid white', padding: '20px' }}>
        <ImageCard
          showRightIcon={true}
          showStatusLogo={true}
          isCardClick={true}
          onCardClick={() => { console.log('click') }}
          contentList={[
            { label: '隐患描述', value: '地沟有积水' },
            { label: '上报', value: (<Fragment>马玉<span style={{ marginLeft: '1em' }}>2018-12</span></Fragment>) },
            { label: '计划整改', value: (<Fragment>马玉<span style={{ color: 'red', marginLeft: '1em' }}>2018-12</span></Fragment>) },
            { label: '检查点', value: (<Fragment>马玉<span style={{ marginLeft: '1em' }}>2018-12</span></Fragment>) },
          ]}
          photo='http://data.jingan-china.cn/v2/dashboard/home-safety.png'
        />
      </div>
```
