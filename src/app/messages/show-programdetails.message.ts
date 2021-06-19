import { Message } from './message';

export class ShowProgramDetailsMessage extends Message {
  programId: number;
  constructor(programId: number) {
    super();
    this.programId = programId;
  }

  get Type(): string {
    return 'ShowProgramDetailsMessage';
  }
}
