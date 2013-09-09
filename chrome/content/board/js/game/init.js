//XUL PREFS
//var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.PGNChess.");
//var scale = prefs.getBoolPref("scale");
//XUL NOTIF.BOX

//PGN Example
//
var PGN= new String('Exemple complet (que vous pouvez copier/coller pour l\'importer avec.. iEchecs)\n [Event \"Deep Junior / Garry Kasparov\"]\n [Site \"New York\"]\n [Date \"2003\"]\n [Round \"3\"]\n [White \"Kasparov, Garry\"]\n [Black \"Deep Junior\"]\n [Result \"0-1\"]\n 1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Nf3 Nbd7 6. Qc2 b6 7. cxd5 exd5 8. Bd3 Be7 9. Bd2 O-O 10. g4 Nxg4 11. Rg1 Ndf6 12. h3 Nh6 13. e4 dxe4 14. Bxh6 exd3 15. Rxg7+ Kh8 16. Qxd3 Rg8 17. Rxg8+ Nxg8 18. Bf4 f6 19. O-O-O Bd6 20. Qe3 Bxf4 21. Qxf4 Bxh3 22. Rg1 Qb8 23. Qe3 Qd6 24. Nh4 Be6 25. Rh1 Rd8 26. Ng6+ Kg7 27. Nf4 Bf5 28. Nce2 Ne7 29. Ng3 Kh8 30. Nxf5 Nxf5 31. Qe4 Qd7 32. Rh5 Nxd4 33. Ng6+ Kg8 34. Ne7+ Kf8 35. Nd5 Qg7 36. Qxd4 Rxd5 0-1 ');
//
//
//PGN = '[Event "white to move"]\
//[FEN "rn2r1k1/ppq2pb1/2pp2pp/8/2PQn1b1/1PN2NP1/PB3PBP/3RR1K1 w - - 0 17"]\
//17. Qxg7 Kxg7 18. Nd5 Kf8 19. Nxc7 *'
//
//

// consts
const PGNC = window.parent.PGNC;
const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = "http://www.w3.org/1999/xlink";
const standardFEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
//INIT FUNCTION
var game= 
{
   extract : function ()
   {
      /* clean */
      var pgnText=PGN;
      pgnText = pgnText.replace(/(^\s*|\s*<br\s*\/>\s*|\s*$)/gmi,'');//html
      pgnText = pgnText.replace(/[\n\t\r]/gm,' ');//inline
      pgnText = pgnText.replace(/(\{.*?\})/g,' ');//remove comments
      pgnText = pgnText.replace(/(\(.*?\))/g,' ');//remove variants
      pgnText = pgnText.trim(); 
      /* game info */
      game.info= new Object;
      var exp= new RegExp("[^\\[]*\\[([A-z]*)\\s+[\"']?\\s*([^\"']*)\\s*[\"']?\\s*\\]\\s*","g");
      for(let i=0;i<pgnText.match(/\[/g).length;i++){ //parse all tags
         var tag = exp.exec(pgnText);
         eval('game.info.'+String(tag[1]).toLowerCase()+'="'+String(tag[2])+'";');
         console.log('extracted: '+tag[1]);
      }
      pgnText=pgnText.replace(/^.*\]/,'').trim(); //remove tags.
      /* SAN array */
      console.log('san: '+pgnText);
      return pgnText.split(/\s+/);
   },

   init : function()
   {
      var san = game.extract();
      var fen = ((game.info.fen)?game.info.fen:standardFEN).split(/\s+/);
      board.init(fen[0]);
      //internal fen format
      var plyCount   =  2*(fen[5]-1)+((fen[1]=='w')?1:2);
      game.view   =  game.start  =  new view(fen[0],(fen[1]=='w')?'1':'-1',fen[2],fen[3],fen[5],san,plyCount);
      game.view.update  =  function(){}

      game.history   =  new Array;
      game.history.push(game.view);
   },
}

var view = function(fen,color,castle,ep,turn,pgn,plyCount)
{
   this.fen=fen;
   this.color=color;
   this.canCastle=castle;
   this.enPassant=ep;
   this.turn=turn;
   this.pgn=pgn;
   this.plyCount=plyCount;
   this.display=display;
}

function display() // display view in game.view
{}

// AUX FUNCTIONS.
function inline(){return this.replace(/[\n\t\r]/gm,' ')};
function sign(x){return x?x<0?-1:1:0;};
function repeat(pattern, count) {
   if (count < 1) return '';
   var result = '';
   while (count > 0) {
      if (count & 1) result += pattern;
      count >>= 1, pattern += pattern;
   }
   return result;
}
