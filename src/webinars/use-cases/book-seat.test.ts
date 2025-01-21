import { InMemoryWebinarRepository } from 'src/webinars/adapters/webinar-repository.in-memory';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { InMemoryUserRepository } from '../../users/adapters/user-repository.in-memory';
import { InMemoryParticipationRepository } from '../adapters/participation-repository.in-memory';
import { IWebinarRepository } from '../ports/webinar-repository.interface';
import { IMailer } from '../../core/ports/mailer.interface';
import { BookSeat } from './book-seat';
import { User } from '../../users/entities/user.entity';
import { Participation } from '../entities/participation.entity';

describe('Feature: Book seat', () => {
  let useCase: BookSeat;
  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
  let webinarRepository: IWebinarRepository;
  let mailer: IMailer;

  const userAlice = new User({
    id: 'user-alice-id',
    email: 'alice@wonderland.com',
    password: 'nice-try-fbi',
  });
  const userBob = new User({
    id: 'user-bob-id',
    email: 'bob@wonderland.com',
    password: 'bien-essayé-dgsi',
  });

  const payloadSeat = {
    webinarId: 'id-1',
    user: userBob,
  };
  const webinar = new Webinar({
    id: 'id-1',
    organizerId: 'user-alice-id',
    title: 'Webinar ddd',
    startDate: new Date('2024-01-10T10:00:00.000Z'),
    endDate: new Date('2024-01-10T11:00:00.000Z'),
    seats: 100,
  });
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    participationRepository = new InMemoryParticipationRepository();
    webinarRepository = new InMemoryWebinarRepository();
    mailer = {
      send: jest.fn(),
    };
    useCase = new BookSeat(
      participationRepository,
      userRepository,
      webinarRepository,
      mailer,
    );
  });
  function expectParticipationEquals(participation: Participation[]) {
    expect(participation[0]).toEqual({
      props: {
        webinarId: 'id-1',
        userId: 'user-bob-id',
      },
      initialState: {
        webinarId: 'id-1',
        userId: 'user-bob-id',
      },
    });
  }
  describe('Scenario: happy path', () => {
    it('should book a seat for the user', async () => {
      await userRepository.create(userAlice);
      await userRepository.create(userBob);
      await webinarRepository.create(webinar);
      await useCase.execute(payloadSeat);
      const participations =
        await participationRepository.findByWebinarId('id-1');
      expectParticipationEquals(participations);
    });
  });
});
