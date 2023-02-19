import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiLoaderComponent } from './emoji-loader.component';

describe('EmojiLoaderComponent', () => {
  let component: EmojiLoaderComponent;
  let fixture: ComponentFixture<EmojiLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmojiLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmojiLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
