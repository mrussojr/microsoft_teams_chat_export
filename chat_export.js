var div_arr = [];
var objs = [];
var del_ids = [];

function MsgObj(){
	this.tm = "";
	this.msg = "";
	this.sender = "";
}

function exportMsgs(){
	$('#exp_btn').off('click','#exp_btn', exportMsgs);
	$('#exp_btn').remove();
	$('.ts-message-list-container').off('click', '.ts-message-list-item', addElems);
	$('.ts-message-list-container').off('mouseenter', '.ts-message-list-item', highlightOn);
	$('.ts-message-list-container').off('mouseleave', '.ts-message-list-item', highlightOff);
	
	$('.message-body').each(function(){
		$(this).css('background-color', $(this).attr('orig_color'));
		$(this).removeAttr('orig_color');
	});
	
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
		div.css('background-color','#f28d85');
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
	$(this).css('background-color','rgba(255,255,0,0.3)');
}

function highlightOff(){
	$(this).css('background-color','rgba(0,0,0,0)');
}

$($('#send-message-button').parent()).append($('<button id="exp_btn">Export</button>'));

$('#exp_btn').on('click', exportMsgs);
$('.ts-message-list-container').on('click', '.ts-message-list-item', addElems);
$('.ts-message-list-container').on('mouseenter', '.ts-message-list-item', highlightOn);
$('.ts-message-list-container').on('mouseleave', '.ts-message-list-item', highlightOff);