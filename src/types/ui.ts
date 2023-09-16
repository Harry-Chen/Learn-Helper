import type { ContentInfo } from './data';

interface ICardProps {
  content: ContentInfo;
}

export type CardProps = ICardProps;

export type ColorMode = 'system' | 'light' | 'dark';
