# Running Custom Background Task

For Android sample project please see this repo - https://github.com/NativeScript/sample-android-background-services

A sample project demonstrating how NativeScript application can execute JavaScript code while the app is in background state. On `applicationDidEnterBackground` the app starts a custom [background task](https://developer.apple.com/library/ios/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/BackgroundExecution/BackgroundExecution.html). It uses the `NSTimer` API to print a console message on a fixed time interval. To start the task press the `Home` button in order to move the app to the background.


> Since iOS doesn't allow a general-purpose background task to run forever, such a task will be suspended by the operating system after [approximately 3 minutes](http://stackoverflow.com/questions/28275415/how-long-does-apple-permit-a-background-task-to-run). In some special cases your task is allowed to run longer, but you need to use [UIBackgroundModes](https://developer.apple.com/library/content/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/BackgroundExecution/BackgroundExecution.html#//apple_ref/doc/uid/TP40007072-CH4-SW23) in your `Info.plist` file to specify the intent of your task (which automatically makes it not general-purpose).


# Running the sample
```shell
    git clone https://github.com/NativeScript/sample-ios-background-execution.git
    cd sample-ios-background-execution
    npm install
    tns run ios
```

# Simulating Background Task launch

You can launch the background processing task from Xcode following the instructions in
[this article](https://developer.apple.com/documentation/backgroundtasks/starting_and_terminating_tasks_during_development). In short:
* Start the app from Xcode
* Cause scheduling of the task by going to background and comeing back to the app on the device
* Pause in the debugger
* Execute the following LLDB command:
 `e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"org.nativescript.BkgdExecExample.LongTask"]`
 * Continue execution
 * The task starts (it goes on indefinitely until the system expires it)
 * Whenever you want to simulate its expiration pause in the Xcode debugger again
 * Execute the following LLDB command:
 `e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateExpirationForTaskWithIdentifier:@"org.nativescript.BkgdExecExample.LongTask"]`


