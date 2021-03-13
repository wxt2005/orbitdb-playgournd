import RemoteFeedSource from './RemoteFeedSource';

export default class TimeLineController {
  constructor() {
    this.sourceMap = new Map();
  }

  async addByAddress(address) {
    if (this.sourceMap.has(address)) {
      console.error(`Address: ${address} is already exists`)
      return;
    }

    const remoteSource = new RemoteFeedSource();
    await remoteSource.init(address);
    this.addBySrouce(remoteSource);
  }

  addBySrouce(source) {
    this.sourceMap.set(source.getAddress().toString(), source);
  }

  removeByAddress(address) {
    this.sourceMap.delete(address);
  }

  async getTimeline() {
    console.log(this.sourceMap);
    let results = [];
    for (const source of this.sourceMap.values()) {
      const items = await source.getAll();
      console.log(items);
      results = [...results, ...items]
    }
    return results;
  }

  getFollowings() {
    return this.sourceMap.keys();
  }
}