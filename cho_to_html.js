let q,infile,uplinfo,output;
//read file 
document.querySelector("#read-button").addEventListener('click', function() {
	let file = document.querySelector("#file-input").files[0];
	let reader = new FileReader();
	reader.addEventListener('load', function(e) {
		let text = e.target.result;
		chopro2html(text);

  	//document.body.insertAdjacentHTML("beforeend",text);
 	  //document.body.insertAdjacentHTML("beforeend",chopro2html(text));
		//document.querySelector("#file-contents").textContent = text;
			
	});
    
	reader.readAsText(file);




});

function chopro2html(f){

	//read title
	//let song_title 

	f = f.replace(/</ , "&lt;"); 	 // replace < with &lt;
	f = f.replace(/>/ , "&gt;"); 	 // replace > with &gt;
	f = f.replace(/&/ , "&amp;");	 //replace & with &amp;
/*
	if (f.match(/{title:.*}/gi) != null){
                song_title = String(f.match(/{title:.*}/gi));
		f = f.replace(/{title:.*}/gi,"");
		song_title = song_title.replace(/^{title:/gi,"");
		song_title = song_title.replace(/}$/,"");
	}

	else if (f.match(/{t:.*}/gi) != null) {

		song_title = String(f.match(/{t:.*}/gi));
		f = f.replace(/{t:.*}/gi,"");
		song_title = song_title.replace(/^{t:/gi,"");
		song_title = song_title.replace(/}$/,"");
	} else {
		// no title found
		song_title = "Unnamed Song";
	}
	*/
let Command = /{(.*)}/;
while( f != '') {

	f = f.replace(/^.*\n?/,"");   // extract and remove first line

	if(f.match(/#.*/)) {                                 // a line starting with # is a comment

		f = f.replace(/^#(.*)/,"<!-- $1 -->\n");         //insert as HTML comment
	}
    
		if (Command.test(f)){

			
	  	if( RegExp.$1.match(/^t:(.*)/)  || RegExp.$1.match(/^title:(.*)/i)  ) {  
			  document.querySelector("#song_title").textContent = RegExp.lastParen;     
			
			}
			else if (RegExp.$1.match(/^subtitle:(.*)/i) || RegExp.$1.match(/^st:(.*)/i)){
				document.querySelector("#subtitle").textContent = RegExp.lastParen;
			}

		}

	document.querySelector("#file-contents").textContent = f;





//}
	//document.querySelector("#song_title").textContent = song_title;
	//document.querySelector("#html_title").textContent = song_title;

}
}
