import { TestBed } from '@angular/core/testing';

import { IdentityVaultService } from './identity-vault.service';

describe('IdentityVaultService', () => {
  let service: IdentityVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentityVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
