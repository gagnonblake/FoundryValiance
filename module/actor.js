/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class ValianceActor extends Actor {
    /** @inheritdoc */
    async modifyTokenAttribute(attribute, value, isDelta = false, isBar = true) {
        const current = foundry.utils.getProperty(this.data.data, attribute);
        if ( !isBar || !isDelta || (current?.dtype !== "Resource") ) {
            return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
        }
        const updates = {[`data.${attribute}.value`]: Math.clamped(current.value + value, current.min, current.max)};
        const allowed = Hooks.call("modifyTokenAttribute", {attribute, value, isDelta, isBar}, updates);
        return allowed !== false ? this.update(updates) : this;
    }
}
