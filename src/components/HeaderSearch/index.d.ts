import * as React from 'react';
export interface IHeaderSearchProps {
  placeholder?: string;
  dataSource?: string[];
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  onPressEnter?: (value: string) => void;
  style?: React.CSSProperties;
<<<<<<< HEAD
  className?: string;
=======
>>>>>>> init
}

export default class HeaderSearch extends React.Component<IHeaderSearchProps, any> {}
