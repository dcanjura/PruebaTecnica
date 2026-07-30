import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly search = signal('');
  readonly modalOpen = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly filteredProducts = computed(() => {
    const term = this.search().trim().toLowerCase();
    return term
      ? this.products().filter(product =>
          [product.name, product.description, product.type].some(value =>
            value.toLowerCase().includes(term)))
      : this.products();
  });

  readonly totalStock = computed(() =>
    this.products().reduce((sum, product) => sum + product.stock, 0));
  readonly inventoryValue = computed(() =>
    this.products().reduce((sum, product) => sum + product.stock * product.price, 0));

  readonly form;

  constructor(
    formBuilder: FormBuilder,
    private readonly service: ProductService,
    readonly auth: AuthService,
    private readonly router: Router
  ) {
    this.form = formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      type: ['', [Validators.required, Validators.maxLength(80)]]
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.findAll().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: products => this.products.set(products),
      error: () => this.error.set('No fue posible cargar los productos.')
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '', price: 0, stock: 0, type: '' });
    this.modalOpen.set(true);
  }

  openEdit(product: Product): void {
    this.editingId.set(product.id!);
    this.form.reset(product);
    this.modalOpen.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const product = this.form.getRawValue();
    const id = this.editingId();
    const request = id === null ? this.service.create(product) : this.service.update(id, product);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.modalOpen.set(false);
        this.load();
      },
      error: () => this.error.set('No fue posible guardar el producto.')
    });
  }

  remove(product: Product): void {
    if (!product.id || !confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    this.service.delete(product.id).subscribe({
      next: () => this.products.update(items => items.filter(item => item.id !== product.id)),
      error: () => this.error.set('No fue posible eliminar el producto.')
    });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
