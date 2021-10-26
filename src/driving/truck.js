import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import BaseGameObject from "../baseGameObject";
import { truckSetup } from "./gameData.js";

class Truck extends BaseGameObject {

    static async loadTruck(scene) {
        const { modelUrl } = truckSetup;

        let truck = new Truck(scene);
        let engine = scene.getEngine();
        engine.displayLoadingUI("Loading Truck assets");
        let importedMeshes = await SceneLoader.ImportMeshAsync("", modelUrl, "", scene)[0];
        let truckMesh = importedMeshes[1];
        truckMesh.setParent(null);
        truckMesh.position = new Vector3(0, 0, 0);
        truckMesh.rotation = new Vector3(0, 0, 0);
        truckMesh.scaling.setAll(truckSetup.modelScaling);
        truckMesh.checkCollisions = true;
        truckMesh.receiveShadows = true;
        importedMeshes[0].dispose();

        truck.mesh = truckMesh;
        engine.hideLoadingUI();
        return truck;
    }
    
    constructor(scene) {
        super(scene);        

    }

    update(deltaTime) {
        super.update(deltaTime);

    }
}

export default Truck;