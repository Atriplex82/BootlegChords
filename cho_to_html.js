//read file
document.querySelector("#read-button").addEventListener("click", function () {
  let file = document.querySelector("#file-input").files[0];
  let reader = new FileReader();
  reader.addEventListener("load", function (e) {
    let text = e.target.result;
    chopro2html(text);
    //document.querySelector("#test").textContent = String(text);
    //document.body.insertAdjacentHTML("beforeend",text);
  });

  reader.readAsText(file);
});
//main function
function chopro2html(f) {
  //read title

  f = f.replace(/</, "&lt;"); // replace < with &lt;
  f = f.replace(/>/, "&gt;"); // replace > with &gt;
  f = f.replace(/&/, "&amp;"); //replace & with &amp;

  let i,
    mode = 0;

  while (f != "") {
    f = f.replace(/^(.*)\n?/, ""); // extract and remove first line
    i = RegExp.$1;
    if (i.match(/^#(.*)/)) {
      // a line starting with # is a comment
      const newComment = document.createComment(RegExp.lastParen);
      document.body.appendChild(newComment); //insert as HTML comment
    } else if (i.match(/{(.*)}/)) {
      if (
        RegExp.lastParen.match(/^t:(.*)/i) ||
        RegExp.lastParen.match(/^title:(.*)/i)
      ) {
        document.querySelector("#song_title").textContent = RegExp.lastParen; //title
        //document.querySelector("#html_title").textContent = RegExp.lastParen;
      } else if (
        RegExp.lastParen.match(/^subtitle:(.*)/i) ||
        RegExp.lastParen.match(/^st:(.*)/i)
      ) {
        //subtitle

        document.querySelector("#subtitle").textContent = RegExp.lastParen;
      } else if (
        RegExp.lastParen.match(/^start_of_chorus/i) ||
        RegExp.lastParen.match(/^soc/i)
      ) {
        // start_of_chorus
        mode |= 1;
      } else if (
        RegExp.lastParen.match(/^end_of_chorus/i) ||
        RegExp.lastParen.match(/^eoc/i)
      ) {
        // end_of_chorus
        mode &= ~1;
      } else if (
        RegExp.lastParen.match(/^comment:(.*)/i) ||
        RegExp.lastParen.match(/^c:(.*)/i)
      ) {
        // comment
        const newParagraph = document.createElement("p");
        const newComment = document.createTextNode(RegExp.lastParen);

        newParagraph.setAttribute("class", "comment");
        newParagraph.appendChild(newComment);
        document.body.appendChild(newParagraph);
      } else if (
        RegExp.lastParen.match(/^comment_italic:(.*)/i) ||
        RegExp.lastParen.match(/^ci:(.*)/i)
      ) {
        // comment_italic
        const newParagraph = document.createElement("p");
        const newComment = document.createTextNode(RegExp.lastParen);

        newParagraph.setAttribute("class", "comment_italic");
        newParagraph.appendChild(newComment);
        document.body.appendChild(newParagraph);
      } else if (
        RegExp.lastParen.match(/^comment_box:(.*)/i) ||
        RegExp.lastParen.match(/^cb:(.*)/i)
      ) {
        // comment_box
        const newParagraph = document.createElement("p");
        const newComment = document.createTextNode(RegExp.lastParen);

        newParagraph.setAttribute("class", "comment_box");
        newParagraph.appendChild(newComment);
        document.body.appendChild(newParagraph);
      } else if (
        RegExp.lastParen.match(/^start_of_tab/i) ||
        RegExp.lastParen.match(/^sot/i)
      ) {
        // start_of_tab
        mode |= 2;
      } else if (
        RegExp.lastParen.match(/^end_of_tab/i) ||
        RegExp.lastParen.match(/^eot/i)
      ) {
        // end_of_tab
        mode &= ~2;
      } else {
        const newComment = document.createComment(
          "Unsupported Command RegExp.lastParen"
        );
        document.body.appendChild(newComment);
      }
    } else {
      // this is a line with chords and lyrics
      let chords = [];
      let lyrics = [];
      i = i.replace(/\s/, "\xa0"); // replace spaces with hard spaces
      while (i.match(/(.*?)\[(.*?)\]/)) {
        lyrics.push(RegExp.$1);
        chords.push(RegExp.$2);
        i = i.replace(/(?:.*?)\[(?:.*?)\]/, "");
      }
      const newParagraph = document.createElement("p");
      const newComment = document.createTextNode(lyrics, chords);

      newParagraph.setAttribute("class", "content");
      newParagraph.appendChild(newComment);
      document.body.appendChild(newParagraph);
      /*
          lyrics.push($_);				// rest of line (after last chord) into @lyrics
    
          if($lyrics[0] eq "") {			// line began with a chord
            shift(@chords);				// remove first item
            shift(@lyrics);				// (they	are both empty)
          }
    
          if(@lyrics==0) {	# empty	line?
            print "<BR>\n";
          } elsif(@lyrics==1 && $chords[0] eq "")	{	# line without chords
            print "<DIV class=\"$lClasses[$mode]\">$lyrics[0]</DIV>\n";
          } else {
            print "<TABLE cellpadding=0 cellspacing=0>";
            print "<TR>\n";
            my($i);
            for($i = 0; $i < @chords; $i++) {
              print "<TD class=\"$cClasses[$mode]\">$chords[$i]</TD>";
            }
            print "</TR>\n<TR>\n";
            for($i = 0; $i < @lyrics; $i++) {
              print "<TD class=\"$lClasses[$mode]\">$lyrics[$i]</TD>";
            }
            print "</TR></TABLE>\n";
          }
        }*/
      //document.querySelector("#file-contents").append("<!--Unsupported command:	$_-->\n");

      //document.querySelector("#file-contents").textContent = f;
      //document.querySelector("#song_title").textContent = song_title;
      //document.querySelector("#html_title").textContent = song_title;
    }
  }
}
/*const newParagraph = document.body.createElement("p");
  //newParagraph.setAttribute("class", "comment");
  const newComment = document.createTextNode("Hallo du da");
  newParagraph.appendChild(newComment);
  const id = document.getElementById("xyz");
  document.body.insertBefore(newParagraph, id); 
  */
