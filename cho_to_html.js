let q,infile,chopro,uplinfo,output,i;
\\read file 
document.querySelector("#read-button").addEventListener('click', function() {
		let file = document.querySelector("#file-input").files[0];
		let reader = new FileReader();
		reader.addEventListener('load', function(e) {
	    		let text = e.target.result;
                        //document.body.insertAdjacentHTML("beforeend",text);
		        document.body.insertAdjacentHTML("beforeend",chopro2html(text));
	    		//document.querySelector("#file-contents").textContent = text;
			
		});
                
                reader.readAsText(file);




	});

function chopro2html(f)

{	//read title
	let title 

	f = f.replace(/</ , "&lt;"); 	 // replace < with &lt;
	f = f.replace(/>/ , "&gt;"); 	 // replace > with &gt;
	f = f.replace(/&/ , "&amp;");	 //replace & with &amp;

	if (f.match(/{title:.*}/gi) != null){
                title = String(f.match(/{title:.*}/gi));
		f = f.replace(/{title:.*}/gi," ");
		title = title.replace(/^{title:/gi,"");
		title = title.replace(/}$/,"");
	}

	else if (f.match(/{t:.*}/gi) != null) {

		title = String(f.match(/{t:.*}/gi));
		f = f.replace(/{t:.*}/gi," ");
		title = title.replace(/^{t:/gi,"");
		title = title.replace(/}$/,"");
	} else {
		// no title found
		title = "Unnamed Song";
	}
document.body.insertAdjacentHTML("beforeend",f);
        return title;
}


/*
	print <<_END_;
<HTML><HEAD><TITLE>$title</TITLE>
<STYLE TYPE="text/css"><!--
H1 {
font-family: "Arial", Helvetica;
font-size: 24pt;
}
H2 {
font-family: "Arial", Helvetica;
font-size: 16pt;
}
.lyrics, .lyrics_chorus { font-size 12pt; }
.lyrics_tab, .lyrics_chorus_tab { font-family: "Courier New", Courier; font-size 10pt; }
.lyrics_chorus, .lyrics_chorus_tab, .chords_chorus, .chords_chorus_tab { font-weight: bold; }
.chords, .chords_chorus, .chords_tab, .chords_chorus_tab { font-size: 10pt; color: blue; padding-right: 4pt;}

.comment, .comment_italic, .comment_box { background-color: #ffbbaa; }
.comment_italic { font-style: italic; }
.comment_box { border: solid; }
--></STYLE>
</HEAD><BODY>
<!--\nConverted from ChordPro format with Web Chord by	Martin Vilcans
(see http://www.algonet.se/~marvil/webchord-->
_END_

	my($mode) = 0; # mode defines which class to use

	#mode =           0           1              2             3
	#	      normal      chorus         normal+tab    chorus+tab
	my @lClasses = ('lyrics', 'lyrics_chorus', 'lyrics_tab', 'lyrics_chorus_tab'  );
	my @cClasses = ('chords', 'chords_chorus', 'chords_tab', 'chords_chorus_tab'  );

	while($chopro ne '') {
		$chopro	=~ s/(.*)\n?//; # extract and remove first line
		$_ = $1;
		chomp;

		if(/^#(.*)/) {                                  # a line starting with # is a comment
			print "<!--$1-->\n";                    # insert as HTML comment
		} elsif(/{(.*)}/) {                             # this is a command
			$_ = $1;
			if(/^title:/i || /^t:/i) {                  # title
				print "<H1>$'</H1>\n";
			} elsif(/^subtitle:/i || /^st:/i) {         # subtitle
				print "<H2>$'</H2>\n";
			} elsif(/^start_of_chorus/i || /^soc/i)	{   # start_of_chorus
				$mode |= 1;
			} elsif(/^end_of_chorus/i || /^eoc/i) {     # end_of_chorus
				$mode &= ~1;
			} elsif(/^comment:/i ||	/^c:/i)	{           # comment
				print "<P class=\"comment\">$'</P>\n";
			} elsif(/^comment_italic:/i || /^ci:/i)	{   # comment_italic
				print "<P class=\"comment_italic\">$'</P>\n";
			} elsif(/^comment_box:/i || /^cb:/i) {      # comment_box
				print "<P class=\"comment_box\">$'</P>\n";
			} elsif(/^start_of_tab/i || /^sot/i) {      # start_of_tab
				$mode |= 2;
			} elsif(/^end_of_tab/i || /^eot/i) {        # end_of_tab
				$mode &= ~2;
			} else {
				print "<!--Unsupported command:	$_-->\n";
			}
		} else { # this is a line with chords and lyrics
			my(@chords,@lyrics);
			@chords=("");
			@lyrics=();
			s/\s/\&nbsp;/g;					# replace spaces with hard spaces
			while(s/(.*?)\[(.*?)\]//) {
				push(@lyrics,$1);
				push(@chords,$2	eq '\'|' ? '|' : $2);
			}
			push(@lyrics,$_);				# rest of line (after last chord) into @lyrics

			if($lyrics[0] eq "") {			# line began with a chord
				shift(@chords);				# remove first item
				shift(@lyrics);				# (they	are both empty)
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
		}
	}	#while
} 

*/
