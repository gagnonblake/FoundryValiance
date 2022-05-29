/**
* Manage Active Effect instances through the Actor Sheet via effect control buttons.
* @param {MouseEvent} event      The left-click event on the effect control
* @param {Actor|Item} owner      The owning document which manages this effect
*/
export async function onManageActiveEffect(event, owner) {
    event.preventDefault();

    const target = event.currentTarget;
    const item = target.closest("li");
    const effect = item.dataset.effectId ? owner.effects.get(item.dataset.effectId) : null;
    const user = game.users.current;

    switch (target.dataset.action) {
        case "decrease":
            if (typeof effect.getFlag("valiance", "stacks") !== "undefined"
                && effect.canUserModify(user, "update")) {
                await effect.setFlag("valiance", "stacks", effect.getFlag("valiance", "stacks") - 1)
			}
            return;
        case "increase":
            if (typeof effect.getFlag("valiance", "stacks") !== "undefined"
                && effect.canUserModify(user, "update")) {
                await effect.setFlag("valiance", "stacks", effect.getFlag("valiance", "stacks") + 1)
            }
            return;
        case "delete":
            return effect.delete();
        case "clearAll":
            for (let curEffect of owner.effects) {
                await curEffect.delete();
			}
            return;
    }
}

/**
* Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
* @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
* @return {object}                   Data for rendering
*/
export function prepareActiveEffectCategories(effects) {

    // Define effect header categories (everything is a status)
    const categories = {
        status: {
            type: "status",
            label: "Status",
            effects: []
        }
    };

    // Iterate over active effects, classifying them into categories
    for (let effect of effects) {
        categories.status.effects.push(effect);
    }
    return categories;
}