export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Endpoint = string | URL;
export type KeysOf<T> = T extends T ? keyof T : never;

type RequireNone<KeysType extends PropertyKey> = Partial<
  Record<KeysType, never>
>;

type RequireAll<ObjectType, KeysType extends keyof ObjectType> = Required<
  Pick<ObjectType, KeysType>
>;

export type RequireAllOrNone<
  ObjectType,
  KeysType extends keyof ObjectType = never
> = (RequireAll<ObjectType, KeysType> | RequireNone<KeysType>) &
  Omit<ObjectType, KeysType>;
