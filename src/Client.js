import LocalFeedSource from './LocalFeedSource';
import TimeLineController from './TimeLineController';

console.log('hhhhhhhhhhhhhhhhhhhhhhh')
export default class Client {
  constructor(handler, isCousumer) {
    this.handler = handler;
    this.isCousumer = isCousumer
    if (!isCousumer) {
      this.localSource = new LocalFeedSource(this.handler);
    }
    this.timelineController = new TimeLineController();
  }

  async init() {
    if (!this.isCousumer) {
      await this.localSource.init('messages');
      await this.timelineController.addBySrouce(this.localSource);
    }
  }

  async newMessage(message) {
    const o = { 
      t: Date.now(),
      message, 
      handler: this.handler 
    };
    return await this.localSource.add(o);
  }

  async getTimeline() {
    return await this.timelineController.getTimeline();
  }

  async follow(address) {
    await this.timelineController.addByAddress(address);
  }

  async unfollow(address) {
    this.timelineController.removeByAddress(address);
  }

  getFollowings() {
    return this.timelineController.getFollowings();
  }

  getAddress() {
    if (this.localSource) {
      return this.localSource.getAddress();
    }
    return 'consumer';
  }
}