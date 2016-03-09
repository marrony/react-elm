
export default class Action {
  constructor(type) {
    this.type = type;
  }

  static wrapped(type, extra) {
    return function(wrapped) {
      return Object.assign(new Action(type), {wrapped}, extra); 
    }
  }
}

