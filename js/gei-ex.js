var gei = gei || {};

gei.generateValue = function(text){
	
	 if (text == null){
		 return null;
	 }else{ 
		 var den_array = [];
		 var text_array = [];
		 var line = [];
		 var field = "";
		 //is in double quotation marks
		 var in_quata = false;
		 //is the field start
		 var field_start = true;

		 for (var i = 0; i < text.length; i++) {
			 var ch = text[i];
			 if (in_quata){
				 //if in the double quotation marks
				 if (ch == '\"'){
					 in_quata = false;  
					 field = field + '\"';
				 }else{ 
					 field = field + ch;
				 }
			 }else{
				 switch (ch)
				 {
				 case ',': //new field start
					 line.push(field);
					 field = "";
					 field_start = true;
					 break;
				 case '\"'://manage the double quotation marks
					 if (field_start){
						 in_quata = true;
					 }	
					 field = field + '\"';
					 break;
				 case '\r': //new line start
					 snow.log.info("--------------------------new line----");
					 if (field.length > 0 || field_start){
						 line.push(field);
						 field = "";
					 }
					 text_array.push(line);
					 line = [];
					 field_start = true;
					 // window £¬\r\n is together£¬so jump
					 if (i < text.length - 1 && text[i + 1] == '\n'){
						 i++;
					 }
					 break;
				 default:
					 field_start = false;
				 	 field = field + ch;
				 	 break;
				 }
			 }
		 }

		 if (field.length > 0 || field_start){
			 line.push(field);
		 } 
		 if (line.length > 0){
			 text_array.push(line);
		 }    

		 snow.log.info("============text_array.length:"+text_array.length);
		 snow.log.info("============text_array:"+text_array);

		 //change the format to Denormalized
		 for(var j = 0; j < text_array.length; j++){
			 snow.log.info("============text_array[0].length:"+text_array[j].length);
			 
		 }
    
		 return text_array;
	 }
};
