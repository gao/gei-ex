var gei = gei || {};

//the raw format
gei.generateValue = function(text,frtColumnName){
	
	 if (text == ""){
		 return null;
	 }else{ 
		 var den_array = new Array();
		 var text_array = new Array();
		 var line = new Array();
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
				 case '\n': //new line start \r
					 if (field.length > 0 || field_start){
						 line.push(field);
						 field = "";
					 }
					 text_array.push(line);
					 line = [];
					 field_start = true;
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

		 //change the format to Denormalized
		 var firsLine = [];
		 var firstRow = [];
		 //here build the table title column
		 if(text_array.length > 1){
			 //sometimes in the csv file the first row have nothing or only have S1 or S5,this is no use
			 //so the first row should be the file title
			 if(notNullValueNum(text_array[0]) == 0 || text_array[0][0] != ""){
				 firstRow = text_array[1];
			 }else{
				 firstRow = text_array[0];
			 }
			 firsLine.push("Scenario");
			 firsLine.push("Category");
			 firsLine.push("SubCategory");
			 firsLine.push("Name");
			 for(var t = 2; t < firstRow.length; t++){
				 firsLine.push(firstRow[t]);
			 }
			 firsLine.push("\n");
		 }
		 den_array.push(firsLine);
		 
		 var currentCategory = "";
		 var currentSubCategory = "";
		 
		 //here build each line data
		 //you will note here start with 2,
		 //because the first line maybe is the null line and the second line maybe the column title
		 //or the first line is the column title and the second line is null line
		 for(var j = 2; j < text_array.length; j++){
			 var newLine = new Array();
			 var preRow = text_array[j-1];
			 var row = text_array[j];
			 var nextRow = text_array[j+1];
			 var nextRow2 = text_array[j+2];
			 var nextRow3 = text_array[j+3];
			 
			 //the null line
			 if(notNullValueNum(row) == 0){
				 continue;
			 }
			 
			 //the data line 
			 if(notNullValueNum(row) > 1){
				 newLine.push(frtColumnName);
				 newLine.push(currentCategory);
				 newLine.push(currentSubCategory);
				 for(var m = 1; m < row.length; m++){
					 newLine.push(row[m]);
				 }
				 newLine.push("\n");
				 den_array.push(newLine);
			 }
			 
			 //the category
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0){
				 currentCategory = row[1];
			 } 
			 
			 //preRow is empty or data line ,current row is one data,next row is data line,it is a sub-category
			 if(notNullValueNum(preRow) != 1 && notNullValueNum(row) == 1 && notNullValueNum(nextRow) > 1){
				 currentSubCategory = row[1];
			 }
			 
			 //current row is one data,next row is empty ,the next 2 row is data line,it's sub-category is the category
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) > 1){
				 currentSubCategory = currentCategory;
			 }
			 
			 //current row is one data,the next 2 rows is empty,it's sub-category is the category 
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow3) == 0){
				 currentSubCategory = currentCategory;
			 }
			 
			 //current row is one data,the next 2 rows are one data,it's sub-category is the category,sheet 13
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 1 && notNullValueNum(nextRow2) == 1){
				 currentSubCategory = row[1];
			 }
			 
		 }
		 
		 var den_str = "";
		 for(var a = 0; a < den_array.length; a++){
			 den_str = den_str + den_array[a];
		 }
    
		 return den_str;
	 }
};


//the motion format
gei.generateMotionValue = function(text,frtColumnName){
	
	 if (text == ""){
		 return null;
	 }else{ 
		 var den_array = new Array();
		 var text_array = new Array();
		 var line = new Array();
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
				 case '\n': //new line start \r
					 if (field.length > 0 || field_start){
						 line.push(field);
						 field = "";
					 }
					 text_array.push(line);
					 line = [];
					 field_start = true;
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

		 //change the format to Denormalized
		 var firsLine = [];
		 var firstRow = [];
		 
		 //here build the table title column
		 firsLine.push("Scenario");
		 firsLine.push("Category");
		 firsLine.push("SubCategory");
		 firsLine.push("Name");
		 firsLine.push("Year");
		 firsLine.push("Value");
		 firsLine.push("\n");
		 den_array.push(firsLine);
		 
		 //here build the year value
		 var yearArr = [];
		 if(text_array.length > 1){
			 //sometimes in the csv file the first row have nothing or only have S1 or S5,this is no use
			 //so the first row should be the file title
			 if(notNullValueNum(text_array[0]) == 0 || text_array[0][0] != ""){
				 firstRow = text_array[1];
			 }else{
				 firstRow = text_array[0];
			 }
			 for(var t = 2; t < firstRow.length; t++){
				 yearArr.push(firstRow[t]);
			 } 
		 }
		 
		 
		 var currentCategory = "";
		 var currentSubCategory = "";
		 
		 //here build each line data
		 //you will note here start with 2,
		 //because the first line maybe is the null line and the second line maybe the column title
		 //or the first line is the column title and the second line is null line
		 for(var j = 2; j < text_array.length; j++){
			 var preRow = text_array[j-1];
			 var row = text_array[j];
			 var nextRow = text_array[j+1];
			 var nextRow2 = text_array[j+2];
			 var nextRow3 = text_array[j+3];
			 
			 //the null line
			 if(notNullValueNum(row) == 0){
				 continue;
			 }
			 
			 //the data line 
			 if(notNullValueNum(row) > 1){
				 var name = row[1];
				 for(var k = 2; k < row.length; k++){
					 if(row[k] != ""){
						 var newLine = new Array();
						 newLine.push(frtColumnName);
						 newLine.push(currentCategory);
						 newLine.push(currentSubCategory);
						 newLine.push(name);
						 newLine.push(yearArr[k-2]);
						 newLine.push(row[k]);
						 newLine.push("\n");
						 den_array.push(newLine);
					 }
				 }
			 }
			 
			 //the category
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0){
				 currentCategory = row[1];
			 } 
			 
			 //preRow is empty or data line ,current row is one data,next row is data line,it is a sub-category
			 if(notNullValueNum(preRow) != 1 && notNullValueNum(row) == 1 && notNullValueNum(nextRow) > 1){
				 currentSubCategory = row[1];
			 }
			 
			 //current row is one data,next row is empty ,the next 2 row is data line,it's sub-category is the category
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) > 1){
				 currentSubCategory = currentCategory;
			 }
			 
			 //current row is one data,the next 2 rows is empty,it's sub-category is the category 
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow3) == 0){
				 currentSubCategory = currentCategory;
			 }
			 
			 //current row is one data,the next 2 rows are one data,it's sub-category is the category,sheet 13
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 1 && notNullValueNum(nextRow2) == 1){
				 currentSubCategory = row[1];
			 }
			 
		 }
		 
		 var den_str = "";
		 for(var a = 0; a < den_array.length; a++){
			 den_str = den_str + den_array[a];
		 }
   
		 return den_str;
	 }
};

/**
 * this method is to count each line value number,judge whether the line is null line ,category line or data line
 * num == 0 is null line ,num == 1 is category line ,num >1 is data line
 * @param textArray
 * @return
 */
function notNullValueNum(textArray){
	var num = 0;
	if(typeof(textArray) == "undefined"){
		return num;
	}
	for(var i = 0; i < textArray.length; i++){
		if(textArray[i] != ""){
			num++;
		}
	}
	return num;
}
