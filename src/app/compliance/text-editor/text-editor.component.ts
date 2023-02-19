import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, OnInit, ViewChild,NgZone, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  @Input() editDoc!: string;
  isEditing: boolean = false;
  editForm: FormGroup;
  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize | undefined;
  @Output() editedText = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,private _ngZone: NgZone) {
    this.editForm = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.triggerResize() 
    this.editForm = this.formBuilder.group({
      text: ['', Validators.required]
    });
    console.log(this.editDoc)
    this.editForm.get("text")?.setValue(this.editDoc)
  }

  // Called when the user clicks the "Edit" button
  onEdit() {
    // Set the text in the form to the current document
    console.log("EDIT")
    this.editForm.get('text')?.setValue(this.editDoc);

    // Open the edit dialog
    this.dialog
      .open(EditDialogComponent, {
        data: {
          form: this.editForm
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result === 'save') {
          // If the user clicked "Save", update the document with the edited text
          this.editDoc = this.editForm.get('text')?.value;
        }
      });
  }

  // Called when the user clicks the "Cancel" button
  onCancel() {
    this.isEditing = false;
  }
  onSave(){
    console.log(this.editForm)
    this.editedText.emit(this.editForm.get('text')?.value);
    this.isEditing = false;
  }
  toggleEditing() {
    this.isEditing = !this.isEditing;
  }
  triggerResize() {
    console.log("RESIZE")
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize?.resizeToFitContent(true));
  }

}