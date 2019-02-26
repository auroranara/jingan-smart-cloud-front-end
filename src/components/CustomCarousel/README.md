## 组件可选参数
| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器样式 | object | - |
| carouselProps | Carousel组件可设置参数对象 | object | - |

## Carousel组件可选参数
| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 添加在.slick-slider元素上的类名 | string | - |
| autoplay | 是否开启自动播放功能 | boolean | false |
| autoplaySpeed | 自动播放间隔时间，单位为毫秒 | number | 3000 |
| speed | 动画时长，单位为毫秒 | number | 500 |
| easing | 动画速度曲线 | string | linear |
| effect | 动画效果，可选scrollx，fade | string | scrollx |
| dots | 是否显示面板指示点 | boolean | true |
| dotsClass | 添加在面板指示点容器上的类名 | string | slick-dots |
| appendDots/renderDots | 自定义面板指示点容器 | (dots) => ReactNode | dots => <ul>{dots}</ul> |
| customPaging/renderDot | 面板指示点模板 | (index) => ReactNode | index => <button>{index + 1}</button> |
| vertical | 是否垂直显示 | boolean | false |
| accessibility | 是否开启方向键切换 | boolean | true |
| asNavFor | 将另一个Carousel组件实例作为参数值可以实现同步操作 | ref | - |
| centerMode | 当前索引是否显示在中间，配合slidesToShow参数使用 | boolean | false |
| slidesToShow | 一个框中同时显示多少元素 | number | 1 |
| centerPadding | 当centerMode为true时两边的内边距,大于0px时会显示前后元素的一部分 | string | 50px |
| draggable | 是否开启拖拽功能 | boolean | false |
| focusOnSelect | 点击非当前索引元素时自动切换点击元素索引为当前索引 | boolean | false |
| infinite | 是否开启无限循环 | boolean | true |
| initialSlide | 初始索引 | number | 0 |
| lazyLoad | 是否对图片或组件使用懒加载 | boolean | false |
| pauseOnDotsHover | 移动到指示点上时是否停止自动播放 | boolean | false |
| pauseOnFocus | 聚焦到元素上时是否停止自动播放 | boolean | false |
| pauseOnHover | 移动到轨道上时是否停止自动播放 | boolean | true |
| rows | 分成多少行显示 | number | 1 |
| rtl | 反向顺序显示元素 | boolean | false |
| slide | 元素项的容器类型 | string | div |
| slidesPerRow | 和rows参数一起使用，设置每行显示数量 | number | 1 |
| slidesToScroll | 一次移动多少个元素 | number | 1 |
| swipeToSlide | 是否允许拖动元素无视slidesToScroll参数 | boolean | false |
| touchMove | 是否允许触摸移动 | boolean | true |
| touchThreshold | 触摸阈值 | number | 5 |
| useCSS | 是否使用css的transition属性实现过渡效果 | boolean | true |
| useTransform | 是否使用css的transform属性 | boolean | true |
| variableWidth | 是否保留元素设置的width属性 | boolean | false |
| --事件-- |
| afterChange | 索引改变后的回调 | function(index) | - |
| beforeChange | 索引改变前的回调 | function(prevIndex, index) | - |
| onInit | componentWillMount生命周期的回调函数 | function | - |
| onReInit | componentDidUpdate生命周期的回调函数 | function | - |
| onLazyLoad | 元素懒加载的回调函数，参数为加载的索引数组 | function(slidesLoaded) | - |
| onSwipe | 拖拽改变索引的回调函数 | function(direction) | - |
| --以下为作用未知的参数-- |
| adaptiveHeight | 让.slick-list元素自适应内容的高度 | boolean | false |
| arrows | 未知 | boolean | true |
| responsive | 自定义断点设置 | array | - |
| swipe | 是否允许通过swipe的方式改变索引 | array | - |
| onEdge | Edge dragged event in finite case | function(direction) | - |

## 如何获取Carousel组件实例
1. 设置组件本身的ref参数
```
<CustomCarousel ref={(instance) => {this.carousel = instance.carousel;}}>
```
2. 设置carouselProps参数的ref属性
```
<CustomCarousel carouselProps={{ ref: (carousel) => {this.carousel = carousel;} }}>
```

## customPaging参数的应用
1. 返回img元素作为缩略图
```
customPaging: (i) => {
  return (
    <a>
      <img src={`${baseUrl}/abstract0${i + 1}.jpg`} />
    </a>
  );
},
```
