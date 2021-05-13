const {Vector2f, Vector3f} = require("./Vectors")
const fs = require('fs');

module.exports = class {
    static async loadObjModel(file, splitterSubModel, ArrayConfiguration) {
        let indices = new Array()
        let vertices = new Array()
        let textures = new Array()
        let normals = new Array()

        let verticesArray
        let normalsArray 
        let textureArray
        let indicesArray

        let arrayInitialization = false
        let lastOBJStruct = false
        let subModelsExport = false
        let spliterLineIndex
        let indexSplitter
        if(!splitterSubModel){
            indexSplitter = 0
        }else {
            indexSplitter = splitterSubModel
        }
            var datas = fs.readFileSync(file, "utf8")
            var lines = datas.split("\n")
            for(var i = indexSplitter ; i < lines.length ; i++){
                let line = lines[i]
                var currentLine = line.split(" ")
                if(line.startsWith("v ")){
                    if(lastOBJStruct){
                        subModelsExport = true;
                        spliterLineIndex = i;
                        break;
                    }
                    let vertex = new Vector3f(parseFloat(currentLine[1]), parseFloat(currentLine[2]), parseFloat(currentLine[3]))
                    vertices.push(vertex)
                }else if(line.startsWith("vt ")){
                    let texture = new Vector2f(parseFloat(currentLine[1]), parseFloat(currentLine[2]))
                    textures.push(texture)
                }else if(line.startsWith("vn ")){
                    let normal = new Vector3f(parseFloat(currentLine[1]), parseFloat(currentLine[2]), parseFloat(currentLine[3]))
                    normals.push(normal)
                }else if(line.startsWith("f ")){
                    //checking for subModel
                    if(!lastOBJStruct){
                        lastOBJStruct = true
                    }
                    if(!arrayInitialization){
                        textureArray = new Array(vertices.length * 2)  
                        normalsArray = new Array(vertices.length * 3)
                        arrayInitialization = true
                    }

                    let vertex1 = currentLine[1].split("/")
                    let vertex2 = currentLine[2].split("/")
                    let vertex3 = currentLine[3].split("/")
                    if(ArrayConfiguration){
                        vertex1[0] -= ArrayConfiguration[0]
                        vertex1[1] -= ArrayConfiguration[1]
                        vertex1[2] -= ArrayConfiguration[2]
                        vertex2[0] -= ArrayConfiguration[0]
                        vertex2[1] -= ArrayConfiguration[1]
                        vertex2[2] -= ArrayConfiguration[2]
                        vertex3[0] -= ArrayConfiguration[0]
                        vertex3[1] -= ArrayConfiguration[1]
                        vertex3[2] -= ArrayConfiguration[2]
                    }
                    this.processVertex(vertex1, indices, textures, normals, textureArray, normalsArray)
                    this.processVertex(vertex2, indices, textures, normals, textureArray, normalsArray)
                    this.processVertex(vertex3, indices, textures, normals, textureArray, normalsArray)
                }
            }
        verticesArray = new Array(vertices.length * 3)
        indicesArray = new Array(indices.length)

        let vertexPointer = 0
        for(var i = 0 ; i < vertices.length ; i++){
            verticesArray[vertexPointer++] = vertices[i].x
            verticesArray[vertexPointer++] = vertices[i].y
            verticesArray[vertexPointer++] = vertices[i].z
        }

        for(var i = 0 ; i < indices.length ; i++){
            indicesArray[i] = indices[i]
        }

        let obj = {verticesArray, textureArray, indicesArray, normalsArray}
        if(subModelsExport){
            let currentArrayLength
            if(ArrayConfiguration){
                currentArrayLength = [vertices.length += ArrayConfiguration[0], textures.length += ArrayConfiguration[1], normals.length += ArrayConfiguration[2]]
            }else {
                currentArrayLength = [vertices.length, textures.length, normals.length]
            }

            return [obj, spliterLineIndex, currentArrayLength]
        }
        return [obj]
    }

    static processVertex(vertexData, indices, textures, normals, textureArray, normalsArray){
        let currentVertexPointer = parseInt(vertexData[0]) - 1
        indices.push(currentVertexPointer) 
        let currentTex = textures[parseInt(vertexData[1]) - 1]
        textureArray[currentVertexPointer*2] = currentTex.x
        textureArray[currentVertexPointer*2+1] = 1 - currentTex.y
        let currentNorm = normals[parseInt(vertexData[2]) - 1]
        normalsArray[currentVertexPointer*3] = currentNorm.x
        normalsArray[currentVertexPointer*3+1] = currentNorm.y
        normalsArray[currentVertexPointer*3+2] = currentNorm.z
    }
}