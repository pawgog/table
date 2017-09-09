//Pobieranie tabeli
$(document).ready(function(){
	$('#showTable').attr("disabled", false);
	$('.box').css("display", "none");
	$('.header_table').after('<tr class="no-result warning"><th colspan="6">Brak rekordów! Pobierz tabelę.</th></tr>')
	});
        $("#showTable").click(function(){
        $('.no-result').remove();
        $.getJSON("medale_RIO.json", function(data){
        var items = [];
        $.each(data, function(key, val){
            items.push("<tr class='"+"sum_medal"+"'>");
			items.push("<td class='"+"classification"+"' class='"+"data_medal"+"'>"+val.Lp+"</td>");
            items.push("<td class='"+"country data_medal"+"'>"+val.Państwo+"</td>");
            items.push("<td class='"+"data_medal"+"'>"+val.Złoto+"</td>");
            items.push("<td class='"+"data_medal"+"'>"+val.Srebro+"</td>");
            items.push("<td class='"+"data_medal"+"'>"+val.Brąz+"</td>");
            items.push("<td class='"+"data_medal sum_medal1"+"'>"+val.Razem+"</td>");
            items.push("</tr>")
	});
	$("<tbody/>", {html: items.join("")}).appendTo("table");
	}); 
	$('#showTable').attr("disabled", true);
    $(".no-result").css("display", "none");
    });
	$("#hideTable").click(function(){
		$("tbody").remove();
		//$(".myPanel").remove();
		$("#myPanel").removeClass("shake_box");
		$("#myPanel").empty().removeClass("box");
		$('#showTable').attr("disabled", false);
		$(".no-result").css("display", "table-row");
		$('.header_table').after('<tr class="no-result warning"><th colspan="6">Brak rekordów! Pobierz tabelę.</th></tr>')
	});
  
//Sortowanie tabeli
	function NumberSort(a,b){return parseInt(a)>parseInt(b);}
	function WordSort(a,b){return a>b;}
	function Contain(classArray,value){
	  for (var i=0; i<classArray.length;i++)
		if (classArray[i]===value) return true;
	  	return false;
	}
	function startSort(){
	  var handlers=[['WSort', WordSort],['NSort',NumberSort]];
	  for(var i=0, ths=document.getElementsByTagName('th'); th=ths[i]; i++){
		for (var h=0; h<handlers.length;h++) {
		  if(Contain(th.className.split(' '), handlers[h][0])){
			th.columnIndex=i;
			th.order = -1;
			th.sortHandler = handlers[h][1];
			th.onclick=function(){sort(this);}
		  }
		}
	  }
	}
	function sort(header){
		header.order *= -1;
		var table = header.parentNode.parentNode.parentNode;
		for (var i=0, th, ths=table.getElementsByTagName('th'); th=ths[i]; i++)
		  if (th!=header) th.order = -1;
		var rows=table.getElementsByTagName('tr');
		for(var i=1, tempRows=[], tr; tr=rows[i]; i++){tempRows[i-1]=tr}
		tempRows.sort(function(a,b){
		  return header.order*
			(header.sortHandler(
			  a.getElementsByTagName('td')[header.columnIndex].innerHTML,
			  b.getElementsByTagName('td')[header.columnIndex].innerHTML)?1:-1)});
		for(var i=0; i<tempRows.length; i++){
			table.children[1].appendChild(tempRows[i]);
		}
	}
	startSort();

//Przeszukiwanie tabeli
	$(".search").keyup(function(){
	var searchTerm = $(".search").val();
	var listItem = $(".results tbody").children("tr");
	var searchSplit = searchTerm.replace(/ /g, "'):containsi('");
	    $.extend($.expr[':'],{
	      "containsi": function(elem,i,match,array){
	        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	      }
	    })
	    $(".results tbody tr").not(":containsi('"+ searchSplit +"')").each(function(){
	      $(this).removeClass('sum_medal');
	    })
	    $(".results tbody tr:containsi('"+ searchSplit +"')").each(function(){
	      $(this).addClass('sum_medal');  
	    })
	    var length_choose = 0;
	    var sum_length = document.getElementsByTagName("tbody")[0].children.length;
	    for (var i=0; i<sum_length;i++){
	    var name1 = document.getElementsByTagName("tbody")[0].children[i].className;
	    if (name1 == "sum_medal") {
	    length_choose += 1;
	    }}
	    //$('.counter').text(length_choose +' item');
	    if(length_choose == 0) {
	      $('.header_table').after('<tr class="no-result warning"><th colspan="6">Brak rekordów! Wyszukaj ponownie.</th></tr>')
	    }
	    else {
	      $('.no-result').remove();
	    }
	  });

//Przekazywanie sumy rekordów
	$(".addIt").click(function(){
	var tbody_exist = document.getElementsByTagName("tbody").length;
	if (tbody_exist == 0) {
		alert("Brak rekordów w tabeli!")
		return false;
	}
	else {
		var sum_length = document.getElementsByTagName("tbody")[0].children.length;
		var length_choose = 0;
			for (var i=0; i<sum_length;i++){
			var name1 = document.getElementsByTagName("tbody")[0].children[i].className;
				if (name1 == "sum_medal") {
	    		length_choose += 1;
	   			}
	  		}
		var sum_record = 0;
	  	var addTable2 = [];
			for (var i=0; i<length_choose;i++){
	   	var obj = Number(document.getElementsByClassName("sum_medal")[i].children[5].innerText);
	    	addTable2.push(obj)
	  		}
	  	var addTable2_length = addTable2.length
	  		for (var i=0; i<addTable2_length;i++){
	    		sum_record += addTable2[i];
	  		}
			document.getElementById("myPanel").innerHTML = sum_record;
		}
	});

//Płynne skrolowanie do sumy rekordów
	$('.sumMedal').on('click', function(event) {
		var target = $( $(this).attr('href') );
		if( target.length ) {
			event.preventDefault();
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 2000);
		}
		$('#myPanel').addClass('shake_box');
	});

//Zmiana klasy po najechaniu na sumę rekordów
	$( "#myPanel" ).mouseenter(function() {
  	$('#myPanel').removeClass('shake_box');
  	$('#myPanel').addClass('box');
	});