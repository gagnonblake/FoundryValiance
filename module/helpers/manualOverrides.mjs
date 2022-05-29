/**
 * Patch effect drawing to draw status effect icons at different sizes
 */
export async function _drawEffect(src, i, bg, w, tint) {
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
export function drawEffectsCustom(token) {
	const tokenActorData = token.document._actor.data;
	const tokenChildren = token.hud.effects.children;

	// Create container for stack counters
	const stackCounter = new PIXI.Container();
	stackCounter.name = "effectStacks";

	// Counter font settings
	let font = CONFIG.canvasTextStyle.clone();
	font.fontSize = 12;

	// Render stack counters on stackable effects
	for (let effect of tokenActorData.document.temporaryEffects) {
		for (let sprite of tokenChildren.filter(effect => effect.isSprite && effect.name)) {
			if (effect.data.icon === sprite.name && typeof effect.getFlag("valiance", "stacks") !== "undefined") {
				// Get the stack for the current effect
				let stack = effect.getFlag("valiance", "stacks");

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

/**
 * Custom effect creation step to supprt stacking
 * @param {ActiveEffect} effect The created effect
 */
export async function _onCreate(effect) {
	const user = game.users.current;

	if (effect.canUserModify(user, "update")
		&&(effect.data.document.data.label === "Burning"
			|| effect.data.document.data.label === "Poisoned"
			|| effect.data.document.data.label === "Regenerating")) {
		await effect.setFlag("valiance", "stacks", 0)
	}
}