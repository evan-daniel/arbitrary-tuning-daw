
// MAIN 

window.addEventListener('DOMContentLoaded', async () => {
    
    // KEYBOARD 

    const piano = document.querySelector('.piano'); 
    for(let i = 0; i < 88; ++i) {
        const key = document.createElement('div'); 
        key.classList.add('key');  
        key.setAttribute('data-key-number', i); 
        piano.appendChild(key); 
    }


    const midiAccess = await navigator.requestMIDIAccess(); 
    console.log('MIDI INPUTS', midiAccess.inputs); 
    for(let input of midiAccess.inputs.values()) {
        input.addEventListener('midimessage', midi_message => {
            switch(midi_message.data[0]) {
                case 144: 
                    console.log('ON', midi_message.data[1]); 
                    document.querySelector(`.key[data-key-number = "${midi_message.data[1] - 21}"]`).dataset.active = 'true'; 

                    break; 
                case 128: 
                    console.log('OFF', midi_message.data[1]); 
                    document.querySelector(`.key[data-key-number = "${midi_message.data[1] - 21}"]`).dataset.active = 'false'; 
                    break; 
            }
        }); 
    }
}); 
