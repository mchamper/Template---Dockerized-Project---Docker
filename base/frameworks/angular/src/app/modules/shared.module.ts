import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LazyImageDirective } from "./directives/lazy-image.directive";

const modules = [
  CommonModule,
  LazyImageDirective,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class SharedModule { }
