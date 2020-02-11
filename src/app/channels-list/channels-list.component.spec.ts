import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsListComponent } from './channels-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChannelsService } from '../channels.service';

describe('ChannelsListComponent', () => {
    let component: ChannelsListComponent;
    let fixture: ComponentFixture<ChannelsListComponent>;
    let service: any;

    beforeEach(async(() => {
        service = {
            getChannels: jasmine.createSpy('getChannels')
        };
        TestBed.configureTestingModule({
            declarations: [ChannelsListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: ChannelsService, useValue: service }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChannelsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
