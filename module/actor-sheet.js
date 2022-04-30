/**
 * Extend the basic ActorSheet
 * @extends {ActorSheet}
 */
export class ValianceActorSheet extends ActorSheet {
    /** @inheritdoc */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["valiance", "sheet", "actor"],
            template: "systems/valiance/templates/actors/character.html",
            width: 600,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
            scrollY: [".overview", ".inventory", ".traitsAndAbilities", "notes"],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }
    /* -------------------------------------------- */

    /** @inheritdoc */
    _getSubmitData(updateData) {
        let formData = super._getSubmitData(updateData);
        return formData;
    }
}
