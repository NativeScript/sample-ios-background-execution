# Running Custom Background Task
A sample project demonstrating how NativeScript application can execute JavaScript code while the app is in background state. On `applicationDidEnterBackground` the app starts a custom [background task](https://developer.apple.com/library/ios/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/BackgroundExecution/BackgroundExecution.html). It uses the `NSTimer` API to print a console message on a fixed time interval. To start the task press the `Home` button in order to move the app to the background.

# Running the sample
```shell
    git clone https://github.com/NativeScript/sample-ios-background-execution.git
    cd sample-ios-background-execution
    npm install
    tns run ios
```