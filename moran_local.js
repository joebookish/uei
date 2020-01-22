function moranTemp(dataset,geospatial,adjlist){
    console.log("this is awesome");
    var moran_vector = [];
    dataset.forEach(function(feature){
        moran_vector.push(parseFloat(Math.random().toFixed(2)));
    });

    return moran_vector;
}

const MI={
    CalcLMI:function(dataset,geojson,adjlist, isbounds){
        let MeanV = CalcMean(dataset)
        let MIset = []
        for(i=0;i<dataset.length;i++){
            geojson[i].properties.LMI = CalcByi(i,MeanV,dataset,isbounds,geojson,adjlist)
            MIset.push(CalcByi(i,MeanV,dataset,isbounds,geojson,adjlist))
        }
        return MIset
    },
    //calc Local Moran's I by classification result result
    CalcLMI_byclustering:function(clusterdata){
        let dataset = []
        for(let i=0;i<clusterdata.length;i++){
            for(let m=0;m<clusterdata[i].length;m++){
                dataset[clusterdata[i][m]] = CreateVector(clusterdata.length, i)
            }
        }
        return MI.CalcLMI(dataset)
    },
    rendering:function (){
    }
}


function CalcByi(id,Mean,dataset,isbounds,geojson,adjlist){
    let result=0;
    let list
    if(isbounds)
        list = get_bound_weight(id,adjlist)

    let thisvectors = []
    list.forEach( (weight,thisid)=>{
        thisvectors.push(dataset[thisid])
    })

    list.forEach( (weight,thisid)=>{
        result = plusV(result, VmultiN(weight,minusV(dataset[id],Mean)))
    })
    result = multiV( result,minusV(dataset[id],Mean))

    let sumequ = 0
    geojson.forEach( (ob, i)=>{
        if ( i != id){
            let minusVector = minusV(dataset[i],Mean)
            sumequ += multiV(minusVector, minusVector)
        }
    })
    sumequ = sumequ / (geojson.length-1)
    result = result / sumequ

    //weight norm
    let weightsum=0
    list.forEach( (weight,thisid)=>{
        weightsum += weight
    })
    if(weightsum==0)
        return 0
    else
        return result / weightsum
}

// get weight by boundary
function get_bound_weight(id,adjlist){
    let result =new Map()
    let thisvector = adjlist.get(id)

    thisvector.forEach((d,i)=>{
        if(i!=id)
        result.set(i, thisvector.get(i)/thisvector.get(id))
    })
    return result
}
function CreateVector(length,label){
    let vectors = []
    for(let i=0;i<length;i++){
        if(i==label)
            vectors.push(1)
        else
            vectors.push(0)
    }
    return vectors;
}
function CalcMean(vectors){
    let result=null;
    for (let i=0;i<vectors.length;i++){
        if(result==null)
            result = $.extend(true, [], vectors[i])
        else{
            for(let m=0;m<vectors[i].length;m++){
                result[m]+=vectors[i][m]
            }
        }
    }
    for(let m=0;m<result.length;m++){
        result[m] = result[m]/vectors.length
    }
    return result
}
function VmultiN(n,v){
    let result = $.extend(true, [], v)
    for(let i=0 ; i < result.length;i++){
        result[i]*=n
    }
    return result
}

function multiV(v1,v2){
    let result = 0;
    for(let i=0;i<v1.length;i++){
        result += v1[i]* v2[i]
    }
    return result
}
function minusV(v1,v2){
    let result = $.extend(true, [], v1)

    for(let i=0 ; i < v1.length;i++){
        result[i] = v1[i]*1-v2[i]*1
    }
    return result
}
function plusV(v1,v2){
    if(v1==0)
        return v2;
    let result = new Array()
    for(let i=0 ; i < v1.length;i++){
        result[i] = v1[i]*1+v2[i]*1
    }
    return result;
}

$.getJSON("geo_2000.json")
$.getJSON("weight_matrix.json"
$.getJson("tract_indeces.json")
$.getJson("morans_i_sd.json")

// after variables are selected by user and a census tract (tract_i) is chosen,
// assign the number of selected variables to 'n'.
// import geo_xxxx.json
// filter file 'geo_xxxx.json' for selected variables
// import weight_matrix.json and tract_indeces.json
// start from [0,0] in weight_matrix and filter each census tract for 1's, which signify shared borders.
// for each 1 in tract_i, pull tract_j's index and filter for its 1's.
// the sum of shared 1's indicates the number of neighbords shared by both i and j.
// This sum will be assigned the name 'Wij' value. Gather the census tracts' selected
// import morans_id_sd.json
// variables from the geo_json file, each of which will be placed into the function 'zi' and 'zj' for each i-j pair.
//
// multiply number of selected values (n) in tracts 1 and 2 times the number of shared boundaries and assign this value 'S'
// for all WIJ values greater than 0, perform the following operation
// selected variable = x
// zi/zj = (value_x - mean(variable))
// ( (ni * nj * Wij * zi * zj) * S ) / (zi)^2 * n
// for each variable, calculate I
// get the year's matrix indeces, which show which index matches which census tract

}

//
console.log(phrase)
}}
