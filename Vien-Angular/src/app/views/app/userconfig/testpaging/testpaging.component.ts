import { Component, ViewEncapsulation, ViewChild, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import productItems from 'src/app/data/products';
@Component({
    selector: 'app-testpaging',
    templateUrl: './testpaging.component.html'
})
export class TestpagingComponent {
    displayOptionsCollapsed = false;

    @Input() showOrderBy = true;
    @Input() showSearch = true;
    @Input() showItemsPerPage = true;
    @Input() showDisplayMode = true;
    @Input() displayMode = 'list';
    @Input() selectAllState = '';
    @Input() itemsPerPage = 10;
    @Input() itemOptionsPerPage = [5, 10, 20];
    @Input() itemOrder = { label: 'Product Name', value: 'title' };
    @Input() itemOptionsOrders = [{ label: 'Product Name', value: 'title' }, { label: 'Category', value: 'category' }, { label: 'Status', value: 'status' }];

    @Output() changeDisplayMode: EventEmitter<string> = new EventEmitter<string>();
    @Output() addNewItem: EventEmitter<any> = new EventEmitter();
    @Output() selectAllChange: EventEmitter<any> = new EventEmitter();
    @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
    @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
    @Output() changeOrderBy: EventEmitter<any> = new EventEmitter();

    @ViewChild('search') search: any;
    @ViewChild('myTable') table: any;

    expanded: any = {};
    timeout: any;
    rows = productItems.slice(0, 20).map(({ title, sales, stock, category, date }) => ({ title, sales, stock, category, date }));
    ColumnMode = ColumnMode;
    columns = [
        { prop: 'title', name: 'Title' },
        { prop: 'sales', name: 'Sales' },
        { prop: 'stock', name: 'Stock' },
        { prop: 'category', name: 'Category' },
        { prop: 'date', name: 'Date' }
    ];
    temp = [...this.rows];
    constructor() {

    }

    onPage(event) {
    }

    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
    }

    onDetailToggle(event) {
    }

    updateFilter(event) {
        const val = event.target.value.toLowerCase().trim();
        const count = this.columns.length;
        const keys = Object.keys(this.temp[0]);
        const temp = this.temp.filter(item => {
            for (let i = 0; i < count; i++) {
                if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
                    return true;
                }
            }
        });
        this.rows = temp;
        this.table.offset = 0;
    }
    onSelectDisplayMode(mode: string) {
        this.changeDisplayMode.emit(mode);
    }
    onAddNewItem() {
        this.addNewItem.emit(null);
    }
    selectAll(event) {
        this.selectAllChange.emit(event);
    }
    onChangeItemsPerPage(item) {
        this.itemsPerPageChange.emit(item);
    }

    onChangeOrderBy(item) {
        this.itemOrder = item;
        this.changeOrderBy.emit(item);
    }

    onSearchKeyUp($event) {
        this.searchKeyUp.emit($event);
    }
}
