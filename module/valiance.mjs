// Import document classes
import { ValianceActor } from "./documents/actor.mjs";
import { ValianceItem } from "./documents/item.mjs";

// Import sheet classes
import { ValianceActorSheet } from "./sheets/actor-sheet.mjs";
import { ValianceItemSheet } from "./sheets/item-sheet.mjs";

// Import helper/utility classes and constants
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { VALIANCE } from "./helpers/config.mjs";

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

/** Update status effect counters on token update */
Hooks.on("updateActor", function (actor, change) {
	if (change.data?.statusStacks) {
		_redrawEffectsCustom(actor.getActiveTokens());
	}
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

/* -------------------------------------------- */
/*  Helpers                                */
/* -------------------------------------------- */
/**
 * Set up custom status effects in the CONFIG object
 */
function _prepareStatusEffects() {
	// Define custom statuses (in the future they should probably be defined elsewhere in some constant)
	const statusEffects = [
		{
			id: 'ailmentBleeding',
			label: 'Bleeding',
			icon: 'systems/valiance/assets/icons/StatusAilmentBleeding.png'
		},
		{
			id: 'ailmentBlinded',
			label: 'Blinded',
			icon: 'systems/valiance/assets/icons/StatusAilmentBlinded.png'
		},
		{
			id: 'ailmentBurning',
			label: 'Burning',
			icon: 'systems/valiance/assets/icons/StatusAilmentBurning.png'
		},
		{
			id: 'ailmentDistracted',
			label: 'Distracted',
			icon: 'systems/valiance/assets/icons/StatusAilmentDistracted.png'
		},
		{
			id: 'ailmentExposed',
			label: 'Exposed',
			icon: 'systems/valiance/assets/icons/StatusAilmentExposed.png'
		},
		{
			id: 'ailmentPoisoned',
			label: 'Poisoned',
			icon: 'systems/valiance/assets/icons/StatusAilmentPoisoned.png'
		},
		{
			id: 'ailmentSlowed',
			label: 'Slowed',
			icon: 'systems/valiance/assets/icons/StatusAilmentSlowed.png'
		},
		{
			id: 'ailmentStaggered',
			label: 'Staggered',
			icon: 'systems/valiance/assets/icons/StatusAilmentStaggered.png'
		},
		{
			id: 'ailmentStunned',
			label: 'Stunned',
			icon: 'systems/valiance/assets/icons/StatusAilmentStunned.png'
		},
		{
			id: 'ailmentTaunted',
			label: 'Taunted',
			icon: 'systems/valiance/assets/icons/StatusAilmentTaunted.png'
		},
		{
			id: 'boonEmpowered',
			label: 'Empowered',
			icon: 'systems/valiance/assets/icons/StatusBoonEmpowered.png'
		},
		{
			id: 'boonFrenzied',
			label: 'Frenzied',
			icon: 'systems/valiance/assets/icons/StatusBoonFrenzied.png'
		},
		{
			id: 'boonHastened',
			label: 'Hastened',
			icon: 'systems/valiance/assets/icons/StatusBoonHastened.png'
		},
		{
			id: 'boonInvisible',
			label: 'Invisible',
			icon: 'systems/valiance/assets/icons/StatusBoonInvisible.png'
		},
		{
			id: 'boonProtected',
			label: 'Protected',
			icon: 'systems/valiance/assets/icons/StatusBoonProtected.png'
		},
		{
			id: 'boonRegenerating',
			label: 'Regenerating',
			icon: 'systems/valiance/assets/icons/StatusBoonRegenerating.png'
		},
		{
			id: 'boonUnshakable',
			label: 'Unshakable',
			icon: 'systems/valiance/assets/icons/StatusBoonUnshakable.png'
		},
	];

	return CONFIG.statusEffects = statusEffects ?? [];
}

/**
 * Update the stack counters on a token
 * Called when the relevant actor data changes
 * @param {Token} token The token to update
 */
function _redrawEffectsCustom(tokens) {
	// If we somehow got here via editing an actor with multiple tokens
	// (such as the base of a non-linked token actor) don't do anything
	if (tokens.length != 1) return;

	// Re-render stack counters on stackable effects
	const token = tokens[0];
	const tokenActorData = token.document._actor.data;
	const tokenChildren = token.hud.effects.children;

	for (let effect of tokenActorData.document.temporaryEffects) {
		for (let sprite of tokenChildren.filter(effect => effect.isSprite && effect.name)) {
			if (effect.data.icon === sprite.name && effect.getFlag("valiance", "stacking")) {
				// Get the stack for the current effect
				let stack = 0;
				if (sprite.name === "systems/valiance/assets/icons/StatusAilmentBurning.png") {
					stack = tokenActorData.data.statusStacks.burningStacks.value
				}
				else if (sprite.name === "systems/valiance/assets/icons/StatusAilmentPoisoned.png") {
					stack = tokenActorData.data.statusStacks.poisonedStacks.value
				}
				else if (sprite.name === "systems/valiance/assets/icons/StatusBoonRegenerating.png") {
					stack = tokenActorData.data.statusStacks.regeneratingStacks.value
				}

				// Update the stack counter
				let stackCounter = token.hud.effects.children.find(object => object.name === "effectStacks");
				let textSprite = stackCounter.children.find(stackSprite => stackSprite.name === sprite.name);
				if (textSprite) {
					textSprite.text = stack;
				}
			}
		}
	}
}

/* -------------------------------------------- */
/*  Manual overrides                            */
/* -------------------------------------------- */
/**
 * Patch effect drawing to draw status effect icons at different sizes
 */
async function _drawEffect(src, i, bg, w, tint) {
	// Size modifiers
	const multiplier = 2.5; // A multiplier of 2.5 allows 4 rows/columns of icons
	const divisor = 4; // A divisor of 4 allows 4 icons per column

	// Width is already multiplied by 2, so correct it
	w = (w / 2) * multiplier;

	// Define icon with a fallback "error" icon
	let tex = await loadTexture(src, { fallback: 'icons/svg/hazard.svg' });
	let icon = this.hud.effects.addChild(new PIXI.Sprite(tex));

	// Calculate icon dimensions and tint
	icon.width = icon.height = w;
	const nr = Math.floor(this.data.height * divisor);
	icon.x = Math.floor(i / nr) * w;
	icon.y = (i % nr) * w;
	if (tint) icon.tint = tint;

	// Draw icon
	bg.drawRoundedRect(icon.x + 1, icon.y + 1, w - 2, w - 2, 2);

	// Name the effect for use in custom rendering, using the source path as a name
	// The effect will be the first child sprite that is unnamed, since all previous
	// children sprites will already have been named
	const effect = this.hud.effects.children.find(child => child.isSprite && !child.name);
	if (effect) effect.name = src;
}

/**
 * Custom rendering that happens in addition to the base token effect drawing
 * Currently this just overlays effect values for stacking effects
 * @param {Token} token The token to draw the custom effects for.
 */
function drawEffectsCustom(token) {
	const tokenActorData = token.document._actor.data;
	const tokenChildren = token.hud.effects.children;

	// Create container for stack counters
	const stackCounter = new PIXI.Container();
	stackCounter.name = "effectStacks";

	// Counter font settings
	let font = CONFIG.canvasTextStyle.clone();
	font.fontSize = 12;

	// Render stack counters on stackable effects
	for (let effect of tokenActorData.document.temporaryEffects)
	{
		for (let sprite of tokenChildren.filter(effect => effect.isSprite && effect.name)) {
			if (effect.data.icon === sprite.name && effect.getFlag("valiance", "stacking")) {
				// Get the stack for the current effect
				let stack = 0;
				if (sprite.name === "systems/valiance/assets/icons/StatusAilmentBurning.png") {
					stack = tokenActorData.data.statusStacks.burningStacks.value
				}
				else if (sprite.name === "systems/valiance/assets/icons/StatusAilmentPoisoned.png") {
					stack = tokenActorData.data.statusStacks.poisonedStacks.value
				}
				else if (sprite.name === "systems/valiance/assets/icons/StatusBoonRegenerating.png") {
					stack = tokenActorData.data.statusStacks.regeneratingStacks.value
				}

				// Create the stack counter
				const stackCounterText = new PIXI.Text(stack, font);
				stackCounterText.name = sprite.name;
				stackCounterText.anchor.set(1); // Align to bottom right
				stackCounterText.x = sprite.x + sprite.width + 1;
				stackCounterText.y = sprite.y + sprite.height + 3;
				stackCounterText.resolution = 1.5;

				stackCounter.addChild(stackCounterText)
			}
		}
	}

	token.hud.effects.addChild(stackCounter);
}