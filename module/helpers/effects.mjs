/**
* Manage Active Effect instances through the Actor Sheet via effect control buttons.
* @param {MouseEvent} event      The left-click event on the effect control
* @param {Actor|Item} owner      The owning document which manages this effect
*/
export function onManageActiveEffect(event, owner) {
    event.preventDefault();

    const target = event.currentTarget;
    const item = target.closest("li");
    const effect = item.dataset.effectId ? owner.effects.get(item.dataset.effectId) : null;

    switch (target.dataset.action) {
        case "delete":
            return effect.delete();
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
        // This is a hacky way to set up conditional rendering/input for different
        // stacking statuses, since the stacking value is on the actor data
        if (effect.data.document.data.label === "Burning") {
            effect.setFlag("valiance", "isBurning", true)
            effect.setFlag("valiance", "stacking", true)
        }
        else if (effect.data.document.data.label === "Poisoned") {
            effect.setFlag("valiance", "isPoisoned", true)
            effect.setFlag("valiance", "stacking", true)
        }
        else if (effect.data.document.data.label === "Regenerating") {
            effect.setFlag("valiance", "isRegenerating", true)
            effect.setFlag("valiance", "stacking", true)
        }

        categories.status.effects.push(effect);
    }
    return categories;
}