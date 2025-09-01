import { useParams } from 'wouter';

import ContentDetail from '../components/ContentDetail';
import { useAppSelector } from '../redux/hooks';
import type { SupportedContentType } from '../types/data';

export default function Content() {
  const { type, id } = useParams();

  const content = useAppSelector((state) =>
    type && id ? state.data[`${type as SupportedContentType}Map`][id] : undefined,
  );

  return content && <ContentDetail content={content} />;
}
