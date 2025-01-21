import { Participation } from 'src/webinars/entities/participation.entity';
import { IParticipationRepository } from '../ports/participation-repository.interface';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  private readonly participations: Participation[] = [];

  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    return this.participations.filter((participation) =>
      participation.isSameWebinar(webinarId),
    );
  }

  async save(participation: Participation): Promise<void> {
    this.participations.push(participation);
  }
}
