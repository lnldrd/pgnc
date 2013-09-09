var rules=
{
   move : function(pId,sqId)
   {
      // trivial cases //
      if(pieces.color(pId)!=game.view.plyCount%2)return false;
      if(!rules.canReach(pId,sqId)){PGNC.warn('invalid move');return false};

      // store infos //
      var p=document.getElementById(pId);
      var sq=document.getElementById(sqId);
      var from=document.getElementById(p.getAttributeNS('PGNC','pos'));
      var kill=document.getElementById(sq.getAttributeNS('PGNC','p'));

      // make changes //
      p.setAttributeNS('PGNC','pos',sq.id);
      sq.setAttributeNS('PGNC','p',p.id);
      from.removeAttributeNS('PGNC','p');
      if(kill)document.getElementById('scrap').appendChild(kill);

      // if necessary, revert changes and exit //
      if(rules.isCheck(game.view.plyCount%2))
      {
         p.setAttributeNS('PGNC','pos',from.id);
         from.setAttributeNS('PGNC','p',pId);
         if(kill)
         {
            document.getElementById('pieces').appendChild(kill);
            sq.setAttributeNS('PGNC','p',kill.id);
         }
         PGNC.warn('invalid move');
         return false;
      }

      // display move //
      p.setAttributeNS(null,'x',sq.getAttributeNS(null,'x'));
      p.setAttributeNS(null,'y',sq.getAttributeNS(null,'y'));

      // exit //
      return true;
   },

   canReach : function(pId,sqId)
   {
      var p = document.getElementById(pId);
      var type = pieces.value(pId);
      var color = pieces.color(pId);
      var from = parseInt(p.getAttributeNS('PGNC','pos'));

      var sq=document.getElementById(sqId);
      var kill=sq.getAttributeNS('PGNC','p');

      if(pieces.color(pId)==pieces.color(kill)) return false;

      var pSign=color?1:-1;
      var pCol  = board.col(from);   var pRow  = board.row(from);
      var sqCol = board.col(sqId);   var sqRow = board.row(sqId);
      var dCol  = sqCol-pCol; var dRow  = (sqRow-pRow)*pSign;

      if(/p/i.test(type))
      {
         var ep=parseInt(sqId)+8*pSign;
         if(game.view.enPassant==sqId)
             kill=document.getElementById(ep).getAttributeNS('PGNC','p');

         var t1 = ( dCol==0 && dRow==1 && !(kill) );
         var t2 = ( Math.abs(dCol)==1 && dRow==1 && (kill) );
         var t3 = ( pRow%5==2 && dCol==0 && dRow==2 && !(kill) & board.isEmpty(ep));

         if(t3)game.view.enPassant=ep;

         var t=(t1||t2||t3);
      }

      else if(/n/i.test(type))
      {
         var t= (Math.abs(dCol)+Math.abs(dRow)==3) && (dCol*dRow!=0);
      }

      else if(/r/i.test(type))
      {
         var t = (dCol*dRow==0) && rules.chkPath(from,sqId);
      }

      else if(/b/i.test(type))
      {
         var t = ((dCol-dRow)*(dCol+dRow)==0) && rules.chkPath(from,sqId);
      }

      else if(/q/i.test(type))
      {
         var t = (dCol*dRow*(dCol-dRow)*(dCol+dRow)==0) && rules.chkPath(from,sqId);
      }

      else if(/k/i.test(type))
      {
         if(Math.abs(dCol)==2 && dRow==0) /* Castle move */
         {
            var str=(dCol>0)?color?'K':'k':color?'Q':'q';
            if(!game.view.canCastle.match(str))return false;
            var king=document.getElementById(eval('game.'+type));
            var rId=document.getElementById((dCol>0)?from+3:from-4).getAttributeNS('PGNC','p');
            var t = rules.isSafe(color,(dCol>0)?from+1:from-1) && rules.isSafe(color,(dCol>0)?from+2:from-2) && rules.chkPath(king.id,rId);
            if(t) rules.move(rId,(from+sqId)/2);
         }
         else
         {
            var t = (Math.max(Math.abs(dCol),Math.abs(dRow))==1);
         }
      }
      return(t);
   },

   chkPath : function(from,sqId)
   {
      var pCol=board.col(from);  var pRow=board.row(from);
      var sqCol=board.col(sqId); var sqRow=board.row(sqId);
      var dCol=sqCol-pCol;       var dRow=sqRow-pRow;
      var l=(Math.abs(dCol)+Math.abs(dRow));l=(dCol*dRow==0)?l:l/2;
      var t=true;
      for(let i=1;i<l;i++)
      {
         var id=from+i*dCol/l-8*i*dRow/l;
         if(!board.isEmpty(id)) t=false;
      }
      return t;
   },

   isCheck : function(color)
   {
      var kId=document.getElementById(color?game.K:game.k).getAttributeNS('PGNC','pos'); // king square
      var pList=document.getElementById('pieces').getElementsByTagNameNS(svgNS,'image'); // active pieces
      for(let i=0;i<pList.length;i++)
      { 
         if(rules.canReach(pList.item(i).id,kId))
         {
           return true;
         }
      }
      return false;
   },

   isSafe : function(color,sqId)
   {
      var king = document.getElementById(color?game.K:game.k);
      var from = document.getElementById(king.getAttributeNS('PGNC','pos'));
      var sq   = document.getElementById(sqId);
      var kill = document.getElementById(sq.getAttributeNS('PGNC','p'));
      /* make changes */
      king.setAttributeNS('PGNC','pos',sqId);
      sq.setAttributeNS('PGNC','p',king.id);
      from.removeAttributeNS('PGNC','p');
      if(kill) document.getElementById('scrap').appendChild(kill);

      var t = !rules.isCheck(color);
      /* revert changes */
      king.setAttributeNS('PGNC','pos',from.id);
      sq.removeAttributeNS('PGNC','p');
      from.setAttributeNS('PGNC','p',king.id);
      if(kill)
      {
         sq.setAttributeNS('PGNC','p',kill.id);
         document.getElementById('pieces').appendChild(kill);
      }
      /* exit */
      return(t);
   }
}
