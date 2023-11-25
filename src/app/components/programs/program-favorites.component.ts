import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FavoriteChangedMessage } from 'src/app/messages/favorite-changed.message';
import { ShowProgramDetailsMessage } from 'src/app/messages/show-programdetails.message';
import { Program } from 'src/app/models/program';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { ProgramsService } from 'src/app/services/programs.service';

@Component({
  selector: 'app-program-favorites',
  templateUrl: './program-favorites.component.html',
  styleUrls: ['./program-favorites.component.scss']
})
export class ProgramFavoritesComponent implements OnInit {
  programs: Program[];
  totalHits = 0;
  pageSize = 100;
  private unsubscribe$ = new Subject();

  constructor(
    private readonly service: ProgramsService,
    private readonly broker: MessageBrokerService
  ) {}

  ngOnInit(): void {
    const messages = this.broker.getMessage();
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof FavoriteChangedMessage)
      )
      .subscribe((message: FavoriteChangedMessage) => {
        this.fetch();
      });

      this.fetch();
  }

  async fetch() {
    this.programs = await this.service.fetchAllFavoritePrograms();
  }

  onProgramDetails(program: Program) {
    this.broker.sendMessage(new ShowProgramDetailsMessage(program.id));
  }
}
