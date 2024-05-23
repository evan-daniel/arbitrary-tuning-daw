window.addEventListener('DOMContentLoaded', () => {
    
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

    const play = () => {
        const timestamp = document.timeline.currentTime - timestamp_offset; 
        
        const measure = Math.floor(timestamp / 1000); 
        const sixteenth = Math.floor(timestamp % 1000 / 1000 * 16); 
        const notes = document.querySelectorAll(`.cell[data-measure = "${measure}"][data-sixteenth = "${sixteenth}"][data-active = "true"]`); 
        if(sixteenth === 0) {
            // console.log('BEAT', measure, sixteenth); 
        }
        
        const keys = Array.from(notes).map(note => +note.dataset.key); 
        const on_keys = keys.filter(k => !channel.includes(k)); 
        const off_keys = channel.filter(k => !keys.includes(k)); 
        if(keys.length || off_keys.length) {
            console.log('BEAT', keys, on_keys, off_keys); 
        }
        channel = keys; 
        
        if(is_playing) {
            window.requestAnimationFrame(play); 
        }
    }; 
})
