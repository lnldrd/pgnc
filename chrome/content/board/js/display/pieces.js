var pieces=
{
   color : function(id){return (id)?/[A-Z]/.test(id.charAt(0))?1:0:NaN},
   value : function(id){return id.charAt(0)},
   list : document.getElementById('pieces').getElementsByTagNameNS(svgNS,'image'),

   init : function(fen)
   {
      // fen --> 64 chars
      var fenStr=fen;
      fenStr=fenStr.replace(/\//g,'');
      while(fenStr.match(/\d/))//empty squares
      {
         var n=fenStr.match(/\d/)[0];
         fenStr=fenStr.replace(n,repeat("ø",parseInt(n)));
      }
      // create pieces
      for(let i=0;i<64;i++)
      {
         if(fenStr[i]!="ø")
         {
            let newPiece = document.createElementNS(svgNS,'image');
            newPiece.setAttributeNS(null,'id',fenStr[i]+i.toString());
            newPiece.setAttributeNS(null,'class',fenStr[i]);
            newPiece.setAttributeNS('PGNC','pos',i);
            document.getElementById('pieces').appendChild(newPiece);

            var sq=document.getElementById(i);
            sq.setAttributeNS('PGNC','p',newPiece.id);

            // kings //
            if(fenStr[i]=='K')game.K=newPiece.id;
            if(fenStr[i]=='k')game.k=newPiece.id;
         }
      }
      // placement
      this.refresh();
   },


   refresh : function() // placement
   {
      for(let i=0;i<pieces.list.length; i++)
      {
         let piece=pieces.list.item(i);
         let sq=document.getElementById(piece.getAttributeNS('PGNC','pos'));
         piece.setAttributeNS(null,'width',50);
         piece.setAttributeNS(null,'height',50);
         piece.setAttributeNS(null,'x',sq.getAttributeNS(null,'x'));
         piece.setAttributeNS(null,'y',sq.getAttributeNS(null,'y'));
         piece.setAttributeNS(svgNS,'preserveAspectRatio',"xMidYMid meet");
         piece.setAttributeNS(xlinkNS,'href',"chrome://PGNChess/skin/"+piece.getAttributeNS(null,'class')+".png");
      }
   },

}
