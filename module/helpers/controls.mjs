/**
* Manage misc. controls through the Actor Sheet via effect control buttons.
* @param {MouseEvent} event      The left-click event on the effect control
* @param {Actor|Item} owner      The owning document which manages this effect
*/
export function onManageControls(event, owner) {
    event.preventDefault();

    const target = event.currentTarget;

    switch (target.dataset.action) {
        case "toggleLantern":
            // First case, the owner is an unlinked token
            // Linked characters will never have a token, even if opened from the token
            if (owner.token) {
                const tokenCopy = owner.token.toObject();
                if (tokenCopy.light.bright == 0) tokenCopy.light.bright = 25;
                else tokenCopy.light.bright = 0;
                return owner.token.update(tokenCopy);
            }
            // Second case, the owner is a linked character and has one token
            // Ignore linked characters with multiple tokens, as there is no use case for that setup
            else if (owner.getActiveTokens(true).length == 1) {
                const actorToken = owner.getActiveTokens(true)[0].document;
                const actorTokenCopy = actorToken.toObject();
                if (actorTokenCopy.light.bright == 0) actorTokenCopy.light.bright = 25;
                else actorTokenCopy.light.bright = 0;
                return actorToken.update(actorTokenCopy);
			}
    }
}