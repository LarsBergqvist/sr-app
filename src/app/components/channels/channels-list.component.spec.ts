import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChannelsListComponent } from './channels-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SRApiService } from '../../services/srapi.service';

describe('ChannelsListComponent', () => {
  let component: ChannelsListComponent;
  let fixture: ComponentFixture<ChannelsListComponent>;
  let service: any;

  beforeEach(
    waitForAsync(() => {
      service = {
        getChannels: jasmine.createSpy('getChannels')
      };
      TestBed.configureTestingModule({
        declarations: [ChannelsListComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: SRApiService, useValue: service }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
