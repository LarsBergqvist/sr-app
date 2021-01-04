import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EpisodesListComponent } from './episodes-list.component';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html'
})
export class EpisodesComponent implements OnInit, OnDestroy {
  selectedProgramId: number;

  @ViewChild(EpisodesListComponent) list: EpisodesListComponent;

  constructor(private readonly storageService: LocalStorageService) {}

  ngOnInit(): void {
    const oldState = this.storageService.get('EpisodesComponent');
    if (oldState) {
      //      this.selectedProgramId = oldState;
    }
  }

  ngOnDestroy(): void {
    this.storageService.set('EpisodesComponent', this.selectedProgramId);
  }

  onProgramChanged(programId: number) {
    this.selectedProgramId = programId;
    if (this.list) {
      this.list.fetch(this.selectedProgramId, 0);
    }
  }
}
