class JitterBuffer {
    constructor(parent, processLen, inputSamplerate, playSamperate, processBufSize, sonic) {
        this.playBuffer = new Array();

        this.stashBuffer = null;
        this.parent = parent;
        this.processLen = processLen;
        this.playBufLen = 2;
        this.inputSamplerate = inputSamplerate;
        this.playSamperate = playSamperate;
        this.sonic = sonic;
        this.delay = 0;
        this.processBufSize = 160;
        this.tempRateBuffer = [];
        this.firstLock = true;

        this.stashLastFrame = null;
        this.isAccPlay = false;
        // default setting
        this.rateProcessor = new MyFilter(this.sonic)
        this.sonic.tempo = 1;

    }

    setDelay(delay) {
        this.delay = delay;
    }

    appendBuffer(fromBuffer) {
        const tempBuffer = this.rateProcessor.pushBuffer(fromBuffer);

        if (tempBuffer === null) {
            // console.log('appendBuffer', 'tempBuffer is null');
            return;
        } else {
            // console.log('appendBuffer', `fromBuffer length is ${fromBuffer.length} and tempBuffer length is ${tempBuffer.length}`);
        }

        // 双通道 -> 单通道
        const simpleBuffer = new Float32Array(tempBuffer.length / 2);
        for (let i = 0; i < simpleBuffer.length; i += 1) {
            simpleBuffer[i] = tempBuffer[i * 2];
        }
        // const simpleBuffer = fromBuffer;

        let newBuffer = null;
        if (simpleBuffer instanceof Float32Array) {
            if (this.stashBuffer == null) this.stashBuffer = new Float32Array(0);
            newBuffer = new Float32Array(this.stashBuffer.length + simpleBuffer.length);

        } else if (simpleBuffer instanceof Int16Array) {
            if (this.stashBuffer == null) this.stashBuffer = new Int16Array(0);
            newBuffer = new Int16Array(this.stashBuffer.length + simpleBuffer.length);
        }

        newBuffer.set(this.stashBuffer, 0);
        newBuffer.set(simpleBuffer, this.stashBuffer.length);
        this.stashBuffer = newBuffer;

        // console.log(this.stashBuffer.length);
        while (this.stashBuffer.length > this.processBufSize) {
            this.appendToPlayBuffer();
        }
    }

    extractBuffer(nSamples) {
        let buf = null;
        if (this.stashBuffer != null && this.stashBuffer.length >= nSamples) {
            buf = this.stashBuffer.subarray(0, nSamples);
            this.stashBuffer = this.stashBuffer.subarray(nSamples);
        }
        return buf;
    }

    isPlayBufferLengthLarge() {
        return this.firstLock == false && this.playBuffer.length > 50;
    }

    isPlayBufferLengthEnough() {
        return this.firstLock == false && this.playBuffer.length < 30;
    }

    appendToPlayBuffer() {

        const blockBuffer = this.extractBuffer(this.processBufSize);
        if (blockBuffer != null) {
            this.playBuffer.push(blockBuffer);
        }
    }

    getPlaybackRate() {
        return this.sonic.tempo;
    }

    push(buf) {
        // 不缓冲数据了。
        if (this.firstLock === false) {
            const playBufferLength = this.playBuffer.length;
            //
            if (playBufferLength > 50) {
                const diff = (playBufferLength - 40) / 60
                this.sonic.tempo = 1 + diff;
                // this.sonic.tempo = 1;
            } else if (playBufferLength < 30) {
                this.sonic.tempo = 1;
            }
        }

        this.appendBuffer(buf);
        // this.appendToPlayBuffer();
        // console.log("this.stashBuffer:"+this.stashBuffer.length);
    }

    pop() {

        let buf = null;
        //console.log('pop');
        // 30
        if (this.firstLock && this.playBuffer.length > 30) {
            console.log('pop', 'firstLock is true and playBuffer.length > 30');
            this.firstLock = false;
        }

        if (this.firstLock) {
            // console.log('pop', 'firstLock is true and return null');
            return buf;
        } else {
            if (this.playBuffer.length === 0) {
                this.firstLock = true;
            }
        }

        if (this.playBuffer.length > 0) {
            buf = this.playBuffer.shift();
            this.stashLastFrame = buf;
        } else {
            // this.appendToPlayBuffer();
            // if (this.playBuffer.length > 0) {
            //     buf = this.playBuffer.shift();
            //     this.stashLastFrame = buf;
            // } else {
            //     return null;
            // }
            return null;
        }
        // this.appendToPlayBuffer();

        if (buf == null && this.stashLastFrame != null) {
            return null;
        }
        return buf;


    }

    flushTempBuf() {

    }

    getLength() {
        return this.stashBuffer == null ? 0 : this.stashBuffer.length;
    }

    getPlayBufferList() {
        return this.playBuffer.length;
    }

    getPlayBufferLen() {
        return this.playBuffer.length;
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
        }
        return floatArray;
    }

    destroy() {
        this.tempRateBuffer = [];
        this.playBuffer = [];
        this.stashBuffer = null;
        this.isAccPlay = false;
        this.stashLastFrame = null;

        if (this.rateProcessor) {
            this.rateProcessor.destroy();
            this.rateProcessor = null;
        }
    }
}