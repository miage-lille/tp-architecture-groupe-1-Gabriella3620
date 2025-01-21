import { Entity } from 'src/shared/entity';

type Props = {
  userId: string;
  webinarId: string;
};

export class Participation extends Entity<Props> {
  isAlreadyRegistered({ userId, webinarId }: Props) {
    return this.props.userId === userId && this.props.webinarId === webinarId;
  }
  isSameWebinar(webinarId: string) {
    return this.props.webinarId === webinarId;
  }
  isSameUser(userId: string) {
    return this.props.userId === userId;
  }
}
