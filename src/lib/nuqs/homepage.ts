import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
} from "nuqs/server";

const searchParams = {
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  q: parseAsString.withDefault(""),
  category: parseAsString,
  limit: parseAsNumberLiteral([10, 20, 30, 40, 50]).withDefault(10),
};

const cache = createSearchParamsCache(searchParams);

const serializer = createSerializer(searchParams);

const homepageNuqs = { cache, serializer };

export default homepageNuqs;
