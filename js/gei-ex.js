var gei = gei || {};

//data type 

gei.type = {
	type1:{
		category1:"Macroeconomics",
		name1:"Difference (2009 $ billions)",
		category2:"Emissions",
		name2:"Total"
	}
}

gei.subCat = ["GDP","Jobs","Energy prices","Electricity","Natural Gas","Gasoline","Fossil fuel consumption (quads)",
             "Fossil Fuel Savings","Emissions","Emissions Relative to BAU","Transport","LDV New Sales (millions)",
             "LDV Stock (millions)","HDV/MDV New Sales (millions)","HDV/MDV Stock (millions)","Production TWh","Clean capacity GW"];

//generate the dataType format
gei.generateTypeValue = function(text,frtColumnName,dataType){
	 if (text == ""){
		 return null;
	 }else{ 
		 var den_array = new Array();
		 var text_array = new Array();   
		 text_array = bulidTextArrayFromCSV(text);   
		 var category1, name1, category2, name2;
		 
		 if(dataType == "type1" || dataType == "type2"){
			 category1 = gei.type.type1.category1;
			 name1 = gei.type.type1.name1;
			 category2 = gei.type.type1.category2;
			 name2 = gei.type.type1.name2;
		 }

		 //change the format to Denormalized
		 var firsLine = [];
		 var firstRow = [];
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
		 
		 //here build the table title column
		 if(dataType == "type1"){
			 firsLine.push("Scenario");
			 firsLine.push("Category");
			 firsLine.push("SubCategory");
			 firsLine.push("Name");
			 firsLine.push("Year");
			 firsLine.push("Value");
			 firsLine.push("Total");
		 }else if(dataType == "type2"){
			 firsLine.push("Scenario");
			 firsLine.push("Category");
			 firsLine.push("SubCategory");
			 firsLine.push("Name");
			 firsLine.push("Year[type=date;format=y]");
			 firsLine.push("GDP[type=float]");
			 firsLine.push("Total[type=float]");
		 }else if(dataType == "motion"){
			 firsLine.push("Scenario");
			 firsLine.push("Category");
			 firsLine.push("SubCategory");
			 firsLine.push("Name");
			 firsLine.push("Year");
			 firsLine.push("Value");
		 }else if(dataType == "raw"){
			 firsLine.push("Scenario");
			 firsLine.push("Category");
			 firsLine.push("SubCategory");
			 firsLine.push("Name");
			 for(var t = 2; t < firstRow.length; t++){
				 firsLine.push(firstRow[t]);
			 }
		 }else if(dataType == "gei-main"){
			 firsLine.push("Scenario");
			 firsLine.push("Category");
			 firsLine.push("SubCategory");
			 firsLine.push("Metric");
			 firsLine.push("Year[type=date;format=y]");
			 firsLine.push("Value[type=float]");
		 }
		 firsLine.push("\n");
		 den_array.push(firsLine);
		 
		 
		 if(dataType == "gei-main"){
			 text_array = text_array.slice(0,147)
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
				 if(dataType == "type1"){
					 //data format is type1
					 if(currentCategory == category1 && name == name1){
						 for(var k = 2; k < row.length; k++){
							 if(row[k] != ""){
								 var newLine = new Array();
								 newLine.push(frtColumnName);
								 newLine.push(currentCategory);
								 newLine.push(currentSubCategory);
								 newLine.push(name);
								 newLine.push(yearArr[k-2]);
								 newLine.push(row[k]);
								 newLine.push("");
								 newLine.push("\n");
								 den_array.push(newLine);
							 }
						 }
					 }
					 
					 if(currentCategory == category2 && name == name2){
						 var total_array = new Array();
						 for(var k = 2; k < row.length; k++){
							 if(row[k] != ""){
								 total_array.push(row[k]);
							 }
						 }
						 
						 for(var h = 1; h < den_array.length; h++){
							 var denRow = den_array[h];
							 if(h < total_array.length+1){
								 den_array[h][6] = total_array[h-1];
							 } 
						 }
					 }
					 
				 }else if(dataType == "type2"){
					 //data format is type1
					 if(currentCategory == category1 && name == name1){
						 for(var k = 2; k < row.length; k++){
							 if(row[k] != ""){
								 var newLine = new Array();
								 newLine.push(frtColumnName);
								 newLine.push(currentCategory);
								 newLine.push(currentSubCategory);
								 newLine.push(name);
								 newLine.push(yearArr[k-2]);
								 newLine.push(formatValue(row[k]));
								 newLine.push("");
								 newLine.push("\n");
								 den_array.push(newLine);
							 }
						 }
					 }
					 
					 if(currentCategory == category2 && currentSubCategory == category2 && name == name2){
						 var total_array = new Array();
						 for(var k = 2; k < row.length; k++){
							 if(row[k] != ""){
								 total_array.push(row[k]);
							 }
						 }
						 
						 for(var h = 1; h < den_array.length; h++){
							 var denRow = den_array[h];
							 if(h < total_array.length+1){ 
								 den_array[h][6] = formatValue(total_array[h-1]);
							 } 
						 }
					 }
					 
				 } else if(dataType == "motion"){
					 //data format is motion
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
				 } else if(dataType == "raw"){ 
					 //data format is raw
					 var newLine = new Array();
					 newLine.push(frtColumnName);
					 newLine.push(currentCategory);
					 newLine.push(currentSubCategory);
					 for(var m = 1; m < row.length; m++){
						 newLine.push(row[m]);
					 }
					 newLine.push("\n");
					 den_array.push(newLine);
				 } else if(dataType == "gei-main"){
					 //data format is gei-main
					 for(var k = 2; k < row.length; k++){
						 if(row[k] != ""){
							 var newLine = new Array();
							 newLine.push(frtColumnName);
							 newLine.push(currentCategory);
							 newLine.push(currentSubCategory);
							 newLine.push(name);
							 //if there no year should break
							 if(yearArr[k-2] == ""){
								 break;
							 }
							 newLine.push(yearArr[k-2]);
							 newLine.push(formatValue(row[k]));
							 newLine.push("\n");
							 den_array.push(newLine);
						 }
					 }
				 }
			 }
			 
			 //the category
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0){
				 currentCategory = row[1];
				 //console.log("--00category--j="+j+":::"+currentCategory);
			 } 
			 
			 //preRow is empty or data line ,current row is one data,next row is data line,it is a sub-category
			 if(notNullValueNum(preRow) != 1 && notNullValueNum(row) == 1 && notNullValueNum(nextRow) > 1){
				 currentSubCategory = row[1];
				 //console.log("--11currentSubCategory--j="+j+":::"+currentSubCategory);
			 }
			 
			 //current row is one data,next row is empty ,the next 2 row is data line,it's sub-category is the category
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) > 1){
				 currentSubCategory = currentCategory;
				 //console.log("--22currentSubCategory--j="+j+":::"+currentSubCategory);
			 }
			 
			 //current row is one data,the next 2 rows is empty,it's sub-category is the category 
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) == 0){
				 currentSubCategory = currentCategory;
				 //console.log("--33currentSubCategory--j="+j+":::"+currentSubCategory);
			 }
			 
			 //current row is one data,the next 2 rows are one data,it's sub-category is the category,sheet 13
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 1 && notNullValueNum(nextRow2) == 1){
				 currentSubCategory = row[1];
				 //console.log("--44currentSubCategory--j="+j+":::"+currentSubCategory);
			 }
			 
		 }
		 
		 var den_str = "";
		 for(var a = 0; a < den_array.length; a++){
			 den_str = den_str + den_array[a];
		 }
   
		 return den_str;
	 }
};

/*
 * this method is to create the format for the GEI-National
 * first column is : Scenario Year Name1 Name2 Name3 ......
 */
gei.generateGEINationalValue = function(text,frtColumnName,dataType){
	 if (text == ""){
		 return null;
	 }else{
		 var den_array = new Array();
		 var text_array = new Array();   
		 text_array = bulidTextArrayFromCSV(text);   
		 //change the format to Denormalized
		 var firsLine = [];
		 var firstRow = [];
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
		 
		 if(dataType == "gei-national"){
			 //old csv is 135
			 text_array = text_array.slice(0,147)
		 }
		 //console.log(text_array);
		 
		 //bulid the first column
		 firsLine.push("Scenario");
		 firsLine.push("Year[type=date;format=y]");
		 var currentCategory = "";
		 var currentSubCategory = "";
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
				 var cuCa = formatValueForId(currentCategory);
				 var cuSubCa = formatValueForId(currentSubCategory);
				 var cuNa = formatValueForId(name);
				 var columnName = cuCa.substring(0,15)+"_"+cuSubCa.substring(0,15)+"_"+cuNa.substring(0,25);
				 firsLine.push(columnName+"[type=float]");
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
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) == 0){
				 currentSubCategory = currentCategory;
			 }
			 
			 //current row is one data,the next 2 rows are one data,it's sub-category is the category,sheet 13
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 1 && notNullValueNum(nextRow2) == 1){
				 currentSubCategory = row[1];
			 } 
		 }		 
		 //firsLine.push("\n");
		 den_array.push(firsLine);
		 
		 //here bulid the data line
		 for(var i = 0;i < yearArr.length; i++ ){
			 var yearVal = yearArr[i];
			 if(yearVal != ""){
				 var newLine = new Array();
				 newLine.push(frtColumnName);
				 newLine.push(yearVal);
				 
				 for(var a = 2; a < text_array.length; a++){
					 var rowNow = text_array[a];
					 //the data line 
					 if(notNullValueNum(rowNow) > 1){
						 var value = rowNow[i+2];
						 if(value == "" || value == null){
							 value = 0 ;
						 }else{
							 value = formatValue(rowNow[i+2]);
						 }
						 newLine.push(value);
					 }
				 }
				 
				 //newLine.push("\n");
				 den_array.push(newLine);
			 }
		 }
		 
		 
		 var den_str = "";
		 for(var a = 0; a < den_array.length; a++){
			 den_str = den_str + den_array[a] + "\n";
		 }
  
		 return den_str;
	 }
};

/**
 * generate the GEIStates new format 
 * first column is : Scenario Year State Metric1 Metric2 Metric3 Metric4
 */
gei.generateGEIStatesNewValue = function(text,frtColumnName,dataType){
	 if (text == ""){
		 return null;
	 }else{ 
		 var den_array = new Array();
		 var text_array = new Array();   
		 text_array = bulidTextArrayFromCSV(text);   

		 //change the format to Denormalized
		 var firsLine = [];
		 var firstRow = [];
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
		 yearArr = yearArr.slice(0,yearArr.length-1)
		 
		 if(dataType == "gei-states-new"){
			 //old data is 135
			 text_array = text_array.slice(146,(text_array.length-1));
		 }
		 //console.log(text_array);
		 //here bulid first line
		 firsLine.push("Scenario");
		 firsLine.push("Year[type=date;format=y]");
		 firsLine.push("State");
		 for(var j = 1; j < text_array.length; j++){
			 var preRow = text_array[j-1];
			 var row = text_array[j];
			 var nextRow = text_array[j+1];
			 
			 //the null line
			 if(notNullValueNum(row) == 0){
				 continue;
			 }
			 
			 //the data line 
			 if(notNullValueNum(row) > 1){
				 continue; 
			 }

			 //preRow is empty ,current row is one data,next row is data line,it is a Metric
			 if(notNullValueNum(preRow) == 0 && notNullValueNum(row) == 1 && notNullValueNum(nextRow) > 1){
				 var name = row[1];
				 name = formatValueForId(name);
				 if(name.length >= 64){
					 name = name.substring(0,63);
				 }
				 firsLine.push(name+"[type=float]");
			 }
			 
		 }
		 den_array.push(firsLine);
		 
		 //here bulid the data line	 
		 var metric = "";
		 var startAt = 0;
		 var startAt1 = 0;
		 var startAt2 = 0;
		 for(var a = 1; a < text_array.length; a++){
			 //console.log("----a:"+a);
			 var rowNow = text_array[a];
			 var preRowNow = text_array[a-1];
			 var nextRowNow = text_array[a+1];
			 //the data line 
			 if(notNullValueNum(rowNow) > 1){ 
				 //console.log("--data line---");
				 //old one is : Household energy bill savings (2009 $/household/year)    
				 //sometime one is : Household Energy Bill Savings (2009 $/household/year))  
				 if(metric == "Household energy bill savings (2009 $/household/year)"){
					 //console.log("--11111111---");
					 for(var i = 0;i < yearArr.length; i++ ){
						 var yearVal = yearArr[i];
						 if(yearVal != ""){
							 var newLine = new Array();
							 newLine.push(frtColumnName);
							 newLine.push(yearVal);
							 
							 var state = rowNow[1];
							 newLine.push(state);
							 
							 var value = rowNow[i+2];
							 if(typeof(value) == "undefined" || value == ""){
								 value = 0 ;
							 }else{
								 value = formatValue(rowNow[i+2]);
							 }
							 newLine.push(value);
							 //newLine.push("\n");
							 den_array.push(newLine);
						 }
					 }
				 }else if(metric == "Household energy bill savings (2009 $/capita/year)"){
					 for(var i = startAt; i < (yearArr.length+startAt); i++ ){
						 var cur_arr = den_array[i+1];
						 if(typeof(cur_arr) != "undefined"){
							 var value = rowNow[i+2-startAt];
							 if(typeof(value) == "undefined" || value == ""){
								 value = 0 ;
							 }else{
								 value = formatValue(value);
							 }
							 cur_arr.push(value);
						 }
					 }
					 startAt = startAt + yearArr.length;
				 }else if(metric == "GDP impact (% relative to BAU)"){
					 //old one is : GDP impact (% relative to BAU)
					//sometime one is : GDP Impact (% Relative to BAU)
					 for(var i = startAt1; i < (yearArr.length+startAt1); i++ ){
						 var cur_arr = den_array[i+1];
						 if(typeof(cur_arr) != "undefined"){
							 var value = rowNow[i+2-startAt1];
							 if(typeof(value) == "undefined" || value == ""){
								 value = 0 ;
							 }else{
								 value = formatValue(value);
							 }
							 cur_arr.push(value);
						 }
					 }
					 startAt1 = startAt1 + yearArr.length;
				 }else if(metric == "Jobs impact (% relative to BAU)"){
					 //old one is : Jobs impact (% relative to BAU)
					 //sometime one is : Jobs Impact (% Relative to BAU)
					 for(var i = startAt2; i < (yearArr.length+startAt2); i++ ){
						 var cur_arr = den_array[i+1];
						 if(typeof(cur_arr) != "undefined"){
							 var value = rowNow[i+2-startAt2];
							 if(typeof(value) == "undefined" || value == ""){
								 value = 0 ;
							 }else{
								 value = formatValue(value);
							 }
							 cur_arr.push(value);
						 }
					 }
					 startAt2 = startAt2 + yearArr.length;
				 }
			 }
			 
			//preRow is empty ,current row is one data,next row is data line,it is a Metric
			 if(notNullValueNum(preRowNow) == 0 && notNullValueNum(rowNow) == 1 && notNullValueNum(nextRowNow) > 1){
				 metric = rowNow[1];
				 //console.log("-------metric:"+metric);
			 }
		 }

		 
		 var den_str = "";
		 for(var a = 0; a < den_array.length; a++){
			 den_str = den_str + den_array[a] + "\n";
		 }
 
		 return den_str;
	 }
};

/**
 * generate the GEIStates format
 * first column is : Scenario Metric State Year Value
 */
gei.generateGEIStatesValue = function(text,frtColumnName,dataType){
	 if (text == ""){
		 return null;
	 }else{ 
		 var den_array = new Array();
		 var text_array = new Array();   
		 text_array = bulidTextArrayFromCSV(text);   

		 //change the format to Denormalized
		 var firsLine = [];
		 var firstRow = [];
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
		 
		 //here build the table title column
		 if(dataType == "gei-states"){
			 firsLine.push("Scenario");
			 firsLine.push("Metric");
			 firsLine.push("State");
			 firsLine.push("Year[type=date;format=y]");
			 firsLine.push("Value[type=float]");
		 }
		 //firsLine.push("\n");
		 den_array.push(firsLine);
		 
		 if(dataType == "gei-states"){
			 //old csv data is 135
			 text_array = text_array.slice(147,(text_array.length-1));
		 }
		 
		 //name is the Metric
		 var name = "";
		 
		 //here build each line data
		 for(var j = 1; j < text_array.length; j++){
			 var preRow = text_array[j-1];
			 var row = text_array[j];
			 var nextRow = text_array[j+1];
			 
			 //the null line
			 if(notNullValueNum(row) == 0){
				 continue;
			 }
			 
			 //the data line 
			 if(notNullValueNum(row) > 1){
				 var state = row[1];
				 if(dataType == "gei-states"){
					 //data format is gei-states
					 for(var k = 2; k < row.length; k++){
						 if(row[k] != ""){
							 var newLine = new Array();
							 newLine.push(frtColumnName);
							 newLine.push(name);
							 newLine.push(state);
							 //if there no year should break
							 if(yearArr[k-2] == ""){
								 break;
							 }
							 newLine.push(yearArr[k-2]);
							 newLine.push(formatValue(row[k]));
							 //newLine.push("\n");
							 den_array.push(newLine);
						 }
					 }
				 }
			 }

			 //preRow is empty ,current row is one data,next row is data line,it is a Metric
			 if(notNullValueNum(preRow) == 0 && notNullValueNum(row) == 1 && notNullValueNum(nextRow) > 1){
				 name = row[1];
			 }
			 
		 }
		 var den_str = "";
		 for(var a = 0; a < den_array.length; a++){
			 den_str = den_str + den_array[a] + "\n";
		 }
 
		 return den_str;
	 }
};

//generate the topic xml format
gei.generateGEITopicXmlValue = function(text,topicId,topicName,dataType){
	 if (text == ""){
		 return null;
	 }else{ 
		 var topic_str = "<topics>\n<topic id='"+topicId+"'>\n"+
		 				"  <info>\n"+
		 				"    <name>\n"+
		 				"      <value>"+topicName+"</value>\n"+
		 				"    </name>\n"+
		 				"  </info>\n";
		 var text_array = new Array();   
		 text_array = bulidTextArrayFromCSV(text);   

		 if(dataType == "gei-national-topic-xml"){
			 text_array = text_array.slice(0,147);
		 }
		 
		 var currentCategory = "";
		 var currentSubCategory = "";
		 
		 //here build each line data
		 for(var j = 1; j < text_array.length; j++){
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
				 continue
			 }

			//the category
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0){
				 if(currentCategory != ""){
					 topic_str = topic_str + "  </topic>\n"
				 }
				 currentCategory = row[1];
				 var tName =  topicId+"_"+currentCategory;
				 tName = formatValueForId(tName);
				 if(tName.length >= 64){
					 tName = tName.substring(0,63);
				 }
				 topic_str = topic_str +
				 			"  <topic id='"+tName+"'>\n"+
				 			"    <info>\n"+
				 			"      <name>\n"+
				 			"        <value>"+currentCategory+"</value>\n"+
				 			"      </name>\n"+
				 			"    </info>\n" ;
			 } 
			 
			 //preRow is empty or data line ,current row is one data,next row is data line,it is a sub-category
			 if(notNullValueNum(preRow) != 1 && notNullValueNum(row) == 1 && notNullValueNum(nextRow) > 1){
				 currentSubCategory = row[1];
				 var tName =  topicId+"_"+currentCategory+"_"+currentSubCategory;
				 tName = formatValueForId(tName);
				 if(tName.length >= 64){
					 tName = tName.substring(0,63);
				 }
				 topic_str = topic_str +
		 			"    <topic id='"+tName+"'>\n"+
		 			"      <info>\n"+
		 			"        <name>\n"+
		 			"          <value>"+currentSubCategory+"</value>\n"+
		 			"        </name>\n"+
		 			"      </info>\n"+
		 			"    </topic>\n";
			 }
			 
			 //current row is one data,next row is empty ,the next 2 row is data line,it's sub-category is the category
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) > 1){
				 currentSubCategory = currentCategory;
				 var tName =  topicId+"_"+currentCategory+"_"+currentSubCategory;
				 tName = formatValueForId(tName);
				 if(tName.length >= 64){
					 tName = tName.substring(0,63);
				 }
				 topic_str = topic_str +
		 			"    <topic id='"+tName+"'>\n"+
		 			"      <info>\n"+
		 			"        <name>\n"+
		 			"          <value>"+currentSubCategory+"</value>\n"+
		 			"        </name>\n"+
		 			"      </info>\n"+
		 			"    </topic>\n";
			 }
			 
			 //current row is one data,the next 2 rows is empty,it's sub-category is the category 
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) == 0){
				 currentSubCategory = currentCategory;
				 var tName =  topicId+"_"+currentCategory+"_"+currentSubCategory;
				 tName = formatValueForId(tName);
				 if(tName.length >= 64){
					 tName = tName.substring(0,63);
				 }
				 topic_str = topic_str +
		 			"    <topic id='"+tName+"'>\n"+
		 			"      <info>\n"+
		 			"        <name>\n"+
		 			"          <value>"+currentSubCategory+"</value>\n"+
		 			"        </name>\n"+
		 			"      </info>\n"+
		 			"    </topic>\n";
			 }
			 
			 //current row is one data,the next 2 rows are one data,it's sub-category is the category,sheet 13
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 1 && notNullValueNum(nextRow2) == 1){
				 currentSubCategory = row[1];
				 var tName =  topicId+"_"+currentCategory+"_"+currentSubCategory;
				 tName = formatValueForId(tName);
				 if(tName.length >= 64){
					 tName = tName.substring(0,63);
				 }
				 topic_str = topic_str +
		 			"    <topic id='"+tName+"'>\n"+
		 			"      <info>\n"+
		 			"        <name>\n"+
		 			"          <value>"+currentSubCategory+"</value>\n"+
		 			"        </name>\n"+
		 			"      </info>\n"+
		 			"    </topic>\n";
			 }
			 
		 }
		 
		 topic_str = topic_str +"  </topic>\n</topic>\n</topics>\n"
 
		 return topic_str;
	 }
};

//generate the part of Concept xml format
gei.generateGEIConceptXmlValue = function(text,metaData,topicId,dataType){
	 if (text == ""){
		 return null;
	 }else{ 
		 var concept_str = "";
		 var text_array = new Array();   
		 text_array = bulidTextArrayFromCSV(text);   

		 if(dataType == "gei-national-concept-xml"){
			 text_array = text_array.slice(0,147)
		 }
		 
		 var map = {} ;
		 if(metaData != ""){
			 var metaData_array = new Array();   
			 metaData_array = bulidTextArrayFromCSV(metaData); 
			 var curSubCat = "";
			 var curSucCatArr = new Array();  
			 var trasportTime = 0 ;
			 var naturalGasTime = 0 ;
			 
			 if(metaData_array.length > 0 ){
				 for(var i = 2; i < metaData_array.length; i++){
					 var metaDataRow = metaData_array[i];
					 
					 //here find the current subcategory
					 //right now some category and subcategory also have lable
					 if(notNullValueNum(metaDataRow) != 0){
						 var nameValue = metaDataRow[1].replace(/(^\s*)|(\s*$)/g,"");
						 console.log("nameValue:"+nameValue);
						 if(gei.subCat.indexOf(nameValue) != -1){
							 //here because some name is same as the subcategory
							 if(curSucCatArr.indexOf(nameValue)  == -1){
								 if(nameValue == "Transport" ){
									 trasportTime = trasportTime + 1;
									 if(trasportTime == 3){
										 curSubCat = nameValue;
										 curSucCatArr.push(curSubCat);
									 }
								 }else if(nameValue == "Natural Gas" ){
									 naturalGasTime = naturalGasTime + 1;
									 if(naturalGasTime == 1){
										 curSubCat = nameValue;
										 curSucCatArr.push(curSubCat);
									 }
								 }else{
									 curSubCat = nameValue;
									 curSucCatArr.push(curSubCat);
								 }
							 }
							 
						 }
					 }
					 
					 //console.log("------curSubCat:"+curSubCat);
					 
					 //here build the label and description
					 if(notNullValueNum(metaDataRow) > 1){
						 //sometime the name will be same,so here we build the name use curSubCat+Name
						 var nameVal = metaDataRow[1];
						 nameVal = curSubCat.replace(/(^\s*)|(\s*$)/g,"") + "_" + nameVal;
						 var lableVal = metaDataRow[2];
						 var descriptionVal = metaDataRow[3];
						 var urlVal = metaDataRow[4];
						 //sometimes the data file and the metadata file the later is not same,
						 nameVal = nameVal.toLowerCase();
						 //console.log("-----nameVal:"+nameVal);
						 map[nameVal] = {label:lableVal,descrption:descriptionVal,url:urlVal};
					 }
				 }
			 }
		 }
		 //console.log(map);
		// console.log("==========================================================");
		 
		 var currentCategory = "";
		 var currentSubCategory = "";
		 
		 //here build each line data
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
				 var cuCa = formatValueForId(currentCategory);
				 var cuSubCa = formatValueForId(currentSubCategory);
				 var cuNa = formatValueForId(name);
				 var columnName = cuCa.substring(0,15)+"_"+cuSubCa.substring(0,15)+"_"+cuNa.substring(0,25);
				 
				 var tName =  topicId+"_"+currentCategory+"_"+currentSubCategory;
				 tName = formatValueForId(tName);
				 if(tName.length >= 64){
					 tName = tName.substring(0,63);
				 }
				 //console.log("-------------------------------------------");
				 var cscVal = currentSubCategory.replace(/(^\s*)|(\s*$)/g,"");
				 var nameMapVal = cscVal + "_" + name;
				 //sometimes the data file and the metadata file the later is not same,
				 nameMapVal = nameMapVal.toLowerCase();
				 //console.log("-----nameMapVal:"+nameMapVal);
				 if(typeof(map[nameMapVal]) != "undefined"){
					 var label = map[nameMapVal].label;
					 var description = map[nameMapVal].descrption;
					 var url = map[nameMapVal].url;
					 
					 var con_part = "  <concept id='"+columnName+"'>\n"+
			 						"    <info>\n"+
			 						"      <name>\n";
					 //here build the lable
					 if(label != "" && typeof(label) != "undefined"){
						 con_part = con_part +
						 			"        <value>"+label.replace(/\"/g, "")+"</value>\n"+
						 			"      </name>\n";
					 } else {
						 con_part = con_part +
				 					"        <value>"+name.replace(/\"/g, "")+"</value>\n"+
				 					"      </name>\n";
					 }
					 
					 //here build the description
					 if(description != "" && typeof(description) != "undefined"){
						 con_part = con_part +
						 			"      <description>\n"+
						 			"        <value>"+description+"</value>\n"+
						 			"      </description>\n";
					 }
					 
					//here build the url
					 if(url != "" && typeof(url) != "undefined"){
						 con_part = con_part +
						 			"      <url>\n"+
						 			"        <value>"+url+"</value>\n"+
						 			"      </url>\n";
					 }
					 
					 con_part = con_part +
							 	"    </info>\n"+
					 			"    <topic ref='"+tName+"'/>\n"+
					 			"    <type ref='float'/>\n"+
					 			"  </concept>\n";
					 
					 concept_str = concept_str + con_part;
				 }else{
					 concept_str = concept_str +
			 			"  <concept id='"+columnName+"'>\n"+
			 			"    <info>\n"+
			 			"      <name>\n"+
			 			"        <value>"+name.replace(/\"/g, "")+"</value>\n"+
			 			"      </name>\n"+
			 			"    </info>\n"+
			 			"    <topic ref='"+tName+"'/>\n"+
			 			"    <type ref='float'/>\n"+
			 			"  </concept>\n";
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
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) == 0){
				 currentSubCategory = currentCategory;
			 }
			 
			 //current row is one data,the next 2 rows are one data,it's sub-category is the category,sheet 13
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 1 && notNullValueNum(nextRow2) == 1){
				 currentSubCategory = row[1];
			 }
			 
		 }
 
		 return concept_str;
	 }
};

//generate the part of Slice xml format
gei.generateGEISliceXmlValue = function(text,dataType){
	 if (text == ""){
		 return null;
	 }else{ 
		 var slice_str = "";
		 var text_array = new Array();   
		 text_array = bulidTextArrayFromCSV(text);   

		 if(dataType == "gei-national-slice-xml"){
			 text_array = text_array.slice(0,147);
		 }
		 
		 var currentCategory = "";
		 var currentSubCategory = "";
		 
		 //here build each line data
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
				 var cuCa = formatValueForId(currentCategory);
				 var cuSubCa = formatValueForId(currentSubCategory);
				 var cuNa = formatValueForId(name);
				 var columnName = cuCa.substring(0,15)+"_"+cuSubCa.substring(0,15)+"_"+cuNa.substring(0,25);
				 
				
				 slice_str = slice_str +
		 			"    <metric concept='"+columnName+"'/>\n";
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
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 0 && notNullValueNum(nextRow2) == 0){
				 currentSubCategory = currentCategory;
			 }
			 
			 //current row is one data,the next 2 rows are one data,it's sub-category is the category,sheet 13
			 if(notNullValueNum(row) == 1 && notNullValueNum(nextRow) == 1 && notNullValueNum(nextRow2) == 1){
				 currentSubCategory = row[1];
			 }
			 
		 }
 
		 return slice_str;
	 }
};


/**
 * this method is build the data to text array
 * @param text the .csv file value
 * @return
 */
function bulidTextArrayFromCSV(text){
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
	 return text_array;
}

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

/**
 * format the value when we read from the csv,sometimes it have , " % and () 
 * @param rVal
 * @return
 */
function formatValue(rVal){
	var val = "";
	 //first remove the blank,comma and ",here need float
	 rVal = rVal.replace(/\s/g, '').replace(/\"/g, '').replace(",","");
	 
	 if(rVal.indexOf("(") != -1){
		 //in the excel,when the number is negative,it will use ()
		 val = -(rVal.substring(1,(rVal.length-1)));
	 }else if(rVal.indexOf("%") != -1){
		 //the pde data need float,so here change percent
		 val = rVal.substring(0,(rVal.length-1))/100;
	 }else{
		 //sometimes the value is - ,so here change it to 0
		 if(isNaN(rVal)){
			 val = 0;
		 }else{
			 val = rVal;
		 }
	 }
	 return val;
}

/**
 * format the name remove all the invalid char 
 * @return
 */
function formatValueForId(value){
	var val = value.replace(/\s/g, "").replace(/\(|\)|\$|\-|\/|\+|\,|\"|\.|\%|\'/g, "");
	return val;
}
