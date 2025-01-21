export class WebinarNotFound extends Error {
  constructor() {
    super('Webinar must exist to operate on it');
    this.name = 'WebinarNotFound';
  }
}
