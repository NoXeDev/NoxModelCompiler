module.exports = {
    async writeArrayIntoFloatBuffer(buffer, array, offsetSize, offsets){
        var newOffsets
        for(var i = 0 ; i < array.length ; i++){
            newOffsets = buffer.writeFloatLE(array[i], i * offsetSize + (offsets ? offsets : 0))
        }
        return newOffsets
    },
    
    async writeArrayIntoIntBuffer(buffer, array, offsetsSize, offsets){
        var newOffsets
        for(var i = 0 ; i < array.length ; i++){
            newOffsets = buffer.writeInt32LE(array[i], i * offsetsSize + (offsets ? offsets : 0))
        }
        return newOffsets
    }
}