import { lazy, ComponentType } from 'react';

export function lazyLoad<T extends ComponentType<any>>(path: string): T {
  return lazy(() => import(`../${path}`).then(module => ({ default: module.default as T }))) as T;
}
