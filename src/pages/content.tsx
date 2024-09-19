import type { ContentType } from 'thu-learn-lib';
import { useParams } from 'wouter';

import ContentDetail from '../components/ContentDetail';
import { useAppSelector } from '../redux/hooks';

export default function Content() {
  const { type, id } = useParams();

  const content = useAppSelector((state) =>
    type && id ? state.data[`${type as ContentType}Map`][id] : undefined,
  );

  return content && <ContentDetail content={content} />;
}
