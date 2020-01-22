var dataset_temp, geospatial_temp;
function moranTemp(dataset,geospatial){
    var moran_vector = [];
    var dataset_means = [];

    // temp for checking 
    dataset_temp = dataset;
    geospatial_temp = geospatial;
   

    dataset.forEach(function(feature){
        moran_vector.push(parseFloat(Math.random().toFixed(2)));
    });

    return moran_vector;
}

function calcMean(arr_num){
    var i,j;
    arr_mean = [];
    while(arr_num[0].length > arr_mean.length) arr_mean.push(0);
    console.log(arr_mean)
    for (i = 0; i < arr_num.length;i++) {
        console.log("i is: "+i);
        for(j=0;j < arr_mean.length;j++){
            arr_mean[j] += arr_num[i][j];
            console.log("j is: "+j);
        }
    }
    return arr_mean;
}

function calcSd(arr_num){

}

function moranI(dataset,geospatial){
var moran_vector = [];
    var dataset_means = [];

    for(var i = 0;dataset.length;i++){

    }
    // temp for checking 
    dataset_temp = dataset;
    geospatial_temp = geospatial;
   
    //filter weight_matrix


    dataset.forEach(function(feature){
        moran_vector.push(parseFloat(Math.random().toFixed(2)));
    });

    return moran_vector;
// after variables are selected by user and a census tract (tract_i) is chosen,
// assign the number of selected variables to 'n'.

// import geo_year.json
// filter file 'geo_xxxx.json' for selected variables
// import weight_matrix.json
// start from [0,0] in weight_matrix and filter each census tract for 1's, which signify shared borders.
// for each 1 in tract_i, pull tract_j's index and filter for its 1's.
// the sum of shared 1's indicates the number of neighbords shared by both i and j.
// This sum will be assigned the name 'Wij' value. Gather the census tracts' selected
// variables from the geo_json file, each of which will be placed into the function 'zi' and 'zj' for each i-j pair.
// multiply number of selected values (n) in tracts 1 and 2 times the number of shared boundaries and assign this value 'S'
// for all WIJ values greater than 0, perform the following operation
// selected variable = x
// zi = (value_x - mean(variable))
// ( (ni * nj * Wij * zi * zj) * S ) / (zi)^2 * n

// for each variable, calculate I
// get the year's matrix indeces, which show which index matches which census tract
console.log("hey!");
}
