import { HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { Product } from "src/app/models/Product";
import { cannotBeginWithSpace } from "src/app/shared/cbws.validator";
import { onlyNumber } from "src/app/shared/gte.validator";
import { untilDestroyed } from "src/app/shared/until-destroyed";
import { IProduct } from "../../models/iproduct";
import { ProductsService } from "../products.service";

export type keys = "inventoryStatus" | "rating" | "category" | "categoryId";

@Component({
  selector: "app-create-product",
  templateUrl: "./create-product.component.html",
  styleUrls: ["./create-product.component.scss"],
})
export class CreateProductComponent implements OnInit, OnDestroy {
  private productList!: IProduct[];
  public inputsForm: FormGroup = new FormGroup({});
  public imageSrc: string | ArrayBuffer | null | undefined;
  public fileName: string = "";
  public percentDone!: number;
  public uploadSuccess!: boolean;

  // get all necessary arrays for selection inputs
  public get inventoryStatusArray() {
    return this.uniqueArrayElements("inventoryStatus");
  }

  public get ratingArray() {
    return this.uniqueArrayElements("rating");
  }

  public get categoriesArray() {
    return this.uniqueArrayElements("category");
  }

  public get categoryIdsArray() {
    return this.uniqueArrayElements("categoryId");
  }

  private uniqueArrayElements(key: keys) {
    let arr = this.productList?.map((obj) => obj[key]);
    return [...new Set(arr)]?.sort();
  }

  // get all form controls
  public get f() {
    return this.inputsForm.controls;
  }

  // generating auto id and code
  private get generatId(): number {
    let genId =
      this.productList?.length > 0 ? Math.max(...this.productList?.map((product) => product.id)) + 1 : 1;
    return genId;
  }

  private get generatCode(): string {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
  }

  // formControls
  public get description() {
    return this.inputsForm.get("description");
  }

  private get category() {
    return this.inputsForm.get("category");
  }

  private get categoryId() {
    return this.inputsForm.get("categoryId");
  }

  private get id() {
    return this.inputsForm.get("id");
  }

  private get code() {
    return this.inputsForm.get("code");
  }

  private get inventoryStatus() {
    return this.inputsForm.get("inventoryStatus");
  }

  private get isAvailable() {
    return this.inputsForm.get("isAvailable");
  }

  private get productImg() {
    return this.inputsForm.get("productImg");
  }

  constructor (
    private productsService: ProductsService,
    private _router: Router,
    protected formBuilder: FormBuilder
  ) {
    // Create the form
    this.inputsForm = this.formBuilder.group({
      id: [[Validators.required]],
      code: [[Validators.required]],
      categoryId: ["", [Validators.required]],
      productName: ["", [Validators.required, cannotBeginWithSpace]],
      description: ["", [Validators.required, Validators.minLength(5), cannotBeginWithSpace],],
      productImg: ["", [Validators.required]],
      price: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), onlyNumber,],],
      isAvailable: [{ value: false, disabled: true }, [Validators.required]],
      category: ["", [Validators.required]],
      quantity: [null, [Validators.required, Validators.pattern("^[0-9]*$"), onlyNumber],],
      inventoryStatus: ["", [Validators.required]],
      rating: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.twoWayUpdating();
    this.changeIsAvailableStatus();
  }

  private getProducts(): void {
    this.productsService
      .getAllProducts()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.productList = data;
        // generating id and code for new Product
        this.id?.patchValue(this.generatId);
        this.code?.patchValue(this.generatCode);
      });
  }

  private changeIsAvailableStatus() {
    this.inventoryStatus?.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((s) => {
        if (s == "OUTOFSTOCK") this.isAvailable?.patchValue(false);
        else this.isAvailable?.patchValue(true);
      });
  }

  private twoWayUpdating() {
    // update category formControl depending on categoryId formControl
    this.categoryId?.valueChanges.pipe(untilDestroyed(this)).subscribe((i) => {
      let id = i;
      if (id > 0)
        this.category?.patchValue(this.categoriesArray[id - 1], {
          emitEvent: false,
        });
    });

    // update categoryId formControl depending on category formControl
    this.category?.valueChanges.pipe(untilDestroyed(this)).subscribe((c) => {
      let cat = c;
      if (cat == "Accessories") this.categoryId?.patchValue(1);
      if (cat == "Clothing") this.categoryId?.patchValue(2);
      if (cat == "Electronics") this.categoryId?.patchValue(3);
      if (cat == "Fitness") this.categoryId?.patchValue(4);
    });
  }

  public submitForm() {
    let formValues = this.inputsForm.getRawValue();
    let newProduct: IProduct = new Product(formValues);

    this.productsService
      .createProduct(newProduct)
      .pipe(untilDestroyed(this),
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event?.total) {
            this.percentDone = Math.round((100 * event.loaded) / event?.total);
          } else if (event instanceof HttpResponse) {
            this.uploadSuccess = true;
          }
        })
      )
      .subscribe(() => {
        setTimeout(() => {
          this._router.navigateByUrl(`products`);
        }, 2000);
      });
  }

  public handleInputChange(files: FileList) {
    var file: File = files[0];
    this.fileName = file.name;
    var pattern = /image-*/;

    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }

    // FileReader => Browser API => to read File
    var reader: FileReader = new FileReader();
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      this.imageSrc = readerEvent.target?.result;
      this.productImg?.patchValue(this.imageSrc);
    };

    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    console.log("Destroy");
  }

}