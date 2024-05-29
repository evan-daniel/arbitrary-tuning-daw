class Note {
    constructor(context, id, pitch, velocity) {
        this.context = context; 
        this.id = id; 
        this.pitch = pitch; 
        this.velocity = velocity; 
        
        console.log(`NOTE STARTED: ID: ${this.id}, PITCH: ${this.pitch}`); 

        this.gain = this.context.createGain(); 
        
        this.panner = this.context.createStereoPanner(); 
        this.panner.pan.setValueAtTime(0, this.context.currentTime);
        this.panner.connect(this.context.destination); 
        
        this.gain.connect(this.panner); 
        this.gain.gain.setValueAtTime(0.9, this.context.currentTime); 
        
        this.oscillator = this.context.createOscillator(); 
        this.oscillator.type = "sawtooth"; 
        this.oscillator.frequency.value = this.pitch; 
        this.oscillator.connect(this.gain); 
        this.oscillator.start(0); 
    }
        
    turn_off = () => {
        console.log(`NOTE ENDED: ID: ${this.id}, PITCH: ${this.pitch}`); 
        
        this.velocity = 0; 
        this.gain.gain.setTargetAtTime(this.velocity, this.context.currentTime + 0.05, 0.05); 
        this.oscillator.stop(this.context.currentTime + 0.1); 
    }
}

export default Note; 