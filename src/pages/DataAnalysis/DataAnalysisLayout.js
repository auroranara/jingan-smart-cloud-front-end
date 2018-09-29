import React, { PureComponent } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

export default function DataAnalysisLayout(props) {
  return (
    <PageHeaderLayout
        title="用户传输装置"
        // breadcrumbList={breadcrumbList}
        content={
          <div>
            layout
          </div>
        }
      >
        {props.children}
      </PageHeaderLayout>
  );
}
