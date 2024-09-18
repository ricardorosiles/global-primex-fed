import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Persona } from '../../services/persona.service';

@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
})
export class PersonaFormComponent {
  @Input() persona?: Persona;
  @Output() formSubmitted = new EventEmitter<Persona>();

  personaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personaForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      second_last_name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.persona) {
      this.personaForm.patchValue({
        name: this.persona.name,
        last_name: this.persona.last_name,
        second_last_name: this.persona.second_last_name,
        address: this.persona.address,
        phone: this.persona.phone,
      });
    }
  }

  submitForm(): void {
    if (this.personaForm.valid) {
      this.formSubmitted.emit(this.personaForm.value);
    }
  }
}
