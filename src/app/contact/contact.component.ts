import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, InputTextModule, InputTextareaModule, CardModule, ButtonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  successMessage = "";

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required, Validators.maxLength(300)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.successMessage = "Demande de contact envoyée avec succès.";
      this.contactForm.reset();
    }
  }
}
