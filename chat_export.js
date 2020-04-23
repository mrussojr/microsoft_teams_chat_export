/* Color Customizations */
/* -------------------- */
var selectedColor = 'rgba(242,141,133,1)';
var hoverColor = 'rgba(255,255,0,0.3)';
/* -------------------- */

var div_arr = [];
var objs = [];
var del_ids = [];

/* Message Object */
/* -------------- */
function MsgObj(){
	this.tm = "";
	this.msg = "";
	this.sender = "";
}
/* -------------- */

function removeCustomizations(){
	$('#exp_btn').off('click','#exp_btn', exportMsgs);
	$('#exp_btn').remove();
	$('#can_btn').off('click','#can_btn', removeCustomizations);
	$('#can_btn').remove();
	$('#hlp_btn').off('click','#hlp_btn', helpMe);
	$('#hlp_btn').remove();
	$('.ts-message-list-container').off('click', '.ts-message-list-item', addElems);
	$('.ts-message-list-container').off('mouseenter', '.ts-message-list-item', highlightOn);
	$('.ts-message-list-container').off('mouseleave', '.ts-message-list-item', highlightOff);
	
	$('.message-body').each(function(){
		$(this).css('background-color', $(this).attr('orig_color'));
		$(this).removeAttr('orig_color');
	});
}

function helpMe(){
	var n = "\r\n";
	var msg = "How to use: " + n;
	msg += "     1. Click next to messages to save" + n;
	msg += "     2. Click 'Export' button to open messages in new tab" + n + n;
	msg += "** Click on the 'Cancel Export' to cancel the process" + n;
	alert(msg);
}

function exportMsgs(){
	if(objs.length < 1){
		alert("WARNING: No messages selected for export");
		return;
	}
	
	removeCustomizations();
	
	objs.sort((a, b) => (a.tm > b.tm) ? 1 : (a.tm === b.tm) ? ((a.sender > b.sender) ? 1 : -1) : -1 );
	
	var txt = "<body>";

	for(var i = 0; i < objs.length; i++){
		var o = objs[i];
		txt += "<div>[" + o.tm + "] " + o.sender + "</div>";
		txt += "<div>    " + o.msg.replace(/[\n\r]/g, "<br />") + "</div>";
		txt += "<br />";
	}
	
	txt += "</body>";
	
	var w = window.open('about:blank');
	w.document.open();
	w.document.write(txt);
	w.document.close();
}

function addElems(){
	var div = $(this).find('.message-body');
	
	var msgObj = new MsgObj();
	
	msgObj.tm = $(div.find('.message-datetime')[0]).attr('title').trim();
	msgObj.sender = div.find('.ts-msg-name')[0].innerText.trim();
	msgObj.msg = div.find('.message-body-content').children()[0].innerText.trim();
	
	if(div.attr('orig_color') === undefined){
		div_arr.push(div);
		objs.push(msgObj);
		div.attr('orig_color',div.css('background-color'));
		div.css('background-color', selectedColor);
	}else{
		div.css('background-color', div.attr('orig_color'));
		div.removeAttr('orig_color');
		
		for(var i = 0; i < objs.length; i++){
			if(objs[i].msg === msgObj.msg)
				del_ids.push(i);
		}
		
		for(var x = 0; x < del_ids.length; x++){
			div_arr.splice(del_ids[x]);
			objs.splice(del_ids[x]);
		}
		
		del_ids = [];
	}
}

function highlightOn(){
	$(this).css('background-color', hoverColor);
}

function highlightOff(){
	$(this).css('background-color','rgba(0,0,0,0)');
}

$($('#send-message-button').parent()).append($('<button id="exp_btn">Export</button>'));
$($('#send-message-button').parent()).append($('<button id="can_btn">Cancel Export</button>'));
$($('#send-message-button').parent()).append($('<button id="hlp_btn">?</button>'));

$('#exp_btn').on('click', exportMsgs);
$('#can_btn').on('click', removeCustomizations);
$('#hlp_btn').on('click', helpMe);
$('.ts-message-list-container').on('click', '.ts-message-list-item', addElems);
$('.ts-message-list-container').on('mouseenter', '.ts-message-list-item', highlightOn);
$('.ts-message-list-container').on('mouseleave', '.ts-message-list-item', highlightOff);
