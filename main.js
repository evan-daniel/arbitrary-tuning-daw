import Note from './Note.js'; 

// MAIN 

window.addEventListener('DOMContentLoaded', () => {
    
    // INIT 

    const context = new AudioContext(); 
    let base = 12; 

    // NOTE IDX TO PITCH CONVENIENCE FUNCTION 

    const idx_to_pitch = idx => {
        const octave = Math.floor(idx / 12); 
        if(base <= idx % 12) {
            return 0; 
        }
        return 27.5 * Math.pow(2, octave + idx % 12 / base)
    }
    
    // KEYBOARD 

    const piano = document.querySelector('.piano'); 
    for(let i = 0; i < 88; ++i) {
        const key = document.createElement('div'); 
        key.classList.add('key');  
        key.setAttribute('data-key-number', i); 
        piano.appendChild(key); 
    }

    // TIMELINE 

    const timeline = document.querySelector('.timeline'); 
    for(let i = 0; i < 64; ++i) {
        const measure = document.createElement('div'); 
        measure.classList.add('measure'); 
        measure.setAttribute('data-measure-number', i); 
        timeline.appendChild(measure); 

        for(let j = 0; j < 16; ++j) {
            const sixteenth = document.createElement('div'); 
            sixteenth.classList.add('sixteenth'); 
            sixteenth.setAttribute('data-sixteenth-position', j); 
            measure.appendChild(sixteenth); 

            for(let k = 0; k < 88; ++k) {
                const cell = document.createElement('div'); 
                cell.classList.add('cell'); 
                cell.setAttribute('data-measure', i); 
                cell.setAttribute('data-sixteenth', j); 
                cell.setAttribute('data-key', k); 
                cell.setAttribute('data-active', 'false'); 
                sixteenth.appendChild(cell); 
            }
        }
    }
    
    // ACTIVATE NOTE

    const activate_note = mouseEvent => {
        if(mouseEvent.buttons === 1) {
            mouseEvent.target.setAttribute('data-active', !mouseEvent.metaKey); 
        }
    }
    timeline.addEventListener('mousedown', activate_note); 
    timeline.addEventListener('mouseover', activate_note); 
    
    // PLAY BUTTON
    
    let is_playing = false; 
    let timestamp_offset = 0; 
    const playButton = document.querySelector('.play-button'); 
    playButton.addEventListener('click', () => {
        is_playing = !is_playing; 
        playButton.innerText = is_playing ? '⏸' : '▶'; 

        if(is_playing) {
            console.log('IS PLAYING'); 
            timestamp_offset = document.timeline.currentTime; 
            window.requestAnimationFrame(play); 
        } else {
            console.log('!IS PLAYING'); 
        }
    }); 

    // PLAY 
    
    let channel = []; 
    let rebeat = false; 

    const play = () => {
        const timestamp = document.timeline.currentTime - timestamp_offset; 

        // GET THE NOTES FROM THE TIMELINE 
        
        const measure = Math.floor(timestamp / 1000); 
        const sixteenth = Math.floor(timestamp % 1000 / 1000 * 16); 
        const notes = document.querySelectorAll(`.cell[data-measure = "${measure}"][data-sixteenth = "${sixteenth}"][data-active = "true"]`); 
        const timeline_note_ids = Array.from(notes).map(note => +note.dataset.key); 
        const channel_note_ids = channel.map(note => note.id); 

        // SET NOTES ON AND OFF 
        
        const on_keys = timeline_note_ids.filter(k => !channel_note_ids.includes(k)); 
        const off_notes = channel.filter(k => !timeline_note_ids.includes(k.id)); 

        for(let k of on_keys) {
            const pitch = idx_to_pitch(k); 
            if(pitch !== 0) {
                channel.push(new Note(context, k, pitch)); 
            }
        } 
        for(let k of off_notes) {
            k.turn_off(); 
            channel = channel.filter(note => note.id !== k.id); 
        }

        // PRINTING 
        
        if(sixteenth === 0) {
            if(!rebeat) {
                rebeat = true; 
                console.log('BEAT', measure, sixteenth, channel); 
            }
        } else {
            rebeat = false; 
        }

        // LOOP 
        
        if(is_playing) {
            window.requestAnimationFrame(play); 
        }
    }; 

    // CHANGE THE BASE 

    document.querySelector('.base-interface').addEventListener('change', change => {
        base = +change.target.value; 

        for(let cell of document.querySelectorAll('.cell')) {
            cell.dataset.offBase = base <= +cell.dataset.key % 12; 
        }
    })
})
