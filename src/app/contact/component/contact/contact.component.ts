import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { InputTextareaModule } from "primeng/inputtextarea"; 
import { CardModule } from 'primeng/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule, ReactiveFormsModule, MessageModule, InputTextareaModule, CardModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {


  public submitted: boolean = false;
  constructor(private fb: FormBuilder){

  }
  contactForm = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.max(300)])
  });

  public onSubmit(): void {

    console.log(this.contactForm.value);
    this.submitted = true;
    this.contactForm.reset();
  }

  ngOnchanges(){
    console.log(this.contactForm);
  }






}
