import application = require("application");
import { CustomAppDelegate } from "./custom-app-delegate";

application.ios.delegate = CustomAppDelegate;
application.start({ moduleName: "main-page" });
