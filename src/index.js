import { Engine } from "@babylonjs/core/Engines/engine";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import SpaceTruckerApplication from "./spaceTruckerApplication";
import SpaceTruckerLoadingScreen from "./spaceTruckerLoadingScreen";
import logger from "./logger";
import "../public/assets/index.css";
import "../public/assets/space-truckers-landing-logo.jpg";
import "../public/manifest.json";


const CanvasName = "index-canvas";
const launchButton = document.getElementById("btnLaunch");
const pageLandingContent = document.getElementById("pageContainer");

const canvas = document.createElement("canvas");
canvas.id = CanvasName;
canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

const eng = new Engine(canvas, true, {
    deterministicLockstep: true,
    lockstepMaxSteps: 5,
    useHighPrecisionFloats: true,
}, true);
logger.logInfo("Created BJS engine");

eng.loadingScreen = new SpaceTruckerLoadingScreen(eng);

const theApp = new SpaceTruckerApplication(eng);    

const btnClickEvtHandle = () => {
    logger.logInfo("Launch button clicked. Initializing application.");
    canvas.classList.remove("background-canvas");
    pageLandingContent.style.display = "none";
    launchButton.removeEventListener("click", btnClickEvtHandle);
    
    theApp.run();
};
launchButton.addEventListener("click", btnClickEvtHandle);

window.addEventListener('resize', () => {
    eng.resize();
});

// For debug purposes
window.addEventListener("keydown", (ev) => {
    if (ev.shiftKey && ev.altKey && ev.key === "I") {
        ev.preventDefault();
        const scene = theApp.activeScene?.scene;
        if (!scene) {
            return false;
        }
        if (scene.debugLayer?.isVisible()) {
            scene.debugLayer.hide();
        }
        else {
            scene.debugLayer.show();
        }
        return false; 
    }
});