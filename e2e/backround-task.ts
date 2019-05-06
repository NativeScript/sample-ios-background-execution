import { AppiumDriver, createDriver, SearchOptions, LogType } from "nativescript-dev-appium";
import { assert } from "chai";

describe("background-tasks", async function () {
    let driver: AppiumDriver;

    before(async function () {
        driver = await createDriver();
    });

    after(async function () {
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("verify app is running", async function () {
        const label = await driver.findElementByText("Press the Home", SearchOptions.contains);
        assert.isTrue(await label.isDisplayed());
    });

    it("should find an element by type", async function () {
        await driver.backgroundApp(7);
        const logs = await driver.getlog(LogType.syslog);
        let hasLoggedStartLogging = false;
        let hasLogged5TheAppIsOnBackground = false;
        logs.forEach(log => {
            const logPart = JSON.stringify(log)
            if (logPart.includes("Start logging numbers on background")) {
                hasLoggedStartLogging = true;
            }
            if (logPart.includes("5 (the app is on background)")) {
                hasLogged5TheAppIsOnBackground = true;
            }
        });
        assert.isTrue(hasLoggedStartLogging);
        assert.isTrue(hasLogged5TheAppIsOnBackground);
    });
});