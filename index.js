const OBJloader = require("./ObjLoader")
const fs = require("fs");

//load obj and process vertices, UV and indices

(async () => {
    var {verticesArray, textureArray, indicesArray, normalsArray} = OBJloader.loadObjModel("in.obj")
    console.log(verticesArray) //debug 
    console.log(normalsArray)

    var offsetSize = 4 //size of float and ints
    //setup headers
    var headers = [verticesArray.length, textureArray.length, indicesArray.length, normalsArray.length]
    headers.forEach(e => {
        console.log(e)
    })
    var BufferAllocate = ((verticesArray.length + textureArray.length + indicesArray.length + normalsArray.length) * offsetSize) + (headers.length*offsetSize)
    console.log(BufferAllocate)

    //Buffer allocation
    var buf = Buffer.allocUnsafe(BufferAllocate);

    //writting datas into buffer and register offsets after for others array
    var offsets
    offsets = await writeArrayIntoIntBuffer(buf, headers, offsetSize)
    console.log(offsets)
    offsets = await writeArrayIntoFloatBuffer(buf, verticesArray, offsetSize, offsets) //writing vertices into buffer
    console.log(offsets)
    offsets = await writeArrayIntoFloatBuffer(buf, textureArray, offsetSize, offsets) //writing textures into buffer
    console.log(offsets)
    offsets = await writeArrayIntoIntBuffer(buf, indicesArray, offsetSize, offsets) //writing indices into buffer
    console.log(offsets)
    offsets = await writeArrayIntoFloatBuffer(buf, normalsArray, offsetSize, offsets)

    // Printing the buffer
    console.log(buf);

    fs.writeFile("out.nm", buf, "binary", function(){})
})()


async function writeArrayIntoFloatBuffer(buffer, array, offsetSize, offsets){
    var newOffsets
    for(i = 0 ; i < array.length ; i++){
        newOffsets = buffer.writeFloatLE(array[i], i * offsetSize + (offsets ? offsets : 0))
    }
    return newOffsets
}

async function writeArrayIntoIntBuffer(buffer, array, offsetsSize, offsets){
    var newOffsets
    for(i = 0 ; i < array.length ; i++){
        newOffsets = buffer.writeInt32LE(array[i], i * offsetsSize + (offsets ? offsets : 0))
    }
    return newOffsets
}