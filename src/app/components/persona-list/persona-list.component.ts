import { Component, OnInit } from '@angular/core';
import { PersonaService, Persona } from '../../services/persona.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
})
export class PersonaListComponent implements OnInit {
  personas: Persona[] = [];
  filteredPersonas: Persona[] = [];
  searchControl = new FormControl('');

  selectedPersona: Persona | null = null;

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void {
    this.personaService.getPersonas().subscribe((data: Persona[]) => {
      this.personas = data;
      this.filteredPersonas = data;
    });

    this.searchControl.valueChanges.subscribe((searchText: any) => {
      this.filteredPersonas = this.personas.filter(
        (persona) =>
          persona.name.toLowerCase().includes(searchText.toLowerCase()) ||
          persona.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
          persona.second_last_name
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    });
  }

  createPersona() {
    this.selectedPersona = {
      id: '',
      name: '',
      last_name: '',
      second_last_name: '',
      address: '',
      phone: '',
    };
  }

  editPersona(id: string) {
    this.personaService.getPersonasById(id).subscribe((persona) => {
      this.selectedPersona = { ...persona };
    });
  }

  deletePersona(id: string) {
    this.personaService.deletePersona(id).subscribe(() => {
      this.personas = this.personas.filter((p) => p.id !== id);
      this.filteredPersonas = this.filteredPersonas.filter((p) => p.id !== id);
    });
  }

  onFormSubmit(persona: Persona): void {
    if (persona.id) {
      this.personaService.updatePersona(persona).subscribe((updatedPersona) => {
        const index = this.personas.findIndex(
          (p) => p.id === updatedPersona.id
        );

        this.personas[index] = updatedPersona;
        this.filteredPersonas = [...this.personas];
      });
    } else {
      this.personaService.createPersona(persona).subscribe(() => {
        this.personaService.getPersonas().subscribe((personas) => {
          this.personas = personas;
          this.filteredPersonas = [...this.personas];
        });
      });
    }
    this.selectedPersona = null;
  }
}
