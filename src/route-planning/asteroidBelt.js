import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import OrbitingGameObject from "../orbitingGameObject";

import rockTextureUrl from "../../assets/textures/rock.png";
import rockNormalUrl from "../../assets/textures/rockn.png";
import { Matrix, Quaternion, Vector3 } from "@babylonjs/core";

class AsteroidBelt extends OrbitingGameObject {
    asteroidData;
    rockMat;
    rockSPS;
    rotations = [];
    positions = [];
    scalings = [];
    quaternions = [];
    matrices = [];
    matrixBuffer;

    get numAsteroids() {
        return this.asteroidData.number;
    }

    constructor(scene, asteroidBeltOptions) {
        super(scene, asteroidBeltOptions);

        this.asteroidData = asteroidBeltOptions;
        const numAsteroids = asteroidBeltOptions.number;


        const density = asteroidBeltOptions.density;
        const innerBeltRadius = asteroidBeltOptions.innerBeltRadius;
        const outerBeltRadius = asteroidBeltOptions.outerBeltRadius;
        const maxScale = asteroidBeltOptions.maxScale;

        const rockMat = new PBRMaterial("rockMat", this.scene);
        rockMat.albedoTexture = new Texture(rockTextureUrl, this.scene);
        rockMat.bumpTexture = new Texture(rockNormalUrl, this.scene);
        rockMat.roughness = 0.9;
        rockMat.metallic = 0.015;
        const aSphere = MeshBuilder.CreateIcoSphere("spsSphere", { radius: 5, subdivisions: 4, flat: true });
        aSphere.material = rockMat;

        for (let i = 0; i < numAsteroids; ++i) {
            this.scalings.push(new Vector3(Math.random() * 2 + 1, Math.random() + 1, Math.random() * 2 + 1));

            let theta = Math.random() * 2 * Math.PI;
            let rTheta = Scalar.RandomRange(innerBeltRadius + density * 0.5, outerBeltRadius - density * 0.5);

            this.positions.push(new Vector3(
                Math.sin(theta) * rTheta,
                (Math.random() - 0.5) * density,
                Math.cos(theta) * rTheta
            ));

            this.rotations.push(new Vector3(
                Math.random() * 3.5,
                Math.random() * 3.5,
                Math.random() * 3.5
            ));

            this.quaternions.push(new Quaternion());
            this.matrices.push(new Matrix());
        }

        this.matrixBuffer = new Float32Array(numAsteroids * 64);
        this.updateMatrices();
        aSphere.thinInstanceSetBuffer("matrix", this.matrixBuffer);

        this.mesh = aSphere;
    }

    updateMatrices() {
        for (let i = 0; i < this.numAsteroids; ++i) {
            Quaternion.FromEulerAnglesToRef(this.rotations[i].x, this.rotations[i].y, this.rotations[i].z, this.quaternions[i]);
            Matrix.ComposeToRef(this.scalings[i], this.quaternions[i], this.positions[i], this.matrices[i]);
            this.matrices[i].copyToArray(this.matrixBuffer, i * 16);
        }
    };

    update(deltaTime) {
        this.rotation.y = Scalar.Repeat(this.rotation.y + 0.0009, Scalar.TwoPi);

        for (let i = 0; i < this.numAsteroids; ++i) {
            this.rotations[i].x += Math.random() * 0.01;
            this.rotations[i].y += Math.random() * 0.01;
            this.rotations[i].z += Math.random() * 0.01;
        }
        this.updateMatrices();
        this.mesh.thinInstanceBufferUpdated("matrix");
    }
}

export default AsteroidBelt;