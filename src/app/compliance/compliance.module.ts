import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';
import { Page5Component } from './page5/page5.component';
import { ComplianceComponent } from './compliance.component';
import { MaterialModule } from '../shared/material/material.module';
import { TypingAnimatorModule } from 'angular-typing-animator'
import { ReactiveFormsModule } from '@angular/forms';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EmojiAnimationComponent } from './emoji-loader/emoji-loader.component';



@NgModule({
  declarations: [
    Page1Component,
    Page2Component,
    Page3Component,
    Page4Component,
    Page5Component,
    ComplianceComponent,
    TextEditorComponent,
    EditDialogComponent,
    EmojiAnimationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TypingAnimatorModule,
    ReactiveFormsModule,
    MatSlideToggleModule

  ],
  exports:[
    ComplianceComponent,
    TextEditorComponent,
    EditDialogComponent,
    EmojiAnimationComponent
  ]
})
export class ComplianceModule { }
