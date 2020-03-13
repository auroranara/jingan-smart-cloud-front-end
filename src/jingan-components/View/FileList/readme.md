# FileList

## 属性

| 属性名 | 说明 | 类型 | 默认值 |
| :- | :- | :- | :- |
| value | 文件列表受控值 | array | - |
| type | 表现形式，可选`file`，`image`（暂未完成） | string | 'file' |
| empty | 空值时显示的元素 | ReactNode | - |

## 示例

```javascript
import FileList from '@/jingan-components/File/FileList';

<FileList
  value={this.state.fileList}
  type="image"
  empty={<Empty />}
/>
```