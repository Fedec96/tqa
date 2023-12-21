export type Endpoint = string | URL;
export type KeysOfUnion<T> = T extends T ? keyof T : never;
