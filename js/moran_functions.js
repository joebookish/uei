function moranI(mdata){

    var moran_vector = [];
    var zscores = calcZs(mdata);
    console.log(zscores); 
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
                tract["dmean"] = 0;
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
        var Ii = (dmean_i/d_set) * dmean_sum_neighbors;
        moran_vector.push(parseFloat(Ii.toFixed(2)));
        
  });
    /*
    mdata.features.forEach(function(feature){
        moran_vector.push(parseFloat(Math.random().toFixed(2)));
    });
    */
    console.log(moran_vector);
    return moran_vector;
}

function calcZs(mdata){
    //get moran variables
    var moran_variables = readMoran();
   // will replace the mdata with scaled and centered values
    var tracts_mo_vars = generateDataset(mdata, moran_variables.val); 
    var z_tot_set = [];
    // center and scale each variable (can be done in R)
    tracts_mo_vars_cs = tracts_mo_vars;

    // for each tract, calculate the Ztot
        tracts_mo_vars.forEach(function(tract){
            var z_tot =0;
            var i = 0;
            tract.forEach(function(mo_var,i_var){
                if(!isNaN(mo_var)){
                    z_tot += mo_var;
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


