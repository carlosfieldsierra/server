const express = require("express")
const readline = require('readline');

const app = express()
const port = 3000
const fs = require("fs") // read file

/* 
This function swaps the key and values 
in a dictionary and then returns that new 
dictionary.
*/
function swap(json){
    var ret = {};
    for(var key in json){
        ret[json[key]] = key;
    }
    return ret;
}

//(English to Spanish)
/*
This function makes a dictionary of english
words mapped to there respective spanish 
words and then returns it.
*/
const  gete2sObj = async ()=>{
    const dic = {};
    const fileStream = fs.createReadStream("Spanish.txt")
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })
    for await (const line of rl){
        var words = line.split("\t")
        if (words[1] && words[0]){
            var translatedWord = words[1].split("/")[0];
            var translatedWord = translatedWord.split("[")[0];
            var translatedWord = translatedWord.split("(")[0];
            var translatedWordTwo = translatedWord.split(' ');
            if (translatedWordTwo[0] === 'el'){
                translatedWordTwo = translatedWordTwo[0]+' '+translatedWordTwo[1]
            }
            else if (translatedWordTwo[0] === 'la'){
                translatedWordTwo =  translatedWordTwo[0]+' '+translatedWordTwo[1]
            }
            else{
                translatedWordTwo = translatedWordTwo[0]

            }

            dic[words[0]] = translatedWordTwo;
        }
    }
    return dic;
}

// (Spanish to English)
/*
This function makes a dictionary of spanish
words mapped to there respective english 
words and then returns it.
*/
const gets2eObj = async () => {
    const dic = await gete2sObj();
    return swap(dic);

}
// (English to German)
/*
This function makes a dictionary of english
words mapped to there respective german 
words and then returns it.
*/
const gete2gObj = async () => {
    const dic = {};
    const fileStream = fs.createReadStream("German.txt")
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })
    for await (const line of rl){
        var words = line.split("\t")
        if (words[1] && words[0]){
            var translatedWord = words[1].split("/")[0];
            var translatedWord = translatedWord.split("[")[0];
            var translatedWord = translatedWord.split("(")[0];
            if (!(words[0] in dic)){
                dic[words[0]] =translatedWord
            }
        }
    }
    return dic;

}


// (German to English)
/*
This function makes a dictionary of geramn
words mapped to there respective english 
words and then returns it.
*/
const getg2eObj = async () => {
    const dic = await gete2gObj();
    return swap(dic);
}


// (German to Spanish)
/*
This function makes a dictionary of german
words mapped to there respective spanish 
words and then returns it.
*/
const getg2sObj = async ()=>{
    const dic = {};
    // Englsih to spainish
    const german = await gete2gObj();
    // German to English
    const spanish = await gete2sObj();
    for (key in german){
        var germanKey = german[key];
        var spanishVal = spanish[key];

        dic[germanKey] = spanishVal;
    }
    return dic 

}

// (Spanish to german)
/*
This function makes a dictionary of spanish
words mapped to there respective german 
words and then returns it.
*/
const gets2gObj = async ()=>{
    const dic = {};
    // Englsih to spainish
    const german = await gete2gObj();
    // German to English
    const spanish = await gete2sObj();
    for (key in german){
        var spanishKey = spanish[key];
        var germanVal = german[key];
        dic[spanishKey] = germanVal;
    }
    return dic 

}


/*
This function takes in the dictionary mapping some 
language to an other. And then takes a list of words
to map to the other language through the dictionary
and then sends the res back to the webpage.
*/
const sendTranslation = (dic,contentLst,res) => {
    var retStr = "";
    contentLst = contentLst.slice(1)
    for (var i in contentLst){
        var word = contentLst[i]
        if (word===""){
            retStr+=word+" ";
        }
        else if (dic[word]){
            retStr+=dic[word]+" ";
        } else{
            retStr+=word+" ";
        }
     }
    
     res.send(retStr);

}




app.use(express.static("public_html")) // <--when ever a path matches a file in that folder send it 






app.get('/:translate/:code/:text',async (req,res)=>{
    const code = req.params.code
    const contentLst = req.params.text.split(" ");
    //(English to Spanish)
    if (code==='e2s'){
        const dic = await gete2sObj();

        sendTranslation(dic,contentLst,res);
    }
    // (Spanish to English)
    else if (code==='s2e'){
        const dic = await gets2eObj();
        sendTranslation(dic,contentLst,res);

    }
    // (English to German)
    else if (code==='e2g'){
        const dic = await gete2gObj();
        sendTranslation(dic,contentLst,res);

    }
    // (German to English)
    else if (code==='g2e'){
        const dic = await getg2eObj();
        sendTranslation(dic,contentLst,res);

    }
    // (German to Spanish)
    else if (code==='g2s'){
        const dic = await getg2sObj();
        sendTranslation(dic,contentLst,res);

    }
    // (Spanish to German)
    else if (code==='s2g'){
        const dic = await gets2gObj();
        sendTranslation(dic,contentLst,res);
    } else {
        res.send(req.params.text);
    }
      
    
})


app.listen(port,()=>
console.log(`Example app listening at http://localhost:${port}`)
)

