import { NzConfig } from "ng-zorro-antd/core/config";
import { themeConfig } from "./theme.config";

export const nzConfig: NzConfig = {
  theme: {
    primaryColor: themeConfig.colors.primary,
    errorColor: themeConfig.colors.error,
  },
};
