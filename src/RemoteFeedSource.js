import FeedSource from './FeedSource';

export default class RemoteFeedSource extends FeedSource {
  async init(address) {
    await super.init(address);
  }

  async getOne(hash) {
    return await this.db.get(hash);
  }

  async getAll() {
    return await this.db
      .iterator({ limit: -1 })
      .collect()
      .map((e) => e.payload.value);
  }
}