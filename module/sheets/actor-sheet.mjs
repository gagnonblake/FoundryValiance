import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";
import { onManageCooldown, } from "../helpers/cooldowns.mjs";
import { onManageControls, } from "../helpers/controls.mjs";

/**
 * Extend the basic ActorSheet
 * @extends {ActorSheet}
 */
export class ValianceActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["valiance", "sheet", "actor"],
            template: "systems/valiance/templates/actor/actor-sheet.html",
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "overview" }]
        });
    }

    /** @override */
    get template() {
        return `systems/valiance/templates/actor/actor-sheet.html`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        // Retrieve the data structure from the base sheet. You can inspect or log
        // the context variable to see the structure, but some key properties for
        // sheets are the actor object, the data object, whether or not it's
        // editable, the items array, and the effects array.
        const context = super.getData();

        // Use a safe clone of the actor data for further operations
        const actorData = this.actor.data.toObject(false);

        // Add the actor's data to context.data for easier access, as well as flags
        context.data = actorData.data;
        context.flags = actorData.flags;

        // Prepare character data and items
        this._prepareItems(context);
        this._prepareCharacterData(context);

        // Add roll data for TinyMCE editors
        context.rollData = context.actor.getRollData();

        // Prepare active effects
        context.effects = prepareActiveEffectCategories(this.actor.effects);

        return context;
    }

    /**
    * Prepare data for Character sheets
    *
    * @param {Object} context The actor to prepare.
    *
    * @return {undefined}
    */
    _prepareCharacterData(context) {

    }

    /**
    * Organize and classify Items for Character sheets
    *
    * @param {Object} context The actor to prepare
    *
    * @return {undefined}
    */
    _prepareItems(context) {
        // Initialize containers for items
        const weapons = [];
        const armorSets = [];
        const accessories = [];
        const gear = [];
        const traits = [];
        const abilities = [];
        const activeCooldowns = [];

        // Iterate through items, allocating to containers
        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;

            if (i.type === 'weapon') {
                weapons.push(i);
            }

            else if (i.type === 'armorSet') {
                armorSets.push(i);
            }

            else if (i.type === 'accessory') {
                accessories.push(i);
            }

            else if (i.type === 'gear') {
                gear.push(i);
            }

            else if (i.type === 'trait') {
                traits.push(i);
            }

            else if (i.type === 'abilitiy') {
                abilities.push(i);
            }

            else if (i.type === 'activeCooldown') {
                activeCooldowns.push(i);
            }
        }

        // Assign and return
        context.weapons = weapons;
        context.armorSets = armorSets;
        context.accessories = accessories;
        context.gear = gear;
        context.traits = traits;
        context.abilities = abilities;
        context.activeCooldowns = activeCooldowns;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // Control management
        html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));
        html.find(".cooldown-control").click(ev => onManageCooldown(ev, this));
        html.find(".misc-control").click(ev => onManageControls(ev, this.actor));

        // Rollable abilities
        html.find('.rollable').click(this._onRoll.bind(this));

        // Drag events for macros
        if (this.actor.isOwner) {
            let handler = ev => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }

    /**
    * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
    * @param {Event} event   The originating click event
    * @private
    */
    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;

        // Get the type of item to create
        const type = header.dataset.type;

        // Grab any data associated with this control
        const data = duplicate(header.dataset);

        // Initialize a default name
        const name = `New ${type.capitalize()}`;

        // Prepare the item object
        const itemData = {
            name: name,
            type: type,
            data: data
        };

        // Remove the type from the dataset since it's in the itemData.type prop
        delete itemData.data["type"];

        // Finally, create the item!
        return await Item.create(itemData, {parent: this.actor});
    }

    /**
    * Handle clickable rolls.
    * @param {Event} event   The originating click event
    * @private
    */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        // Handle item rolls
        if (dataset.rollType) {
            if (dataset.rollType == 'item') {
            const itemId = element.closest('.item').dataset.itemId;
            const item = this.actor.items.get(itemId);
            if (item) return item.roll();
            }
        }

        // Handle rolls that supply the formula directly
        /*if (dataset.roll) {
            let label = dataset.label ? `[ability] ${dataset.label}` : '';
            let roll = new Roll(dataset.roll, this.actor.getRollData());
            roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
            rollMode: game.settings.get('core', 'rollMode'),
            });
            return roll;
        }*/
    }
}
