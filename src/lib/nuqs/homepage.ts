import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

const searchParams = {
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  q: parseAsString,
};

const cache = createSearchParamsCache(searchParams);

const serializer = createSerializer(searchParams);

const homepageNuqs = { cache, serializer };

export default homepageNuqs;
