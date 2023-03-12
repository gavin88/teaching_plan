class AudioAgc{
    constructor(audioRef){
        this.ref = audioRef;   
        this.gain = 0;
        this.NcCount = 0;
    }
    destroy(){

    }

    calcuDbRms(audioData){
        let db = 0;
        let rms = 0;
        let count = 0;

        for(let i = 0;i<audioData.length;i++){
            count = count + (audioData[i] * audioData[i]);
        }
        rms = Math.sqrt(count / audioData.length);
        db = 20 * Math.log10(rms);
        return db;
    }

    agcProcess(audioData){

        const floatArray = new Float32Array(audioData.length);
        if (audioData instanceof Float32Array) {

            let db = this.calcuDbRms(audioData);
   
            if(db < -40){ 
                this.NcCount ++;
                if(this.NcCount > 10){
                    for(let i = 0;i<floatArray.length;i++){
                        floatArray[i] = 0;
                    }
                    return floatArray;
                }
            }else{
                this.NcCount = 0;
            }

            let amp = 0 ;
            let factor = this.ref - db;

            if(factor > this.gain){
                this.gain = this.gain + 0.5;
            }else{
                this.gain--;
            }

            amp = Math.pow(10,(this.gain/20));

            for(let i = 0;i<audioData.length;i++){
                floatArray[i] = audioData[i] *amp;
                if(floatArray[i] <= -1){
                    floatArray[i] = -1;
                    // console.log("overflow");
                    amp = 1/(1 - audioData[i]);
                }
                if(floatArray[i] >= 1){
                    floatArray[i] = 1;
                    // console.log("overflow");
                    amp = 1/audioData[i];
                }
            }

            let outputDb = this.calcuDbRms(floatArray);

            // console.log("input db = "+ db +",output db="+outputDb+",Amp="+amp+",gain="+this.gain);

            return floatArray;

        } else if (audioData instanceof Int16Array) {

        }

    }
}