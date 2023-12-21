import { PATH_SEP } from "../../utils/misc/misc";

type Sep = typeof PATH_SEP;

type PathDeep<T, Key extends keyof T> = Key extends string
  ? T[Key] extends object
    ?
        | `${Key}${Sep}${PathDeep<
            T[Key],
            Exclude<keyof T[Key], keyof unknown[]>
          > &
            string}`
        | `${Key}${Sep}${Exclude<keyof T[Key], keyof unknown[]> & string}`
    : never
  : never;

type Path<T> = PathDeep<T, keyof T> | keyof T;
export type KeyChain<T> = Path<T> extends string | keyof T ? Path<T> : keyof T;
export type Endpoint = string | URL;
