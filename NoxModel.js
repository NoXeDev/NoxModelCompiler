const offsetSize = 4
const {writeArrayIntoIntBuffer} = require("./utils/BufferUtils")

module.exports = class NoxModel{
    constructor(SubModelsArray){
        this.SubModelsArray = SubModelsArray
        this.hasSubModels = false
        if(SubModelsArray.length > 1){
            this.hasSubModels = true
        }

        this.headers = new Array()
        this.headers.push(SubModelsArray.length)
        SubModelsArray.forEach(e => {
            this.headers.push(e.modelBuffer.length)
        })

        let size = 0
        SubModelsArray.forEach(element => {
            size += element.modelBuffer.length
            console.log(size)
        });

        this.NoxModelSize = size + (this.headers.length * offsetSize)
        console.log(this.NoxModelSize)
        this.modelBuffer = Buffer.alloc(this.NoxModelSize)
    }

    async prepareBuffer(){
        var offsets = await writeArrayIntoIntBuffer(this.modelBuffer, this.headers, offsetSize)
        await this.SubModelsArray.forEach(e => {
            console.log(offsets)
            console.log(e.modelBuffer.copy(this.modelBuffer, offsets))
            offsets += e.modelBuffer.length
            console.log(this.modelBuffer)
        })
        console.log(offsets)
    }
}