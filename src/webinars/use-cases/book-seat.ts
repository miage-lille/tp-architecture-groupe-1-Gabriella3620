import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { WebinarNotFound } from '../exceptions/webinar-not-found';
import { WebinarNotEnoughSeatsException } from '../exceptions/webinar-not-enough-seats';
import { ParticipationAlreadyExists } from '../exceptions/participation-already-exists';
import { Participation } from '../entities/participation.entity';
import { WebinarOrganizerNotFound } from '../exceptions/webinar-organizer-not-found';

type Request = {
  webinarId: string;
  user: User;
};
type Response = void;

export class BookSeat implements Executable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly webinarRepository: IWebinarRepository,
    private readonly mailer: IMailer,
  ) {}
  async execute({ webinarId, user }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new WebinarNotFound();
    }
    if (webinar.hasNotEnoughSeats()) {
      throw new WebinarNotEnoughSeatsException();
    }
    const participations =
      await this.participationRepository.findByWebinarId(webinarId);
    if (participations.find((p) => p.isSameUser(user.initialState.id))) {
      throw new ParticipationAlreadyExists();
    }
    const participation = new Participation({
      userId: user.initialState.id,
      webinarId,
    });
    await this.participationRepository.save(participation);
    const organizer = await this.userRepository.findById(
      webinar.initialState.organizerId,
    );
    if (!organizer) {
      throw new WebinarOrganizerNotFound();
    }
    await this.mailer.send({
      to: organizer.initialState.email,
      subject: 'New seat booked',
      body: `A new participant booked a seat for the webinar "${webinar.initialState.title}"`,
    });
  }
}
