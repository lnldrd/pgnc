var board=
{
   // AUX //
   sqName : function(id)
   {return String.fromCharCode(97+id%8,56-parseInt(id/8))},
   sqId : function(name)
   {return name.charCodeAt(0)-8*name.charCodeAt(1)+351},
   sqColor : function(id)
   {return ((parseInt(id/8)+id%8)%2)?"b":"w";},
   col : function (id)
   {return 1+id%8},
   row : function (id)
   {return 8-parseInt(id/8)},
   isEmpty : function(id)
   {return !(document.getElementById(id).getAttributeNS('PGNC','p'))},
   
   // INIT //
   init : function(fen)
   {
      //appendLog('cmds tag...');
      this.btnList=[['turn','mail','flag','displayFirst','back','fw','displayLast','zoom','flip'],['⌛ '+1,'✉', '⚐','◃◃','◅','▻','▹▹','◰','◪']];
      for(let i=0;i<9;i++)
      {
         var btnName=this.btnList[0][i];
         var newBtn=document.createElementNS(svgNS,'text');
         newBtn.setAttributeNS(null,'id',btnName);
         newBtn.setAttributeNS(null,'class','label');
         newBtn.setAttributeNS(null,"text-anchor",'middle');
         newBtn.textContent=this.btnList[1][i];
         document.getElementById('tags').appendChild(newBtn);
         document.getElementById(btnName).addEventListener('click',eval('game.cmd.'+btnName), false);
      }
      //appendLog('axis tag...');
      var axis=['x','y'];
      for (let i=0;i<=1;i++)
         for (let n=1;n<=8;n++)
         {
            var newTag = document.createElementNS(svgNS,'text');
            newTag.setAttributeNS(null,"text-anchor",'middle');
            newTag.setAttributeNS(null,'class','label');
            newTag.setAttributeNS(null,'id',axis[i]+n.toString());
            var textNode = document.createTextNode((i==0)?String.fromCharCode(96 + n):n);
            newTag.appendChild(textNode);
            document.getElementById('tags').appendChild(newTag);
         }
      //appendLog('squares init...');
      for(let i=0;i<64;i++)
         {
            let newSquare = document.createElementNS(svgNS,'rect');
            newSquare.setAttributeNS(null,'rx',"2");
            newSquare.setAttributeNS(null,'width',50);
            newSquare.setAttributeNS(null,'height',50);
            newSquare.setAttributeNS(null,'id',i.toString());
            newSquare.setAttributeNS('PGNC','pos',i.toString()); // for Drag&Drop
            newSquare.setAttributeNS(null,'name',this.sqName(i));
            newSquare.setAttributeNS(null,'class',this.sqColor(i)+"Square");
         //newSquare.setAttributeNS(svgNS,'preserveAspectRatio',"xMidYMid meet");
            //newSquare.setAttributeNS(xlinkNS,'href',"chrome://PGNChess/skin/"+this.sqColor(i)+"sq.png");
            document.getElementById('board').appendChild(newSquare);
         }

      /*names*/
      let newTag = document.createElementNS(svgNS,'text');
      newTag.setAttributeNS(null,'class','label');
      newTag.setAttributeNS(null,'id','player1');
      newTag.setAttributeNS(null,"text-anchor",'middle');
      let textNode = document.createTextNode('♔ '+game.info.white);
      newTag.setAttributeNS(null,'x',this.x(3));
      newTag.setAttributeNS(null,'y',this.y(8.4));
      newTag.appendChild(textNode);
      document.getElementById('tags').appendChild(newTag);

      let newTag = document.createElementNS(svgNS,'text');
      newTag.setAttributeNS(null,'class','label');
      newTag.setAttributeNS(null,'id','player2');
      newTag.setAttributeNS(null,"text-anchor",'middle');
      let textNode = document.createTextNode('♚ '+game.info.black);
      newTag.setAttributeNS(null,'x',this.x(7));
      newTag.setAttributeNS(null,'y',this.y(8.4));
      newTag.appendChild(textNode);
      document.getElementById('tags').appendChild(newTag);
      this.refresh();
      pieces.init(fen);
   },
   // REFRESH //
   // flip //
   isSwitch : false,
   // coord //
   x : function(n)
   {return 50*((this.isSwitch)?(9-n):(n))},
   y : function(n)
   {return 50*((this.isSwitch)?(n):(9-n))},

   refresh : function()
   {
      var sqList=document.getElementById('board').getElementsByTagNameNS(svgNS,'rect');
      for(let i=0;i<sqList.length; i++)
      {
         var sq=sqList.item(i);
         var id=sq.getAttributeNS(null,'id');
         sq.setAttributeNS(null,'x',this.x(1+id%8));
         sq.setAttributeNS(null,'y',this.y(8-parseInt(id/8)));
      }
      // xtags //
      for (let n=1;n<=8;n++)
      {
         let tag=document.getElementById('x'+n.toString());
         tag.setAttributeNS(null,"x",this.x(n)+.5*50);
         tag.setAttributeNS(null,"y",this.y((this.isSwitch)?9.5:-.5)); 
         tag.setAttributeNS(null,"font-size",.4*50);
      }
      // ytags //
      for(let n=1;n<=8;n++)
      {
         let tag=document.getElementById('y'+n.toString());
         tag.setAttributeNS(null,"x",this.x((this.isSwitch)?8.5:.5));
         tag.setAttributeNS(null,"y",this.y(n)+0.7*50); 
         tag.setAttributeNS(null,"font-size",.4*50);
      }
      // cmd //
      for(let i=0;i<9;i++)
      {
         let btn=document.getElementById(this.btnList[0][i]);
         btn.setAttributeNS(null,"x",this.x((this.isSwitch)?-.5:9.5)); 
         btn.setAttributeNS(null,"y",this.y((this.isSwitch)?.6+i:8.4-i));     
         btn.setAttributeNS(null,"font-size",50/2);
      }
         document.getElementById('turn').setAttributeNS(null,"font-size",.3*50);
   },
}

game.cmd.turn =function(){};
// CMD //
game.cmd.flip = function()
{
   board.isSwitch=!board.isSwitch;
   board.refresh();
   pieces.refresh();
   PGNC.warn('flip:'+((board.isSwitch)?'black':'white'));
   console.info('flip:'+((board.isSwitch)?'black':'white'));
}

var fitScreen = false;
game.cmd.zoom = function(){
   window.parent.document.getElementsByTagName('embed')[0].setAttributeNS(null,'width',(fitScreen)?'500':'100%');
   window.parent.document.getElementsByTagName('embed')[0].setAttributeNS(null,'height',(fitScreen)?'500':'100%');
   fitScreen=!fitScreen;
   console.info('Rescale');
};
