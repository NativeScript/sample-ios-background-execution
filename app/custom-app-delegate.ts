export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];
    public static ObjCExposedMethods = {
        "runOnBackground": { returns: interop.types.void }
    };
    
    private bgTask;
    private timer;
    private timerCounter;

    public applicationDidEnterBackground(application: UIApplication) {
        console.log("Enter background");
        this.bgTask = application.beginBackgroundTaskWithNameExpirationHandler("MyTask", () => {
            application.endBackgroundTask(this.bgTask);
            this.bgTask = UIBackgroundTaskInvalid;
        });

        this.timerCounter = 5;
        console.log("Start logging numbers on background.");
        this.timer = NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(2, this, "runOnBackground", null, true);
    }

    public applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions: NSDictionary): boolean {
        return true;
    }

    public runOnBackground(): void {
        if (this.timerCounter <= 0) {
            // end of background task
            this.timer.invalidate();
            this.timerCounter = 5;
            UIApplication.sharedApplication().endBackgroundTask(this.bgTask);
            this.bgTask = UIBackgroundTaskInvalid;
            console.log("End of background task.");
            return;
        }
        console.log(`${this.timerCounter} (the app is on background)`);
        this.timerCounter--;
    }
}