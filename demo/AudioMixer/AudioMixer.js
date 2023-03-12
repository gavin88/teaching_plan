class AudioMixer {
    constructor(){
        console.log("create audio mixer!");
        this.audioMixerObj = new Array(16);  //最多支持16路混音
        this.audioIndex = 0;
    }

    destroy(){
        this.audioMixerObj = null;
    }

    feedAudio(audioData){
        //console.log("len="+audioData.length);
        if(this.audioIndex < 16){
            this.audioMixerObj[this.audioIndex] = audioData;
            this.audioIndex++; 
        }
    }

    clear(){
        for(let i = 0;i < 16; i++){
            this.audioMixerObj[i] = null;
        }
        this.audioIndex = 0;
    }

    audioMixerProcessor(){

        let retBuffer = null;
        let mixerBuf1 = new Array(8);
        let mixerBuf2 = new Array(4);
        let mixerBuf3 = new Array(2);

        for(let i = 0;i < 8; i++){
            mixerBuf1[i] = null;
        }
        for(let i = 0;i < 4; i++){
            mixerBuf2[i] = null;
        }
        for(let i = 0;i < 2; i++){
            mixerBuf3[i] = null;
        }

        for(let i = 0;i < 8; i++){
            if(this.audioMixerObj[i * 2] != null ){
                if(this.audioMixerObj[i * 2 + 1] != null){
                    mixerBuf1[i] = this.int2Float(this.audioMixer(this.float2Int(this.audioMixerObj[i * 2]),this.float2Int(this.audioMixerObj[i * 2 +1])));
                }else{
                    mixerBuf1[i] = new Float32Array(this.audioMixerObj[i * 2]);
                }
            }else{
                break;
            }
        }

        for(let i = 0;i < 4; i++){
            if(mixerBuf1[i * 2] != null ){
                if(mixerBuf1[i * 2 + 1] != null){
                    mixerBuf2[i] = this.int2Float(this.audioMixer(this.float2Int(mixerBuf1[i * 2]),this.float2Int(mixerBuf1[i * 2 +1])));
                }else{
                    mixerBuf2[i] = new Float32Array(mixerBuf1[i * 2]);
                }
            }else{
                break;
            }
        }

        for(let i = 0;i < 2; i++){
            if(mixerBuf2[i * 2] != null ){
                if(mixerBuf2[i * 2 + 1] != null){
                    mixerBuf3[i] = this.int2Float(this.audioMixer(this.float2Int(mixerBuf2[i * 2]),this.float2Int(mixerBuf2[i * 2 +1])));
                }else{
                    mixerBuf3[i] = new Float32Array(mixerBuf2[i * 2]);
                }
            }else{
                break;
            }
        }

        if( mixerBuf3[1] != null){
            retBuffer  = this.int2Float(this.audioMixer(this.float2Int(mixerBuf3[0]),this.float2Int(mixerBuf3[1])));
        }else if(mixerBuf3[0] != null){
            retBuffer = new Float32Array(mixerBuf3[0]);
        }

        return retBuffer;
    }

    audioMixer(inputAudioArray1,inputAudioArray2){
        let outputAudioArray = new Int16Array(inputAudioArray1.length);
        if(inputAudioArray1.length == inputAudioArray2.length ){
            for(let i = 0;i < inputAudioArray1.length; i++){
                if((inputAudioArray1[i] < 0)&&(inputAudioArray2[i] < 0)){
                    outputAudioArray[i] = (inputAudioArray1[i] + inputAudioArray2[i]) + (inputAudioArray1[i] * inputAudioArray2[i]) / 32767;
                }else{
                    outputAudioArray[i] = (inputAudioArray1[i] + inputAudioArray2[i]) - (inputAudioArray1[i] * inputAudioArray2[i]) / 32767;
                }
            }
        }else{
            console.log("The length of input arrays must be equal! "+inputAudioArray1.length+"!="+inputAudioArray2.length);
        }
        return outputAudioArray;
    }
    
    float2Int(floatArray) {
        const intArray = new Int16Array(floatArray.length);
        for (let i = 0; i < floatArray.length; i++) {
            let s = floatArray[i];
            if (s < 0) {
                s = s * 32768;
            } else {
                s = s * 32767;
            }
            intArray[i] = Math.floor(s);
        }
        return intArray;
    }

    int2Float(intArray) {
        const floatArray = new Float32Array(intArray.length);
        for (let i = 0; i < intArray.length; i++) {
            const sample = intArray[i];
            if (sample < 0) {
                floatArray[i] = sample / 32768;
            } else {
                floatArray[i] = sample / 32767;
            }
            if(floatArray[i] < -1 || floatArray[i] > 1){
                console.log("audio overflow");
            }
        }
        return floatArray;
    }
}

