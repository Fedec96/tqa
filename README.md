# tqa

A strongly typed hooks library based on TanStack's React Query & Axios to perform common CRUD operations for dead simple RESTful HTTP requests.

## Table of contents

- [Requirements](#requirements)
- [Install](#install)
- [Quickstart](#quickstart)
- [Fundamentals](#fundamentals)
  - [TanStack's React Query](#tanstacks-react-query)
  - [Axios](#axios)
  - [Data](#data)
  - [TypeScript](#typescript)
- [Hooks](#hooks)
  - [Consumer](#consumer)
  - [CRUD](#crud)
    - [Retrieve, status](#retrieve-status)
      - [Retrieve (POST)](#retrieve-post)
      - [Retrieve on demand](#retrieve-on-demand)
    - [Create, update, partial update](#create-update-partial-update)
    - [Destroy](#destroy)
- [Pagination](#pagination)
  - [Infinite](#infinite)
    - [Infinite (POST)](#infinite-post)
  - [Directional](#directional)
    - [Directional (POST)](#directional-post)

## Requirements

- TanStack's React Query 5+
- Axios 1.6+

## Install

```bash
npm i tqa
```

## Quickstart

This library requires a default Axios instance in order to work. To provide said instance, wrap your application within `ConsumerProvider`, making sure it's already wrapped in TanStack's React Query's `QueryClientProvider`.

Example with Next.js and App Router:

```tsx
"use client";

import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Consumer, ConsumerProvider } from "tqa";

import type { ReactNode } from "react";

interface ProvidersProps {
  children?: ReactNode;
}

const http = axios.create();
const queryClient = new QueryClient();
const consumer = new Consumer(http);

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConsumerProvider consumer={consumer}>{children}</ConsumerProvider>
    </QueryClientProvider>
  );
}
```

## Fundamentals

This library represents my opinionated way of handling and standardizing common REST operations as much as possible, including different pagination strategies.

### TanStack's React Query

Every single query or mutation declared by mean of `tqa` will require a key. This is a personal preference of mine.

Since the whole query or mutation is completely handled by the hook of choice, it won't be possible to extend, override or customize the `queryFn`/`mutationFn` callback besides what's allowed by parameters and types. The rest of the hook's configuration will be left completely untouched so that it can be 100% handled by the library user.

### Axios

Every Axios instance is referenced as "consumer". Queries and mutations are only performed with Axios, which will always require an endpoint, either as `URL` instance or plain string.

No default configuration is provided to Axios out of the box - it can be fully handled by the library user.

### TypeScript

Each hook can be strongly typed to fit your needs, from the server's response to the URL parameters. All the hooks accept the same generics:

| Generic     | Description                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| `TResponse` | The type definition for the response from the server                                                       |
| `TParams`   | The type definition for a subset of URL parameters for Axios. Each field is recursively marked as optional |
| `TError`    | The type definition for the error response from the server                                                 |

Hooks that allow for different request methods accept an additional generic:

| Generic    | Description                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `TRequest` | The request's nature. This will enforce the request's method and adjust the hook's configuration |

Hooks designed for requests with a payload accept an additional generic:

| Generic    | Description                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `TPayload` | The type definition for the request's body. The passed type's field are recursively marked as optional for `PATCH` requests |

When the query/mutation fails, the error is raised by Axios:

| Source    | Type                           |
| --------- | ------------------------------ |
| Queries   | `AxiosError<TError, void>`     |
| Mutations | `AxiosError<TError, TPayload>` |

### Data

The `data` object exposed by each hook is what React Query returns from the fetcher/mutator.

Powered by Axios, it's enriched with more information:

| Attribute    | Type                                              | Description                                          |
| ------------ | ------------------------------------------------- | ---------------------------------------------------- |
| `response`   | `TResponse`                                       | The response returned by the server                  |
| `headers`    | `AxiosResponseHeaders \| RawAxiosResponseHeaders` | The response's headers                               |
| `status`     | `number`                                          | The response's status code                           |
| `statusText` | `string`                                          | The response's status message returned by the server |

## Hooks

Hooks receive separate configuration objects for TanStack's React Query and Axios. Each configuration's type adjusts according to the nature of the request you want to perform.

Basic example:

```ts
const bookId = "123";

const query = useRetrieve<"retrieve", BookRetrieve>(`/v1/book/${bookId}`, {
    reactQuery: { queryKey: ["book", bookId] },
    axios: { method: "get" },
  }
);
```

In addition, every hook accepts an optional `consumer` configuration object for when you want to perform requests with a completely different consumer without touching the default one you set in the provider. The configuration allows you to either switch to a generic, untouched instance:

```ts
const query = useRetrieve("...", {
    /* ... */
    consumer: {
      external: true,
      options: { /* ... */ },
    },
  }
);
```

Or pass your own:

```ts
const myConsumer = axios.create({ /* ... */ });

const query = useRetrieve("...", {
    /* ... */
    consumer: {
      instance: myConsumer,
      options: { /* ... */ },
    },
  }
);
```

### Consumer

When you need access to your global consumer from within React's components tree or hooks you can use `useConsumer`:

```ts
const consumer = useConsumer();
```

This will allow you to read the current default values and edit the consumer instance, although accessing its raw Axios instance would suffice for the latter case.

Consumer configuration:

| Field                                   | Type                   | Description                                                                                 |
| --------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| `mergeOptions?`                         | `boolean \| undefined` | Whether to merge the passed options with the default ones. Defaults to `false`              |
| `options?.paginator?.itemsPerPage?`     | `number \| undefined`  | The number of records per page. Defaults to `10`                                            |
| `options?.paginator?.limitParam?`       | `string \| undefined`  | The name of the limit parameter. Defaults to `"limit"`                                      |
| `options?.paginator?.offsetParam?`      | `string \| undefined`  | The name of the offset parameter. Defaults to `"offset"`                                    |
| `options?.paginator?.sendZeroOffset?`   | `boolean \| undefined` | Whether to include the offset parameter in the URL when the value is 0. Defaults to `false` |
| `options?.paginator?.initialPageParam?` | `number \| undefined`  | The initial offset parameter's value. Defaults to `0`                                       |

### CRUD

#### Retrieve, status

The `useRetrieve` hook can be used to perform `GET` and `HEAD` requests.

```ts
import { useRetrieve } from "tqa/hooks/crud";

const query = useRetrieve<"retrieve" | "status", TResponse, TParams, TError>(url, config);
```

##### Retrieve (POST)

The `useRetrievalCreate` hook is an alternate version of `useRetrieve` built specifically for performing `POST` requests behaving as `GET`s. Everything works as it does for `useRetrieve` with the addition of the payload's generic type `TPayload` and no need to specify `TRequest`.

```ts
import { useRetrievalCreate } from "tqa/hooks/crud/alt";

const query = useRetrievalCreate<TResponse, TPayload, TParams, TError>(url, config);
```

##### Retrieve on demand

The `useCreationalRetrieve` hook is an alternate version of `useRetrieve` built specifically for performing `GET` with mutation dynamics. Everything works as it does for `useRetrieve` except no request method can be passed.

```ts
import { useCreationalRetrieve } from "tqa/hooks/crud/alt";

const mutation = useCreationalRetrieve<TResponse, TParams, TError>(url, config);
```

#### Create, update, partial update

The `useCreateUpdate` hook can be used to perform `POST`, `PUT` and `PATCH` requests.

```ts
import { useCreateUpdate } from "tqa/hooks/crud";

const mutation = useCreateUpdate<"create" | "update" | "partialUpdate", TResponse, TPayload, TParams, TError>(url, config);
```

> For `"partialUpdate"` requests, each field in `TPayload` will be automatically and recursively marked as optional.

#### Destroy

The `useDestroy` hook can be used to perform `DELETE` requests only.

```ts
import { useDestroy } from "tqa/hooks/crud";

const mutation = useDestroy<TResponse, TParams, TError>(url, config);
```

## Pagination

The pagination hooks are built on top of the assumption that you will be interacting with a server that adopts the limit/offset approach rather than the more traditional page/size one.

Pagination hooks can be configured like the regular CRUD ones, with the addition of specific fields and callbacks that can be also used for templating. They accept the same generics like the other hooks, but keep in mind that `TResponse` is also responsible for defining your pagination structure. You can build custom wrappers to keep your code DRY as explained later.

You can customize one or more pagination default parameter(s) when you provide the `Consumer` instance.

Example with Next.js and App Router:

```tsx
"use client";
 
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Consumer, ConsumerProvider } from "tqa";

import type { ReactNode } from "react";

interface ProvidersProps {
  children?: ReactNode;
}

const http = axios.create();
const queryClient = new QueryClient();

const consumer = new Consumer(http, {
  paginator: {
    limitParam: "limit",
    offsetParam: "offset",
    itemsPerPage: 10,
    initialPageParam: 0,
    sendZeroOffset: false,
  },
});

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConsumerProvider consumer={consumer}>{children}</ConsumerProvider>
    </QueryClientProvider>
  );
}
```

> The values used in the example are also the default ones.

Each parameter can be individually set/overridden when declaring the hook of your choice.

The following paragraphs will use the following response type as example:

```ts
interface PaginationResponse<T = unknown> {
  count: number;
  previous: number | null;
  next: number | null;
  results: T[];
}
```

### Infinite

> tqa's "infinite" hooks rely on TanStack's React Query's `useInfiniteQuery` hook. The configuration for the React Query part remans the same except for the `initialPageParam` property, which is entirely handled by tqa.

The `useInfiniteRetrieve` hook is built for cumulative pagination ("load more" strategy).

```ts
import { useInfiniteRetrieve } from "tqa/hooks/pagination";

const infinite = useInfiniteRetrieve<PaginationResponse<TResponse>, TParams, TError>(url, config);
```

Additional configuration:

| Field              | Type                                 | Description                                                                                   |
| ------------------ | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `lookup.results`   | `(response: TResponse) => unknown[]` | Retrieves every page's record(s)                                                              |
| `lookup.total`     | `(response: TResponse) => number`    | Returns the field that indicates how many total records are available                         |

Along with what's returned by TanStack's React Query's `useInfiniteQuery` hook, provides additional fields:

| Field           | Type     | Description                                                   |
| --------------- | -------- | ------------------------------------------------------------- |
| `total.records` | `number` | The amount of all the available records that can be paginated |
| `total.fetched` | `number` | The cumulating amount of currently fetched records            |

If you want to standardize your pagination hook without having to pass the same types and configurations over and over, you can create a custom wrapper with the `UseInfiniteRetrieveFactory` type:

```ts
import { useInfiniteRetrieve, type UseInfiniteRetrieveFactory, type UseInfiniteRetrieveResult } from "tqa/hooks/pagination";

import type { Endpoint } from "tqa/types";
import type { PaginationResponse } from "./types";

export const useInfinitePagination = <
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseInfiniteRetrieveFactory<PaginationResponse<TResponse>, TParams, TError>
): UseInfiniteRetrieveResult<PaginationResponse<TResponse>, TError> =>
  useInfiniteRetrieve<PaginationResponse<TResponse>, TParams, TError>(url, {
    lookup: {
      results: ({ results }) => results,
      total: ({ count }) => count,
    },

    ...config,

    reactQuery: {
      getNextPageParam: ({ response: { next } }) => next || undefined,
      ...config.reactQuery,
    },
  });
```

#### Infinite (POST)

The `useInfiniteCreate` hook is an alternate version of `useInfiniteRetrieve` built specifically for when the server you are querying to expects pagination through POST requests. Everything works as it does for `useInfiniteRetrieve` with the addition of the payload's generic type `TPayload`.

A custom wrapper can be built with the `UseInfiniteCreateFactory` type, which takes `TPayload` in addition.

```ts
import { useInfiniteCreate, type UseInfiniteCreateFactory, type UseInfiniteCreateResult } from "tqa/hooks/pagination/alt";

export const useInfinitePagination = <
  TResponse = unknown,
  TPayload = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseInfiniteCreateFactory<PaginationResponse<TResponse>, TPayload, TParams, TError>
): UseInfiniteCreateResult<PaginationResponse<TResponse>, TPayload, TError> =>
  useInfiniteCreate<PaginationResponse<TResponse>, TPayload, TParams, TError>(url, config);
```

### Directional

The `useDirectionalRetrieve` hook is built for directional pagination ("previous"/"next" strategy).

```ts
import { useDirectionalRetrieve } from "tqa/hooks/pagination";

const query = useDirectionalRetrieve<PaginationResponse<TResponse>, TParams, TError>(url, config);
```

Additional configuration:

| Field               | Type                                                                                                                      | Description                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `hasPreviousPage`   | `(response: TResponse, limit: number, offset: number) => boolean`                                                         | Determines whether there's a previous page                                                         |
| `hasNextPage`       | `(response: TResponse, limit: number, offset: number) => boolean`                                                         | Determines whether there's a next page                                                             |
| `getPreviousOffset` | `(response: TResponse, limit: number, offset: number, hasPrevPage: boolean, hasNextPage: boolean) => number \| undefined` | Retrieves the previous offset, if available                                                        |
| `getNextOffset`     | `(response: TResponse, limit: number, offset: number, hasPrevPage: boolean, hasNextPage: boolean) => number \| undefined` | Retrieves the next offset, if available                                                            |
| `getIntervalFrom?`  | `(response: TResponse, limit: number, offset: number, hasPrevPage: boolean, hasNextPage: boolean) => number \| undefined` | Determines the currently viewed interval's "from" index. If provided, `getIntervalTo` is mandatory |
| `getIntervalTo?`    | `(response: TResponse, limit: number, offset: number, hasPrevPage: boolean, hasNextPage: boolean) => number \| undefined` | Determines the currently viewed interval's "to" index. If provided, `getIntervalFrom` is mandatory |

Along with what's returned by TanStack's React Query's `useQuery` hook, provides additional fields:

| Field               | Type                                        | Description                                                             |
| ------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `hasPreviousPage`   | `boolean`                                   | Whether the user can navigate backwards                                 |
| `hasNextPage`       | `boolean`                                   | Whether the user can navigate forward                                   |
| `fetchPreviousPage` | `() => void`                                | Fetches the previous page, if available                                 |
| `fetchNextPage`     | `() => void`                                | Fetches the next page, if available                                     |
| `interval`          | `{ from: number, to: number } \| undefined` | Shows the currently viewed interval ("from"/"to" indexes) if configured |

> The navigation control functions will take care of checking if the navigation can be performed by first checking if the data is still being retrieved, or if the page that is being requested is actually available, so that you don't have to.

If you want to standardize your pagination hook without having to pass the same types and configurations over and over, you can create a custom wrapper with the `UseDirectionalRetrieveFactory` type:

```ts
import { keepPreviousData } from "@tanstack/react-query";
import { useDirectionalRetrieve, type UseDirectionalRetrieveFactory, type UseDirectionalRetrieveResult } from "tqa/hooks/pagination";

import type { Endpoint } from "tqa/types";
import type { PaginationResponse } from "./types";

export const useDirectionalPagination = <
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseDirectionalRetrieveFactory<PaginationResponse<TResponse>, TParams, TError>
): UseDirectionalRetrieveResult<PaginationResponse<TResponse>, TError> =>
  useDirectionalRetrieve<PaginationResponse<TResponse>, TParams, TError>(url, {
    hasPreviousPage: ({ previous }) => typeof previous === "number",
    hasNextPage: ({ next }) => typeof next === "number",
    getPreviousOffset: ({ previous }) => previous ?? undefined,
    getNextOffset: ({ next }) => next || undefined,

    // Optional
    getIntervalFrom: ({ results }, _, offset) => results.length ? offset + 1 : 0,
    getIntervalTo: ({ results }, _, offset) => results.length + offset,

    ...config,

    // Recommended
    reactQuery: { placeholderData: keepPreviousData, ...config.reactQuery },
  });
```

#### Directional (POST)

The `useDirectionalCreateCreate` hook is an alternate version of `useDirectionalCreateRetrieve` built specifically for when the server you are querying to expects pagination through POST requests. Everything works as it does for `useDirectionalCreateRetrieve` with the addition of the payload's generic type `TPayload`.

A custom wrapper can be built with the `UseDirectionalCreateFactory` type, which takes `TPayload` in addition.

```ts
import { useDirectionalCreate, type UseDirectionalCreateFactory, type UseDirectionalCreateResult } from "tqa/hooks/pagination/alt";

import type { Endpoint } from "tqa/types";
import type { PaginationResponse } from "./types";

export const useDirectionalPagination = <
  TResponse = unknown,
  TPayload = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseDirectionalCreateFactory<PaginationResponse<TResponse>, TPayload, TParams, TError>
): UseDirectionalCreateResult<PaginationResponse<TResponse>, TPayload, TError> =>
  useDirectionalCreate<PaginationResponse<TResponse>, TPayload, TParams, TError>(url, config);
```
