export class ParticipationAlreadyExists extends Error {
  constructor() {
    super('Participant can only register once per webinar');
    this.name = 'ParticipationAlreadyExists';
  }
}
