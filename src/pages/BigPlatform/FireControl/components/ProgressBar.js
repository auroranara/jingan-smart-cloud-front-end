import React, { PureComponent } from 'react';

export default function ProgressBar(props) {
  const { width, height, progress } = props;
  let progressWidth = typeof width === 'number' ? progress * width / 100 : `${Number.parseInt(width) * progress / 100}%`;

  return (
    <div style={{ width, height, background: '#FFF', position: 'relative', borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{ width: progressWidth, height, background: 'rgb(0,168,255)', position: 'absolute', left: 0, top: 0, borderRadius: height / 2 }}></div>
    </div>
  );
}
