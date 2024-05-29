import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { INgxSelectOption } from 'ngx-select-ex';
import { ApiService } from 'src/app/api.service';
import { Customers, DataSource } from 'src/app/interface/api.interface';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent implements OnInit, OnChanges {
  public collaborators: any[] = [];
  public collaboratorsNgxValue: any = [];

  public checkBox = [
    { name: 'Public', value: 'Public', id: 'privacy' },
    { name: 'Private', value: 'Private', id: 'privacy' },
  ];

  public pinForm = this.fb.group({
    title: ['', Validators.required],
    selectImg: ['', Validators.required],
    collaborators: [[], Validators.required],
    privacy: ['Public', Validators.required],
  });

  @Input() openModel: { display: string } = {
    display: '',
  };
  @Input() getAllCollaborators: any[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() updatedDataSource: EventEmitter<DataSource[]> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private localStorage: LocalStorageService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getValuesFormLocalStorage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['getAllCollaborators']['currentValue'] !== undefined){
      this.getValuesFormLocalStorage();
    }
  };

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  };

  doSelectOptionsCollaborators(options: INgxSelectOption[]) {}

  onPinSubmit(): void {
    if (this.pinForm.valid) {
      const file = this.pinForm.get('selectImg')?.value as File;
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result as string;
        this.pinForm.patchValue({
          selectImg: fileData,
        });

        const pins: any[] = this.localStorage.getStorage('dataSource') || [];
        pins.push(this.pinForm.value);
        this.localStorage.setStorage('dataSource', pins);
        this.updatedDataSource.emit(this.localStorage.getStorage('dataSource'));
        this.pinForm.reset();
        this.resetFileInput();
        document.getElementById("selectedImg")?.nodeValue
        this.pinForm.patchValue({
          privacy: 'Public',
        });
      };
      reader.readAsDataURL(file);
      this.openModel.display = 'none';
      this.cdRef.markForCheck();
    } else {
      this.apiService.markAllAsTouched(this.pinForm);
    }

  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.pinForm.get('selectImg')?.setValue(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  }

  getValuesFormLocalStorage() {
    const customers: Customers[] = this.localStorage.getStorage('customers') || [];
    this.collaborators = customers.map((item) => {
      return { name: item.name, email: item.email };
    });
    this.collaboratorsNgxValue = [];
  }
}
