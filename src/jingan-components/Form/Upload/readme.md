# Upload

## 属性

| 属性名 | 说明 | 类型 | 默认值 |
| :- | :- | :- | :- |
| value | 文件列表受控值 | array | - |
| onChange | 文件列表发生变化时的回调 | function(value) | - |
| folder | 文件存放目录 | string | 'file' |
| limitLength | 文件列表的限制数量，默认不做限制 | number | - |
| limitType | 文件的限制类型，如`['PNG', 'JPG']`，默认不做限制 | array | - |
| limitSize | 文件的限制大小，单位为kb，默认不做限制 | number | - |
以及其他antd/Upload支持的属性

## 示例

```javascript
import Upload from '@/jingan-components/Form/Upload';

<Upload
  value={this.state.fileList}
  onChange={fileList => this.setState({ fileList })}
  folder="test"
  limitLength={10}
  limitType={['PNG', 'JPG']}
  limitSize={1024}
/>
```