"use strict";

/*
button object
*/


/*
idName String, name of id in html document
*/
function Button(idName){
	this.button=document.getElementById(idName);
}

/*
add a click event listener
*/

//		<button type="button" id="update">


Button.prototype.onClick=function(action){
	this.button.addEventListener('click',action,false);
}

/*
add a change event listener
*/

//	<input type="text" class="numbers" id="outputWidthChooser" maxlength="4" />


Button.prototype.onChange=function(action){
	this.button.addEventListener('change',action,false);
}

/*
read the value
*/

//	<input type="text" class="numbers" id="outputWidthChooser" maxlength="4" />

Button.prototype.getValue=function(){
	return parseInt(this.button.value,10);
}

/*
set value
*/
Button.prototype.setValue=function(number){
	this.button.value=number.toString();
}

//fast round (positive numbers)

// With a bitwise or.
//rounded = (0.5 + somenum) | 0;
// A double bitwise not.
//rounded = ~~ (0.5 + somenum);
// Finally, a left bitwise shift.
//rounded = (0.5 + somenum) << 0;

//3.55|0 gives 3

//-3.55|0 gives -3 INSTEAD of -4 !!!