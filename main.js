window.addEventListener('DOMContentLoaded', () => {
    
    // INIT 
    
    const channel = []; 
    
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
                cell.setAttribute('data-cell-measure', i); 
                cell.setAttribute('data-cell-sixteenth', j); 
                cell.setAttribute('data-cell-key', k); 
                cell.setAttribute('data-active', 'false'); 
                sixteenth.appendChild(cell); 
            }
        }
    }
    
    // ACTIVATE NOTE

    const activate_note = mouseEvent => {
        console.log('MOUSE', mouseEvent); 
        if(mouseEvent.buttons === 1) {
            mouseEvent.target.setAttribute('data-active', !mouseEvent.metaKey); 
        }
    }
    timeline.addEventListener('mousedown', activate_note); 
    timeline.addEventListener('mouseover', activate_note); 
    
    // PLAY BUTTON
    
    let is_playing = false; 
    const playButton = document.querySelector('.play-button'); 
    playButton.addEventListener('click', () => {
        is_playing = !is_playing; 
        playButton.innerText = is_playing ? '⏸' : '▶'; 
    }); 
})
