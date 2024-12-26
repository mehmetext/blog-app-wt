import {
  createSearchParamsCache,
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
} from "nuqs/server";

const searchParams = {
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  q: parseAsString.withDefault(""),
  category: parseAsString,
  limit: parseAsNumberLiteral([10, 20, 30, 40, 50]).withDefault(10),
  sortBy: parseAsString.withDefault("createdAt"),
  sortDesc: parseAsBoolean.withDefault(true),
};

const cache = createSearchParamsCache(searchParams);

const serializer = createSerializer(searchParams);

const postsNuqs = { cache, serializer };

export default postsNuqs;
