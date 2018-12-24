# props属性详情
* wrapperClassName 容器类名
* wrapperStyle 容器样式
* className 四色图元素类名
* style 四色图元素样式
* src={src} 四色图地址
* perspective="30em" 景深，默认为30em
* rotate="45deg" 旋转角度，默认为45deg

# 使用示例
<RiskImg
  src={this.props.src}
>
  {list.map(item => item)}
</RiskImg>
