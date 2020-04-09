import React, { useState } from 'react';
import EmptyText from '@/jingan-components/View/EmptyText';
import ImagePreview from '@/jingan-components/ImagePreview';
import classNames from 'classnames';
import styles from './index.less';

export default function FileList({
  className,
  style,
  value,
  type,
  empty = <EmptyText />,
  ellipsis = true,
}) {
  const [preview, setPreview] = useState(undefined);
  return value && value.length ? (
    type !== 'picture' ? (
      <div className={classNames(styles.container, className)} style={style}>
        {value.map(({ webUrl, fileName }, index) => (
          <div key={index} className={ellipsis ? styles.item : undefined}>
            <a
              className={styles.clickable}
              href={webUrl}
              title={fileName}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fileName}
            </a>
          </div>
        ))}
      </div>
    ) : (
      <div className={classNames(styles.pictureContainer, className)} style={style}>
        {value.map(({ webUrl, fileName }, index) => (
          <div className={styles.pictureWrapper} key={index}>
            <img
              className={styles.picture}
              src={webUrl}
              alt={fileName}
              title={fileName}
              onClick={() =>
                setPreview(preview => ({
                  ...preview,
                  currentImage: index,
                  images: value.map(({ webUrl }) => webUrl),
                }))
              }
            />
          </div>
        ))}
        <ImagePreview {...preview} />
      </div>
    )
  ) : (
    empty
  );
}
