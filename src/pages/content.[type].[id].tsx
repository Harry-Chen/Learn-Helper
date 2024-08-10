import type { ContentType } from 'thu-learn-lib';

import { useParams } from '../router';
import ContentDetail from '../components/ContentDetail';
import { useAppSelector } from '../redux/hooks';

export default function Content() {
  const { type, id } = useParams('/content/:type/:id');

  const content = useAppSelector((state) => state.data[`${type as ContentType}Map`][id]);

  return content && <ContentDetail content={content} />;
}
