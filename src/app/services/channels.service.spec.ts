import { TestBed } from "@angular/core/testing";

import { ChannelsService } from "./channels.service";
import { HttpClient } from "@angular/common/http";

describe("ChannelsService", () => {
  let httpClient: any;

  beforeEach(() => {
    httpClient = {
      get: jasmine.createSpy("get")
    };

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }]
    });
  });

  it("should be created", () => {
    const service: ChannelsService = TestBed.get(ChannelsService);
    expect(service).toBeTruthy();
  });
});
