// Import document classes
import { ValianceActor } from "./documents/actor.mjs";
import { ValianceItem } from "./documents/item.mjs";

// Import sheet classes
import { ValianceActorSheet } from "./sheets/actor-sheet.mjs";
import { ValianceItemSheet } from "./sheets/item-sheet.mjs";

// Import helper/utility classes and constants
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { VALIANCE } from "./helpers/config.mjs";
import { _prepareStatusEffects } from "./helpers/prepareStatusEffects.mjs";
import { _drawEffect, drawEffectsCustom, _onCreate } from "./helpers/manualOverrides.mjs";

/* -------------------------------------------- */
/*  Init Hooks                                   */
/* -------------------------------------------- */
Hooks.once('init', async function() {
	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	game.valiance = {
		ValianceActor,
		ValianceItem,
		rollItemMacro
	};

	// Add custom constants for configuration.
	CONFIG.VALIANCE = VALIANCE;

	// Define custom Document classes
	CONFIG.Actor.documentClass = ValianceActor;
	CONFIG.Item.documentClass = ValianceItem;

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("valiance", ValianceActorSheet, { makeDefault: true });
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("valiance", ValianceItemSheet, { makeDefault: true });

	// Manually override drawing functions
	Token.prototype._drawEffect = _drawEffect;
	const drawEffectsSuper = Token.prototype.drawEffects;
	Token.prototype.drawEffects = async function () {
		await drawEffectsSuper.apply(this, arguments);
		drawEffectsCustom(this);
	}

	// Manually override ActiveEffect functions
	const _onCreateSuper = ActiveEffect.prototype._onCreate;
	ActiveEffect.prototype._onCreate = async function () {
		await _onCreateSuper.apply(this, arguments);
		await _onCreate(this);
	}

	// Preload Handlebars templates.
	return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */
// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
	var outStr = '';
	for (var arg in arguments) {
	if (typeof arguments[arg] != 'object') {
			outStr += arguments[arg];
		}
	}
	return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
	return str.toLowerCase();
});

Handlebars.registerHelper('isTrue', function (value) {
	return value === true;
});

Handlebars.registerHelper('hasStacks', function (value) {
	return typeof value.getFlag("valiance", "stacks") !== "undefined";
});

/* -------------------------------------------- */
/*  Hooks                                 */
/* -------------------------------------------- */
Hooks.once("ready", async function() {
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/** Setup status effects */
Hooks.on("ready", () => {
	// Update status effects to custom effects
	_prepareStatusEffects();
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */
/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
	if (data.type !== "Item") return;
	if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
	const item = data.data;

	// Create the macro command
	const command = `game.valiance.rollItemMacro("${item.name}");`;
	let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
	if (!macro) {
		macro = await Macro.create({
			name: item.name,
			type: "script",
			img: item.img,
			command: command,
			flags: { "valiance.itemMacro": true }
		});
	}
	game.user.assignHotbarMacro(macro, slot);
	return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
	const speaker = ChatMessage.getSpeaker();
	let actor;
	if (speaker.token) actor = game.actors.tokens[speaker.token];
	if (!actor) actor = game.actors.get(speaker.actor);
	const item = actor ? actor.items.find(i => i.name === itemName) : null;
	if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

	// Trigger the item roll
	return item.roll();
}