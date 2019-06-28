import * as application from "tns-core-modules/application";
import { CustomAppDelegate } from "./custom-app-delegate";

application.ios.delegate = CustomAppDelegate;
application.run({ moduleName: "app-root" });
