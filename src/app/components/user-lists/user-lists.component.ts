import { Component } from "@angular/core";
import { ProductService } from "../../services/product.service";
import { IList } from "../../models/product";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-user-lists',
    imports: [MatIconModule],
    standalone: true,
    template: `
        <div class="main fs-4">
            @for (list of userLists; track list.id) {
                <div class="item note-card">
                    <div class="itemMenu">
                        <mat-icon class="settings-icon" (click)="showMenu($index, $event)">settings</mat-icon>
                    </div>
                    <div class="itemContent" (click)="goToView(list.id)">
                        <p id="name-{{list.id}}" style="text-align: center" (keyup.enter)="onNewNameInserted($event, list.id)"> {{list.name}} </p>
                    </div>
                    <div id="menu-{{$index}}" class="itemFooter">
                        <mat-icon (click)="deleteList(list.id)" style="color: red">delete_forever</mat-icon>
                        <mat-icon (click)="updateName(list.id)">edit</mat-icon>
                    </div>
                </div>
            }
            <div (click)="goToNewList()" class="itemAdd new fs-4 note-card">
                <mat-icon>add</mat-icon>
            <div>
        </div>
    `,
   styleUrl: "./user-lists.component.scss"
})
export class UserListsComponent {
    userLists: IList[] = [];

    constructor(private productService: ProductService,
                private router: Router) {}

    ngOnInit() {
        this.getLists();
    }

    getLists() {
        this.productService.getLists()
        .subscribe({
            next: (data) => { this.userLists = data; },
            error: (error) => console.log(error)
        })
    }

    goToView(id: number | string) {
        this.router.navigate([`view-list/${id}`]);
    }

    goToNewList() {
        this.router.navigate([`new-list`]);
    }

    showMenu(id: number, event: Event) {
        let icon = event.target as HTMLElement;
        icon.classList.toggle("rotate");
        document.getElementById(`menu-${id}`)?.classList.toggle('show');
    }

    deleteList(id: number) {
        this.productService.deleteList(id.toString()).subscribe({
            next: () => console.log('list deleted'),
            error: () => console.log('error removing list'),
            complete: () => this.getLists()
        })
    }

    onNewNameInserted(event: any, id: number) {
        event.preventDefault();
        event.target.innerText = event.target.innerText.trim();
        let newName = event.target.innerText;
        let target = event.target as HTMLElement;
        target.contentEditable = 'false';
        this.updateListName(id, newName);
    }

    updateName(listId: number) {
        let list = document.querySelector(`#name-${listId}`) as HTMLElement;
        list.contentEditable = 'true';
        list.innerHTML = '';
        list.focus();
    }

    updateListName(id: number, newName: string) {
        this.productService.updateListName(id.toString(), newName).subscribe({
            next: () => console.log('list updated'),
            error: () => console.log('error'),
            complete: () => this.getLists()
        })
    }
}
