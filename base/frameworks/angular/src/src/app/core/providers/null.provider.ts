export class NullProviderModule {
  static forRoot() {
    return {
      ngModule: NullProviderModule,
    };
  }
}
