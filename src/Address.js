
export default class Address {
  constructor(mailbox) {
    this.mailbox = mailbox;
  }

  static forwardTo(address, wrapperFn) {
    return new Address(function(message) {
      Address.send(address, wrapperFn(message));
    });
  }

  static send(address, message) {
    address.mailbox(message);
  }
}

