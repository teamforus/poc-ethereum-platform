import { Key } from '@utils/vault/key';

export class Identity {
  name: string;
  address: string;
  keys: Key[] = new Array<Key>();
}
