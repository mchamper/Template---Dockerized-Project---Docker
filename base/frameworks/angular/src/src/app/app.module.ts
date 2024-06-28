import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";

const modules = [
  CommonModule,
  NgOptimizedImage,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class AppModule { }
