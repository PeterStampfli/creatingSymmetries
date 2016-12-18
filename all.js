"use strict";

// collection of small functions used in different places
//=================================================================

// override default actions, especially important for the mouse wheel
function stopEventPropagationAndDefaultAction(event) {
	event.stopPropagation();
	event.preventDefault();   
}

