const OBJloader = require("./ObjLoader")
const fs = require("fs");
const SubModel = require("./SubModel");
const NoxModel = require("./NoxModel");


(async () => {
    if(!process.argv[2]){throw new Error("No arg provided")}
    var OBJ = await OBJloader.loadObjModel(process.argv[2])
    console.log("SubModel Detected, split point at : " + OBJ[1])
    let ObjectsModel = new Array(OBJ[0])
    while(OBJ[1]){
        OBJ = await OBJloader.loadObjModel(process.argv[2], OBJ[1], OBJ[2])
        console.log("while")
        if(OBJ[1]){
            console.log("An other SubModel Detected, split point at : " + OBJ[1])
        }
        ObjectsModel.push(OBJ[0])
    }

    let SubModels = new Array()
    for(var i = 0; i < ObjectsModel.length ; i++)
    {
        SubModels.push(new SubModel(ObjectsModel[i]))
    }
    for(var i = 0; i < SubModels.length; i++){
        await SubModels[i].prepareBuffer()
    }
    console.log(SubModels)
    let finalModel = new NoxModel(SubModels)
    await finalModel.prepareBuffer()
    console.log(finalModel.modelBuffer)

    fs.writeFile(process.argv[2].replace(".obj", ".nm"), finalModel.modelBuffer, "binary", function(){})
})()