import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { screenConfig, environmentConfig} from "./gameData.js";


const { SCENE_MASK } = screenConfig;
const { environmentTextureUrl, skyBoxSize } = environmentConfig;

const initializeEnvironment = (scene) => {
    
    var light = new HemisphericLight("light", new Vector3(0, 0, -1), scene);
    light.intensity = 1000;
    var skyTexture = CubeTexture.CreateFromPrefilteredData(environmentTextureUrl, scene, null, true);
    skyTexture.coordinatesMode = Texture.SKYBOX_MODE;
    scene.reflectionTexture = skyTexture;
    var skyBox = scene.createDefaultSkybox(skyTexture, false, skyBoxSize);
    skyBox.layerMask = SCENE_MASK;

    return { skyBox, light, skyTexture }
};

export default { initializeEnvironment };