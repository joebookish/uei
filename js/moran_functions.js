// Step 3 - calculate the local Moran's I 
// for each tract
function moranI(mdata){

    //var moran_vector = [];
    moran_vector = [];
    var zscores = calcZs(mdata);
    var max = 0;
    var min = 0;
    mdata.features.forEach(function(feature,i){
        var neighbors = [];
        // find neighboring tracts based on weight matrix 
        weight_matrix[i].forEach(function(tract,j){
            if(tract){
                neighbors.push({
                    "id":j
                }); 
            }
        });
        
        // calculate difference from Zscore mean for neighbors 
        var dmean_sum_neighbors = 0;
        neighbors.forEach(function(tract){
            if(!isNaN(zscores.z_tot_set[tract.id])){
                tract["dmean"] = (zscores.z_tot_set[tract.id] - zscores.zset_mean);
            } else {
                tract["dmean"] = NaN;
                //tract["dmean"] = 0;
            }

            dmean_sum_neighbors += tract.dmean;
        });      

        // calculate difference from Z scores mean for the current tract
        dmean_i = (zscores.z_tot_set[i] - zscores.zset_mean);

        // calculate the set
        var d_set = 0;
        neighbors.forEach(function(tract){
            d_set += tract.dmean^2; 
        });      
        d_set = d_set/neighbors.length;
        
        // calculate the moran I for tract
        var Ii;
        if(d_set == 0 ){
            Ii = 0;
        } else {
            Ii = (dmean_i/d_set) * dmean_sum_neighbors;
        }

        Ii = parseFloat(Ii.toFixed(2));
        moran_vector.push(Ii);
        
        if(max < Ii){
            max = Ii;
        }
        if(min > Ii){
            min = Ii;
        }
  });
    
    console.log("local morans I stats");
    console.log("average: ",average(moran_vector));
    console.log("standard deviation: ", standardDeviation(moran_vector));
    console.log("max: ",max);
    console.log("min: ", min);
    console.log(moran_vector);
    var statLabels = calcStatsLabel(moran_vector);
    return { 
        "values": moran_vector,
        "stat_labels": statLabels};
}

//Step 2 and call for Step 1
//calculate the mean  
//for the total Zscores 
function calcZs(mdata){
    //get moran variables
    var moran_variables = readMoran();
   
    // will replace the mdata with scaled and centered values
    var tracts_mo_vars = generateDataset(mdata, moran_variables.val); 
    var z_tot_set = [];

    // center and scale each variable (can be done in R)
    tracts_mo_vars_cs = calcTcs(tracts_mo_vars);

    // for each tract, calculate the Ztot
        tracts_mo_vars_cs.forEach(function(tract){
            var z_tot =0;
            var i = 0;
            tract.forEach(function(mo_var,i_var){
                if(!isNaN(mo_var)){
                    z_tot += mo_var;
                } else {
                    z_tot = NaN;
                } 
            
                i++;
            });
            z_tot = z_tot/i;
            z_tot_set.push(z_tot);
        });

    // calculate the mean of all the cencus Z scores
    var zset_mean = (z_tot_set.reduce((a,b) => a += b ))/z_tot_set.length;
    // for each variable, calculate Zvar  
    return {"z_tot_set":z_tot_set, 
            "zset_mean":zset_mean};
}

//Step 1
//calculate Z score for each tract 
//based on the selected variables 
function calcTcs(tracts_mo_vars){
    // calculate mean
    var totals = [];
    var ntmv = tracts_mo_vars;
    var i;
    for(i =0; i<ntmv.length; i++){
        for(var j=0;j<ntmv[i].length;j++){
            if(i==0){
                totals.push(0);
            }
            if(!isNaN(ntmv[i][j])){
                totals[j] += ntmv[i][j];
            }
        }
    }
    
    var means =[];
    totals.forEach(function(total){
        means.push((parseInt(total/i)));
    });
    
    // calculate sd
    var sd = [];
    for(var k=0;k<ntmv.length;k++){
        for(var j=0;j<ntmv[k].length;j++){
            if(k==0){
                sd.push(0);
            }
           if(!isNaN(ntmv[k][j])){
                sd[j] += Math.pow((ntmv[k][j] - means[j]),2);
            }
        }
    }
   var sdf = [];
   sd.forEach(function(sdi){
        sdf.push(parseInt(Math.sqrt(sdi/i)));
    });
  
    // center and scale value
    var tracts_mo_vars_cs = [];
    tracts_mo_vars.forEach(function(tract,k){
        var temp_vars = [];
        tract.forEach(function(temp_var,j){
            if(!isNaN(temp_var)){
                temp_vars.push((temp_var-means[j])/sdf[j]);
            } else {
                temp_vars.push(NaN);
            }
        });
        tracts_mo_vars_cs.push(temp_vars);
    });
    return tracts_mo_vars_cs;
}

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

// Calculated stats label from stats
function calcStatsLabel(moran_vector){
    var mvstats = [];

    var stats = calcStats(moran_vector);
    moran_vector.forEach(function(moran){
        if(moran < stats.lower_maj_outlier){
            mvstats.push(["lmaj",1]);
        } else if (stats.lower_maj_outlier <= moran && moran < stats.lower_min_outlier){
            mvstats.push(["lmin",2]);
        } else if (stats.upper_min_outlier < moran && moran <= stats.upper_maj_outlier){
            mvstats.push(["umin",4]);
        } else if (moran > stats.upper_maj_outlier){
            mvstats.push(["umaj",5]);
        } else if (isNaN(moran)){
            mvstats.push(["NA",NaN]);
        } else {
            mvstats.push(["iqr",3]);
        }
    });

    return mvstats;
}

//Stats on morans I set
function calcStats(moran_vector){
    var mmedian,mQ1,mQ3,mx;
    var moran_vector_temp = moran_vector.slice().sort((a,b) => a - b);
    mmedian = Median(moran_vector_temp,true);
    mQ1 = Median(moran_vector_temp.slice(0,mmedian.lindex+1),true)
    mQ3 = Median(moran_vector_temp.slice(mmedian.uindex,moran_vector_temp.length),true)

    mx = (mQ3.lindex + mmedian.uindex) - mQ1.lindex;
    mQ3.mindex = mQ3.mindex + mx;
    mQ3.lindex = mQ3.lindex + mx;
    mQ3.uindex = mQ3.uindex + mx;

    var lmajOLi = parseInt(mx/4);  
    var lminOLi = parseInt(mx/2);
    var uminOLi = mQ3.lindex; 
    var umajOLi = mQ3.lindex + lmajOLi;

    return {
        "median": mmedian,
        "Q1": mQ1,
        "Q3": mQ3,
        "lower_maj_outlier": moran_vector_temp[lmajOLi],
        "lower_min_outlier": moran_vector_temp[lminOLi],
        "upper_min_outlier": moran_vector_temp[uminOLi],
        "upper_maj_outlier": moran_vector_temp[umajOLi]};
}

// return midpoint
function Median(in_array,sorted=false){
    var array = in_array;
    //sort the array
    if(!sorted){
        array  = in_array.slice().sort((a,b) => a - b);
    }
    
    array = array.filter(x => !isNaN(x));
    var isodd = Boolean(array.length%2);
    var mindex;
    var mvalue;
    var uindex,lindex;
   
    if(isodd){
        mindex = parseInt(array.length/2);
        uindex = mindex + 1;
        lindex = mindex - 1;
        mvalue = array[mindex];
    } else {
        uindex = array.length/2;
        lindex = uindex - 1;
        mindex = parseFloat(((uindex+lindex)/2).toFixed(2));
        mvalue = parseFloat(((array[uindex]+array[lindex])/2).toFixed(1));
    }
    return {
        "isodd": isodd,
        "value": mvalue,
        "mindex": mindex,
        "uindex": uindex,
        "lindex": lindex
    };
}

/*
 * this might be helpful 
 * at some point... 
https://mathjs.org/index.html
*/
