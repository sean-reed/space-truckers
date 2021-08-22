import SpaceTruckerEncounterZone from '../encounterZone';
import { encounterZones } from '../encounterZone.js';

const zones = Object.keys(encounterZones);

class SpaceTruckerEncounterManager {
    planningScreen;
    currentZone = null;
    encounterZones = [];
    cargoUnit;
    inAndOut = 0;
    scene;
    constructor(planningScreen) {
        this.planningScreen = planningScreen;
        this.scene = planningScreen.scene;
        this.cargoUnit = this.planningScreen.cargoUnit;
        this.encounterZones = zones.map(zone => new SpaceTruckerEncounterZone(encounterZones[zone],this.scene));

        this.encounterZones.forEach(zone => {
            zone.onEnterObservable.add((evt) => this.onIntersectEnter(evt));
            zone.onExitObservable.add((evt) => this.onIntersectExit(evt));
        });
    }

    onIntersectEnter(evt) {
        this.inAndOut++;
    }
    onIntersectExit(evt) {
        this.inAndOut--;        
    }

    update(delta) {
        let zidx = zones.length - this.inAndOut;
        this.currentZone = this.encounterZones[zones[zidx]];
    }
}

export default SpaceTruckerEncounterManager;