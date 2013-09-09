var isEndOfGame;
var isEndOfPgn;
var isPromotion;
var gameResult;

var getMove = function()
{
   var san=game.view.pgn[0];

   if(/^\d+\./.test(san)) // turn nb
   {
      game.view.turn=san;
      game.view.pgn.splice(0,1);
      //console.info('turn: '+san);
      getMove();
      return true;
   }
   game.view.isEndOfGame=(/^\d/.test(san));
   if(game.view.isEndOfGame)
   {
      gameResult=(san.length>3)?"draw":(san.charAt(0)==1)?"white":"black";
      return ''
   }

   game.view.isEndOfPgn=(san.charCodeAt(0)==42);
   if(game.view.isEndOfPgn)
   {
      return ''
   }

   /* Castle */
   if(/^O/.test(san))
   {
      var type =  (game.view.pgn[0].match(/O/g).length==2)?+1/*short*/:-1/*long*/;
      game.view.pId  =  (game.view.plyCount%2)?game.K:game.k;
      var kSq=(game.view.plyCount%2)?60:4;
      game.view.sqId  =  2*type+kSq;
      san=san.replace(/O.*O/);
   }

   else
   {
      /* Piece class */
      if(/^[KQBNR]/.test(san))
      {
         game.view.pClass=san.charAt(0);
         san=san.substring(1);
      }
      else
         game.view.pClass="P";
      if(!game.view.color)
      {
         game.view.pClass=game.view.pClass.toLowerCase();
      }

      /* Ambiguous move */
      if(/^[a-h](x|[a-h])/.test(san))
      {
         game.view.fromx=san.charAt(0);
         san=san.substring(1);
      }
      else if(/^[1-8](x|[a-h])/.test(san))
      {
         game.view.fromy=san.charAt(0);
         san=san.substring(1);
      }
      else if(/^[a-h][1-8](x|[a-h])/.test(san))
      {
         game.view.fromx=san.charAt(0);
         game.view.fromy=san.charAt(1);
         san=san.substring(2);
      }

      /* Capture move */
      if(san.charAt(0)=="x") 
      {san = san.substring(1);}

      /* Now, the two first chars = the coord. of the destination.*/
      game.view.sqId = board.sqId(san.slice(0,2));
      san=san.substring(2);

      // Promotion
      isPromotion= (san.charCodeAt(0)==61);
      if(isPromotion)
      {
         newPiece=san.charAt(1);
         san=san.substring(2);
      }
   }
   return ''
}

var setMove = function()
{
   if(game.view.isEndOfGame)
   {
      alert("End of game : "+gameResult+"has won");
      return true;
   }

   if(game.view.isEndOfPgn)
   {
      alert("It is your turn");
      return true;
   }

   /* identify piece */
   var match = function(pId)
   {
      var from = board.sqName(document.getElementById(pId).getAttributeNS('PGNC','pos'));
      if((game.view.fromx)&& game.view.fromx!=from.charAt(0)){return false;}
      if((game.view.fromy)&& game.view.fromy!=from.charAt(1)){return false;}
      return true;
   }
   var piecesList=document.getElementById('pieces').getElementsByClassName(game.view.pClass);
   var i=0;
   if(!/'O'/.test(game.view.pgn[0]))while(i<piecesList.length)
   {
      var pid=piecesList[i].getAttributeNS(null,'id');
      if(rules.canReach(pid,game.view.sqId) && match(pid)){game.view.pId=pid;}
      i++;
   }

   if(game.view.isPromotion)
   {}

   /* Move */
   if(game.view.pId)
   {
      rules.move(game.view.pId,game.view.sqId);
      game.view.pgn.splice(0,1);
      game.view.plyCount++;
      game.view.color=game.view.plyCount%2;
      document.getElementById('turn').textContent='⌛ '+parseInt(game.view.plyCount/2);
      delete game.view.pId;
      delete game.view.fromx;
      delete game.view.fromy;
      game.history.push(game.view);
   }
   else
      PGNC.error('pgn error: invalid move');

   return null;
}

