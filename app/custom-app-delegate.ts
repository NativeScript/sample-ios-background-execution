const hasBGTaskScheduler = !!(<any>global).BGTaskScheduler;

export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];
    public static ObjCExposedMethods = {
        "runOnBackground": { returns: interop.types.void }
    };

    private shortBgTask;
    private timer = null;
    private timerCounter = 0;

    private longTaskCounter = 0;

    public applicationDidEnterBackground(application: UIApplication) {
        this.startShortBackgroundTask(application);

        if (hasBGTaskScheduler) {
            this.startLongBackgroundTask();
        }
    }

    public applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions: NSDictionary<string, any>): boolean {
        if (hasBGTaskScheduler) {
            BGTaskScheduler.sharedScheduler.registerForTaskWithIdentifierUsingQueueLaunchHandler(
                "org.nativescript.BkgdExecExample.LongTask", null, this.longTaskHandler.bind(this));
        } else {
            console.warn("Skipping BGTaskScheduler task because the API is unavailable.");
        }
        return true;
    }

    private startShortBackgroundTask(application: UIApplication) {
        if (this.timer) {
            console.log(`Background task is still running. Restarting it.`);
            this.endShortBackgroundTask();
        }
        console.log(`Enter background. Allowed background time remaining: ${UIApplication.sharedApplication.backgroundTimeRemaining}`);
        this.shortBgTask = application.beginBackgroundTaskWithNameExpirationHandler("MyTask", () => {
            this.endShortBackgroundTask();
        });
        this.timerCounter = 5;
        console.log("Start logging numbers on background.");
        this.timer = NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(2, this, "runOnBackground", null, true);
    }

    private endShortBackgroundTask(): void {
        if (this.timer) {
            this.timer.invalidate();
            this.timer = null;
        }

        UIApplication.sharedApplication.endBackgroundTask(this.shortBgTask);
        this.shortBgTask = UIBackgroundTaskInvalid;

        console.log("End of background task.");
    }

    public runOnBackground(): void {
        if (this.timerCounter <= 0) {
            this.endShortBackgroundTask();
            return;
        }
        console.log(`${this.timerCounter} (the app is on background, allowed background time remaining: ${UIApplication.sharedApplication.backgroundTimeRemaining})`);
        this.timerCounter--;
    }

    private startLongBackgroundTask() {
        const longTaskRequest = BGAppRefreshTaskRequest.alloc().initWithIdentifier("org.nativescript.BkgdExecExample.LongTask");
        longTaskRequest.earliestBeginDate = new Date(new Date().getTime() + 1 * 1000);
        try {
            BGTaskScheduler.sharedScheduler.submitTaskRequestError(longTaskRequest);
        } catch(e) {
            console.log(`Еrror submitting BGTaskScheduler request: ${e}`);
            const isSimulator = NSProcessInfo.processInfo.environment.objectForKey("SIMULATOR_DEVICE_NAME") !== null;
            if (isSimulator) {
                console.log(`Simulator device detected. BGTaskScheduler may be unsupported on Simulators.`);
            }
        }
    }

    private longTaskHandler(task: BGTask) {
        this.longTaskCounter = 0;
        console.log("Start long task ticks.");

        let queue = NSOperationQueue.alloc().init();
        queue.maxConcurrentOperationCount = 1;
        let stop = false;

        const addOp = () => {
            const op = NSBlockOperation.blockOperationWithBlock(() => {
                this.tickLongBackgroundTask();
                addOp();
            });
            if (stop) {
                task.setTaskCompletedWithSuccess(true);
            } else {
                queue.addOperation(op);
            }
        };

        console.log(`Long task started`, new Date());
        addOp();
        task.expirationHandler = () => {
            queue.cancelAllOperations();
            stop = true;
            console.log(`Long task expired`, new Date());
        }
    }

    private tickLongBackgroundTask(): void {
        this.longTaskCounter++;
        console.log(`Tick #${this.longTaskCounter} of long task, sleep for 5 sec.`);
        sleep(5);
    }
}
