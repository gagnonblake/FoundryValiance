/**
 * Set up custom status effects in the CONFIG object
 */
export function _prepareStatusEffects() {
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
			id: 'ailmentEnfeebled',
			label: 'Enfeebled',
			icon: 'systems/valiance/assets/icons/StatusAilmentEnfeebled.png'
		},
		{
			id: 'ailmentDistracted',
			label: 'Distracted',
			icon: 'systems/valiance/assets/icons/StatusAilmentDistracted.png'
		},
		{
			id: 'ailmentExhausted',
			label: 'Exhausted',
			icon: 'systems/valiance/assets/icons/StatusAilmentExhausted.png'
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
			id: 'ailmentShaken',
			label: 'Shaken',
			icon: 'systems/valiance/assets/icons/StatusAilmentShaken.png'
		},
		{
			id: 'ailmentShattered',
			label: 'Shattered',
			icon: 'systems/valiance/assets/icons/StatusAilmentShattered.png'
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
			id: 'boonEnergized',
			label: 'Energized',
			icon: 'systems/valiance/assets/icons/StatusBoonEnergized.png'
		},
		{
			id: 'boonFrenzied',
			label: 'Frenzied',
			icon: 'systems/valiance/assets/icons/StatusBoonFrenzied.png'
		},
		{
			id: 'boonHardened',
			label: 'Hardened',
			icon: 'systems/valiance/assets/icons/StatusBoonHardened.png'
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