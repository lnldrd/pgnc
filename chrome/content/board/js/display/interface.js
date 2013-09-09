game.cmd= new Object;
var SVGDocument;
var SVGRoot;
var TrueCoords;
var GrabPoint;
var DragTarget=null;
function Init(evt)
{
   SVGDocument = evt.target.ownerDocument;
   SVGRoot = SVGDocument.documentElement;

   TrueCoords = SVGRoot.createSVGPoint();
   GrabPoint = SVGRoot.createSVGPoint();
}
function Grab(evt)
{
   if ('pieces'!= evt.target.parentNode.id)return;
   DragTarget = evt.target;
   DragTarget.parentNode.appendChild( DragTarget );
   DragTarget.setAttributeNS(null, 'pointer-events', 'none');
   var transMatrix = DragTarget.getCTM();
   GrabPoint.x = TrueCoords.x - Number(transMatrix.e);
   GrabPoint.y = TrueCoords.y - Number(transMatrix.f);
}
function Drag(evt)
{
   GetTrueCoords(evt);
   if(!(DragTarget))return;
   var newX = TrueCoords.x - GrabPoint.x;
   var newY = TrueCoords.y - GrabPoint.y;
   DragTarget.setAttributeNS(null, 'transform', 'translate'+'(' + newX + ',' + newY + ')');
}
function Drop(evt)
{
   if(!(DragTarget))return;
   var dropId=evt.target.getAttributeNS('PGNC','pos');
   DragTarget.removeAttributeNS(null,'pointer-events');
   if(rules.move(DragTarget.id,dropId))
   {
      game.view.plyCount++;
      game.view.color=game.view.plyCount%2
      document.getElementById('turn').textContent='⌛ '+parseInt(game.view.plyCount/2);
   }
   DragTarget.removeAttributeNS(null,'transform');
   DragTarget = null;
}
function GetTrueCoords(evt)
{
   var newScale = SVGRoot.currentScale;
   var translation = SVGRoot.currentTranslate;
   TrueCoords.x = (evt.clientX - translation.x)/newScale;
   TrueCoords.y = (evt.clientY - translation.y)/newScale;
}

game.cmd.fw=function() // keybinding : n
{
   getMove(); // update indicators
   setMove(); // move
};

game.cmd.back=function() // keybinding : p
{
};

game.cmd.displayFirst=function()
{
   while(game.view.turn!=game.start.turn||game.view.color!=game.start.color)back();
};

game.cmd.displayLast=function()
{
   while(game.view.turn!=game.turn||game.view.color!=game.color)fw();
};

//KEY BINDINGS
function handler(e)
{
   var kc=e.keyCode;
   if(kc==78)game.cmd.fw();
   if(kc==80)game.cmd.back();
   if(kc==112)
   {
      e.preventDefault();
      game.cmd.help();
   }
   if(kc==27)
   {
      document.getElementById('scrap').appendChild(document.getElementById('splash').firstChild);
   }
};
window.parent.document.addEventListener("keydown", handler, false);
window.focus();
game.cmd.help=function()
{
   document.getElementById('splash').appendChild(document.getElementById('splash-help'));
}
game.cmd.mail=function(){};
game.cmd.flag=function(){};
