/**
* Manage active cooldown instances through the Actor Sheet via effect control buttons.
* @param {MouseEvent} event      The left-click event on the effect control
* @param {Actor|Item} owner      The owning document which manages this effect
*/
export function onManageCooldown(event, owner) {
    event.preventDefault();

    const target = event.currentTarget;
    const itemElement = target.closest('li');
    const itemId = itemElement.dataset.itemId;
    const item = owner.actor.items.get(itemId);
    let itemClone;

    switch (target.dataset.action) {
        case "create":
            const type = target.dataset.type;
            const data = duplicate(target.dataset);
            const name = `New ${type.capitalize()}`;
            const itemData = {
                name: name,
                type: type,
                data: data
            };
            delete itemData.data["type"]; // Remove the type from the dataset since it's in itemData.type
            return Item.create(itemData, { parent: owner.actor });
        case "decrease":
            itemClone = item.toObject();
            itemClone.data.value--;
            return item.update(itemClone);
        case "increase":
            itemClone = item.toObject();
            itemClone.data.value++;
            return item.update(itemClone);
        case "edit":
            return item.sheet.render(true);
        case "delete":
            return item.delete();
    }
}