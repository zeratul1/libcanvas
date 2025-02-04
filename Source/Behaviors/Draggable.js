/*
---

name: "Behaviors.Draggable"

description: "When object implements LibCanvas.Behaviors.Draggable interface dragging made possible"

license:
	- "[GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)"
	- "[MIT License](http://opensource.org/licenses/mit-license.php)"

authors:
	- "Shock <shocksilien@gmail.com>"

requires:
	- LibCanvas
	- Behaviors.MouseListener

provides: Behaviors.Draggable

...
*/

var Draggable = LibCanvas.Behaviors.Draggable = function () {


var initDraggable = function () {
	var draggable = this,
		mouse = draggable.libcanvas.mouse,
		dragFn = function ( e ) {
			draggable.shape.move( e.deltaOffset );
			draggable.fireEvent('moveDrag', [e.deltaOffset, e]);
		},
		stopDrag  = ['up', 'out'],
		onStopDrag = function (e) {
			draggable.fireEvent('stopDrag', [ e ]);
			mouse
				.removeEvent( 'move', dragFn)
				.removeEvent(stopDrag, onStopDrag);
		};

	draggable.listenMouse();

	draggable.addEvent( 'mousedown' , function (e) {
		if (!draggable['draggable.isDraggable']) return;
		if (typeof e.stop == 'function') e.stop();
		
		draggable.fireEvent('startDrag', [ e ]);

		mouse
			.addEvent( 'move', dragFn )
			.addEvent( stopDrag, onStopDrag );
	});


	return this;
};

return Class({
	Extends: MouseListener,

	draggable : function (stopDrag) {
		if (! ('draggable.isDraggable' in this) ) {
			if (this.libcanvas) {
				initDraggable.call( this );
			} else {
				this.addEvent('libcanvasSet', initDraggable);
			}
		}
		this['draggable.isDraggable'] = !stopDrag;
		return this;
	}
});
	
}();