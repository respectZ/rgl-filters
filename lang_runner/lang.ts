export class Lang {
  #data: Map<string, string | undefined> = new Map();
  constructor() {}
  static parse(text: string) {
    const lang = new Map();
    for (const line of text.split(/\r?\n/)) {
      let [key, value] = line.split("=");
      if (lang.has(key)) {
        key = `__${lang.size}__${key}`;
      }
      lang.set(key, value);
    }
    const instance = new Lang();
    instance.#data = lang;
    return instance;
  }
  stringify() {
    let str = "";
    for (const [key, value] of this.#data) {
      str += `${key.replace(/^__\d+__/, "")}`;
      if (value) {
        str += `=${value}`;
      }
      str += "\n";
    }
    // remove last newline
    str = str.slice(0, -1);
    return str;
  }
  set(key: string, value: string) {
    this.#data.set(key, value);
  }
  get(key: string) {
    return this.#data.get(key);
  }
  [Symbol.iterator]() {
    return this.#data[Symbol.iterator]();
  }
}
