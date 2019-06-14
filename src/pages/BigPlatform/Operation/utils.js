export { genCardsInfo } from '@/pages/BigPlatform/Smoke/utils';

export function getStatusImg(list, imgs) {
  let i = 0;
  for(; i < list.length; i++) {
    if (list[i])
      return imgs[i];
  }
  return imgs[i];
}
