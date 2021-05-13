const {writeArrayIntoFloatBuffer, writeArrayIntoIntBuffer} = require("./utils/BufferUtils")
const offsetSize = 4

module.exports = class SubModel{
    constructor(OBJModel){
        this.headers = new Array(OBJModel.verticesArray.length, OBJModel.textureArray.length, OBJModel.indicesArray.length, OBJModel.normalsArray.length)
        this.verticesArray = OBJModel.verticesArray
        this.textureArray = OBJModel.textureArray
        this.indicesArray = OBJModel.indicesArray
        this.normalsArray = OBJModel.normalsArray

        let headerAdd = 0
        this.headers.forEach((e) => {
            headerAdd += e
        })

        this.modelBuffer = Buffer.alloc((headerAdd * offsetSize) + (this.headers.length * offsetSize))
    }

    async prepareBuffer()
    {
        var offsets
        offsets = await writeArrayIntoIntBuffer(this.modelBuffer, this.headers, offsetSize)
        offsets = await writeArrayIntoFloatBuffer(this.modelBuffer, this.verticesArray, offsetSize, offsets) //writing vertices into buffer
        offsets = await writeArrayIntoFloatBuffer(this.modelBuffer, this.textureArray, offsetSize, offsets) //writing textures into buffer
        offsets = await writeArrayIntoIntBuffer(this.modelBuffer, this.indicesArray, offsetSize, offsets) //writing indices into buffer
        offsets = await writeArrayIntoFloatBuffer(this.modelBuffer, this.normalsArray, offsetSize, offsets)
    }
}