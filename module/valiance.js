/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 */

// Import Modules
import { ValianceActor } from "./actor.js";
import { ValianceActorSheet } from "./actor-sheet.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
    console.log(`Initializing Valiance System`);

      game.valiance = {
            ValianceActor,
            useEntity: foundry.utils.isNewerVersion("9", game.version ?? game.data.version)
      };

      // Define custom Document classes
      CONFIG.Actor.documentClass = ValianceActor;

      // Register sheet application classes
      Actors.unregisterSheet("core", ActorSheet);
      Actors.registerSheet("valiance", ValianceActorSheet, { makeDefault: true });
});