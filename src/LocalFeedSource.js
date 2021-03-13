import FeedSource from './FeedSource';

export default class LocalFeedSource extends FeedSource {
  async init(name) {
    this.name = name;
    await super.init(name);
  }

  async add(obj) {
    return await this.db.add(obj, { pin: true });
  }

  async getOne(hash) {
    return await this.db.get(hash);
  }

  async removeOne(hash) {
    return await this.db.remove(hash);
  }

  async getAll() {
    return await this.db
      .iterator({ limit: -1 })
      .collect()
      .map((e) => {
        return {
          hash: e.hash,
          ...e.payload.value
        };
      });
  }

  getName() {
    return this.name;
  }
}