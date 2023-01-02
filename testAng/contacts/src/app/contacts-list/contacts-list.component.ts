import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Contact } from '../Contact';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit {
  	contacts: Contact[] = []
	currentContactId: number = 0;
	closeResult = '';

	constructor(
		private modalService: NgbModal,
		private contactService: ContactsService
	) {}

	logCon(info: any): void {
		alert(info)
	}

	ngOnInit(): void {
		this.getContacts();
	}

	getContacts(): void {
		this.contactService.getContacts()
			.subscribe(contacts => this.contacts = contacts);
	}

	open(content: any, id: number) {
		this.currentContactId = id;
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	openSm(content: any, id: number) {
		this.currentContactId = id;
		this.modalService.open(content, { size: 'sm' });
	}

	openAddModal(content: any) {
		this.modalService.open(content);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

	// Operations
	removeContact(): void {
		this.contactService.deleteContact(this.currentContactId)
		.subscribe((res: { toString: () => any; })=>{
			window.location.reload();
		});
	}

	saveUpdatedContact(name: string, lastName: string, phone: string, description: string): void {
		this.contactService.saveUpdatedContact(this.currentContactId, { name, lastName, phone, description } as Contact)
		.subscribe((res: { toString: () => any; })=>{
			window.location.reload();
		});
	}

	addNewContact(name: string, lastName: string, phone: string, description: string): void {
		this.contactService.addNewContact({ name, lastName, phone, description } as Contact)
		.subscribe((res: { toString: () => any; })=>{
			window.location.reload();
		});
	}
}
