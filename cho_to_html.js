//read file

document.querySelector("#read-button").addEventListener("click", function () {
  document.querySelector("#songtext").replaceChildren("");
  let file = document.querySelector("#file-input").files[0];
  let reader = new FileReader();
  reader.addEventListener("load", function (e) {
    let text = e.target.result;
    chopro2html(text);
  });

  reader.readAsText(file);
});

//main function
function chopro2html(f) {
  f = f.replaceAll(/\r/g, ""); // replace windows-style line ending with unix-style line ending
  // f = f.replaceAll(/</g, "&lt;"); // replace < with &lt;
  //f = f.replaceAll(/>/g, "&gt;"); // replace > with &gt;
  // f = f.replaceAll(/&/g, "&amp;"); //replace & with &amp;

  let i,
    mode = 0;

  while (f !== "") {
    f = f.replace(/^(.*)\n?/, ""); // extract and remove first line
    i = RegExp.$1;
    if (i.match(/^#(.*)/)) {
      // a line starting with # is a comment
      const newComment = document.createComment(RegExp.lastParen);
      document.querySelector("#songtext").appendChild(newComment); //insert as HTML comment
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
        document.querySelector("#songtext").appendChild(newParagraph);
      } else if (
        RegExp.lastParen.match(/^comment_italic:(.*)/i) ||
        RegExp.lastParen.match(/^ci:(.*)/i)
      ) {
        // comment_italic
        const newParagraph = document.createElement("p");
        const newComment = document.createTextNode(RegExp.lastParen);

        newParagraph.setAttribute("class", "comment_italic");
        newParagraph.appendChild(newComment);
        document.querySelector("#songtext").appendChild(newParagraph);
      } else if (
        RegExp.lastParen.match(/^comment_box:(.*)/i) ||
        RegExp.lastParen.match(/^cb:(.*)/i)
      ) {
        // comment_box
        const newParagraph = document.createElement("p");
        const newComment = document.createTextNode(RegExp.lastParen);

        newParagraph.setAttribute("class", "comment_box");
        newParagraph.appendChild(newComment);
        document.querySelector("#songtext").appendChild(newParagraph);
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
        document.querySelector("#songtext").appendChild(newComment);
      }
    } else {
      // this is a line with chords and lyrics
      let chords = [];
      let lyrics = [];
      i = i.replace(/\s/, "\xa0"); // replace spaces with hard spaces
      chords.push("");
      while (i.match(/(.*?)\[(.*?)\]/)) {
        lyrics.push(RegExp.$1);
        chords.push(RegExp.$2);
        i = i.replace(/(?:.*?)\[(?:.*?)\]/, "");
      }
      lyrics.push(i); // add rest of line

      const newTable = document.createElement("table");
      const newLyricTableRow = document.createElement("tr");

      const newChordTableRow = document.createElement("tr");
      let n = 0;
      for (let j of lyrics) {
        if (chords[n] === undefined) {
          chords[n] = "";
        }
        const newChordCell = document.createElement("td");

        const newChords = document.createTextNode(chords[n]);
        const newLyricCell = document.createElement("td");
        const newLyrics = document.createTextNode(j);
        newChordCell.appendChild(newChords);

        newChordTableRow.appendChild(newChordCell);

        newLyricCell.appendChild(newLyrics);

        newLyricTableRow.appendChild(newLyricCell);
        n++;
        newChordTableRow.setAttribute("class", "chords");
        newLyricTableRow.setAttribute("class", "lyrics");
      }

      newTable.appendChild(newChordTableRow);
      newTable.appendChild(newLyricTableRow);
      newTable.setAttribute("class", "table");

      document.querySelector("#songtext").appendChild(newTable);

      //document.querySelector("#file-contents").append("<!--Unsupported command:	$_-->\n");

      //document.querySelector("#file-contents").textContent = f;
      //document.querySelector("#song_title").textContent = song_title;
      //document.querySelector("#html_title").textContent = song_title;
    }
  }
}
