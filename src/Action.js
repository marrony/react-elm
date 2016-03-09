
export default class Action {
  constructor(type) {
    this.type = type;
  }

  static wrapper(type, extra) {
    return function(wrapped) {
      return Object.assign(new Action(type), {wrapped}, extra); 
    }
  }
}

