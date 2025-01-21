export class WebinarOrganizerNotFound extends Error {
  constructor() {
    super('Webinar must have an organizer');
    this.name = 'WebinarNotFound';
  }
}
