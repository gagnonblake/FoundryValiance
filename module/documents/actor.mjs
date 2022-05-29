/**
 * Extend the base Actor document by defining a custom roll data structure.
 * @extends {Actor}
 */
export class ValianceActor extends Actor {
    /** @override */
    prepareData() {
        // Prepare data for the actor. Calling the super version of this executes
        // the following, in order: data reset (to clear active effects),
        // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
        // prepareDerivedData().
        super.prepareData();
    }

    /** @override */
    prepareBaseData() {
        // Data modifications in this step occur before processing embedded
        // documents or derived data.
    }

    /**
    * @override
    * Augment the basic actor data with additional dynamic data
    * Typically, you'll want to handle most of your calculated/derived data in this step
    * Data calculated in this step should generally not exist in template.json
    * (such as ability modifiers rather than ability scores) and should be
    * available both inside and outside of character sheets (such as if an actor
    * is queried and has a roll executed directly from it)
    */
    prepareDerivedData() {
        // Make modifications to data here
        //const data = this.data.data;

        // At some point we can calculate derived data such as attributes here
        // For now all of that is manually input by the user so no calculations 
        // here are needed
    }

    /**
    * Override getRollData() that's supplied to rolls
    */
    getRollData() {
        const data = super.getRollData();

        // Copy attributes to the top level, so that rolls can use
        // formulas like '@lethality * 2'
        if (data.attributes) {
            for (let [key, value] of Object.entries(data.attributes)) {
                data[key] = foundry.utils.deepClone(value).value;
            }
        }

        return data;
    }
}