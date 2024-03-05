/*
 * Licence CC-BY-SA 3.0 Kaligula 2013+ (script, icons)
 *  http://creativecommons.org/licenses/by-sa/3.0/
 *
 * idea from Rod Hilton – http://www.nomachetejuggling.com/2012/03/30/how-to-clean-up-your-chrome-bookmark-bar/
 * color scheme from http://www.elektroda.pl/rtvforum/index.php?sid=
 *
 */

function Scroll(x,y){
	//default to bottom
	var x = (x?x:0);
	var y = (y?y:document.documentElement.offsetHeight);
	window.scroll(x,y);
}

function toggle(a){
	var u=document.querySelectorAll(a);
	for(var i=0;i<u.length;i++){
		if(u[i].className.match(/\bnoshow\b/)){
			u[i].className = u[i].className.replace(/\bnoshow\b/g,'');
		} else {
			u[i].className += ' noshow';
		}
	}
}
 
function searchResults(r) {
	var i,ch,a,b,c,d,e,f,g,ico,icosrc,basesf,baseico,l,isJS;
	var container=document.querySelector('#searchResults tbody');
	clearResults();
	for (var i=0;i<r.length;i++) {
		isJS=r[i].url.match(/^javascript:/);
		if (!isJS) {isData=r[i].url.match(/^data:/);}
		a=document.createElement( isJS ? 'span' : 'a');
			if(!isJS&&!isData)a.setAttribute('href',r[i].url);
			a.setAttribute('title',r[i].url);
			a.setAttribute('dateAdded',r[i].dateAdded);
			a.setAttribute('objectId',r[i].id);
			a.setAttribute('index',r[i].index);
			a.setAttribute('parentId',r[i].parentId);
			a.setAttribute('target','blank');
			a.appendChild(document.createTextNode( r[i].title!='' ? r[i].title : '(bookmark without name)') );
		b=document.createElement('td');
			b.className='name';
			b.appendChild(a);

		if(r[i].url.match(/^http/)){
			icosrc=r[i].url.match(/.*?\/\/(.*?)\//)[1];
			ico=document.createElement('img');
			ico.setAttribute('src','https://plus.google.com/_/favicon?domain='+icosrc);
			ico.setAttribute('title','Right-click this icon, save on Your disk and use any external website to encode it to base64. Links are provided somewhere on this page.');
		} else {
			icosrc=false;
			ch=document.createTextNode( isJS ? '(JS)' : (isData?'Data':'') );
			ico=document.createElement('small');
			ico.setAttribute('title','This is a bookmarklet (bookmark with JavaScript or a data link) so it isn\'t realted to any website (thus icons) by default. However, you can choose your own icon for this bookmarklet and add to it (the same way as others).');
			ico.appendChild(ch);
		}
		c=document.createElement('td');
			c.className='icon';
			c.appendChild(ico);
		if(icosrc){
			l=document.createElement('a');
				l.setAttribute('href','http://www.kaligula.uk/base64/?domain='+icosrc);
				l.setAttribute('target','_blank');
				l.innerText = '[get code]';
				l.className = 'external';
				l.setAttribute('title','This link opens an external page which will provide a base64 code for the icon on the left.');
			c.appendChild(l);
		}

		basesf=document.createElement('textarea');
			basesf.setAttribute('rows','2');
			basesf.setAttribute('cols','40');
			basesf.addEventListener('input',updateBase64Ico);
		baseico=document.createElement('img');
			baseico.src='';
		d=document.createElement('td');
			d.className='base64';
			d.appendChild(basesf);
			d.appendChild(baseico);

		e=document.createElement('td');
			e.className='add';
			e.addEventListener('click',addBookmark);
		f=document.createElement('td');
			f.className='remove';
			f.addEventListener('click',removeBookmark);

		g=document.createElement('tr');
			g.className='result';
			g.appendChild(b);
			g.appendChild(c);
			g.appendChild(d);
			g.appendChild(e);
			g.appendChild(f);
		container.appendChild(g);
	}
}

function clearResults() {
	document.querySelector('#searchResults tbody').innerHTML='<tr class="noshow"><td class="name">bookmark</td><td class="icon">icon</td><td class="base64">base64</td><td class="add">[+]</td><td class="remove">[X]</td></tr>';
}

function searchB(evt){
	if(this.value.length>2){
		chrome.bookmarks.search(this.value,searchResults);
	} else {
		clearResults();
	}
}

function updateBase64Ico(){
/*	if (!this.value.match(/data:/))
		this.value = 'data:'+this.value;*/
	this.nextSibling.src=this.value;
}

function addBookmark(el) {
	el=el.srcElement.parentNode.parentNode.removeChild(el.srcElement.parentNode);
	document.querySelector('#addedFavicons tbody').appendChild(el);
}
function removeBookmark(el) {
	el=el.srcElement.parentNode.parentNode.removeChild(el.srcElement.parentNode);
	document.querySelector('#searchResults tbody').appendChild(el);
}

function editBookmarks(){
	var rows=document.querySelectorAll('#addedFavicons .result');
	var out=document.querySelector('#output');
	var err=document.querySelector('#outputError');
	if(rows.length==0){
		err.innerText='No bookmarks and favicons has been chosen!';
		if(err.className.match('noshow'))toggle('#outputError');
		if(!out.className.match('noshow'))toggle('#output, #mainDivSave');
		return;
	} else {
		if(!err.className.match('noshow'))err.className='noshow';
		text='data:text/html,' //GLOBAL!!! //DEBUG!!!
			+'<!DOCTYPE NETSCAPE-Bookmark-file-1>%0D%0A'
			+'<!-- This is an automatically generated file.%0D%0A'
			+'     It will be read and overwritten.%0D%0A'
			+'     DO NOT EDIT! -->%0D%0A'
			+'<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">%0D%0A'
			+'<TITLE>Bookmarks</TITLE>%0D%0A'
			+'<H1>Bookmarks</H1>%0D%0A'
			+'<DL><p>%0D%0A';
		for(var i=0;i<rows.length;i++){
			var name=rows[i].querySelector('td.name a, td.name span').innerText;
				if(name=='(bookmark without name)')name='';
			var url=rows[i].querySelector('td.name a, td.name span').getAttribute('title').replace(/"/g,'&quot;').replace(/%22/g,'%2522').replace(/#/g,'%23');
			var dateadded=rows[i].querySelector('td.name a, td.name span').getAttribute('dateadded').substring(0,10);
			var icon=rows[i].querySelector('td.base64 textarea').value;
			text+='%09<DT><A HREF="'+url+'" ADD_DATE="'+dateadded+'" ICON="'+icon+'">'+name+'</A>%0D%0A';
		}
		text+='</DL><p>%0D%0A';

		document.querySelector('#output a').href=text;
		if(out.className.match('noshow'))toggle('#output, #mainDivSave');
	}
	Scroll();
}

function savedAndImport(){
	toggle('#mainDivImport');
	Scroll();
	//scrollBy(0,90);
}

function removeImportedFolder(){
	chrome.bookmarks.removeTree(
		window.removeImportedFolder_id,
		function(response){
			console.log(response);
			Scroll();
			alert('Done.')
		}
	);
}
chrome.bookmarks.onImportEnded.addListener(function(){
	chrome.bookmarks.getSubTree(
		'1',
		function(tree){
			alert('It seems you\'ve imported the bookmarks. Follow the last instructions…');
			var bbar=tree[0]['children'];
			var folder=bbar[bbar.length-1];
			window.removeImportedFolder_id=folder.id;
			document.querySelector('#mainDivRemove p strong span').innerText=folder.title;
			document.querySelector('#mainDivRemove p strong em').innerText=(new Date (folder.dateAdded).toGMTString());
			document.querySelector('button#remove').addEventListener('click',removeImportedFolder);
		}
	);
	toggle('#mainDivRemove');
	toggle('#mainDivVoila');
	Scroll();
});

// Unfortunately Google has removed the ability to import bookmarks from Chrome extensions. 
/*
function importEnded(){
	removeImportedFolder();
	toggle('#mainDivVoila');
	var a=document.querySelectorAll('.uln .noshow');
		for(var i=0;i<a.length;i++){
			a[i].parentNode.removeChild(a[i]);
		}
	Scroll();
}
function importEndedDebugVersion(){ //DEBUG!!!
	toggle('#mainDivVoila');
	var a=document.querySelectorAll('.uln .noshow');
		for(var i=0;i<a.length;i++){
			a[i].parentNode.removeChild(a[i]);
		}
	Scroll();
}
*/

function init() {
	document.querySelector('#search').addEventListener('input',searchB);
	document.querySelector('#customIconLink').addEventListener('click',function(){
		toggle('#customIconNote');
	})
	document.querySelector('#edit').addEventListener('click',editBookmarks);
	document.querySelector('#saved-import').addEventListener('click',savedAndImport);
	// Unfortunately Google has removed the ability to import bookmarks from Chrome extensions. 
	/* document.querySelector('#import').addEventListener('click',function(evt){
		chrome.bookmarks.import();
	});
	chrome.bookmarks.onImportEnded.addListener(function(){
		importEnded();
	}); */
	document.querySelector('#search').focus();
}

window.onload=init;