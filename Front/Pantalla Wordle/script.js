
const filas = document.querySelectorAll('.row');
let finalDiv = document.getElementById("final"); // cambiado de var a let
let filaActual = 0;
let letraActual = 0;

let juegoTerminado = false;
let palabraCorrecta = '';
let mensajeFinal = '';

let listaPalabras = [];

fetch('palabras.txt')
    .then(response => response.text())    
    .then(data => {
        listaPalabras = data.split('\n').map(palabra => palabra.trim().toUpperCase());
        palabraCorrecta = listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
        console.log(`Palabra correcta: ${palabraCorrecta}`);    
    })    
    .catch(err => console.log('Se produjo un error', err));

 /* function buscarCaracteresDuplicados(str) {
    var result = [];
    var count = 0;

    for (var i = 0; i < str.length; i++) {        
        for (var j = i + 1; j < str.length; j++) {
            console.log(`i: "${str[i]}"`);
            console.log(`j: "${str[j]}"`);
            if (str[i] === str[j]) {
                result.push(str[i]);
            }
        }
    }

    return result;
}  */

const confirmarPalabra = () => {
    if (letraActual != 5) return;

    const letras = filas[filaActual].querySelectorAll('.letra');
    let palabraIngresada = Array.from(letras).map(letter => letter.textContent).join('');

    if (!listaPalabras.includes(palabraIngresada)) {      
        mensajeFinal = 'La palabra ingresada no existe en el diccionario.'; // en lugar del alert
        finalDiv.innerHTML = mensajeFinal;
        return;
    }

    let sum = 0;    

    // let duplicados = buscarCaracteresDuplicados(palabraCorrecta);
    // console.log(duplicados);

    letras.forEach((letter, index) => {
        console.log(letter);
        letter.classList.add('checked');        
        const tecla = document.querySelector(`.key[data-key="${letter.textContent.toLowerCase()}"]`);
        if (letter.textContent === palabraCorrecta[index]) { // si la letra actual, está en la palabra buscada y en la posición correcta, se pinta de verde
            letter.style.backgroundColor = 'green';
            if (tecla) tecla.style.backgroundColor = 'green';
            sum++;
        } else if (palabraCorrecta.includes(letter.textContent)) { // si la letra actual, está en la palabr buscada pero no es la posición correcta, se pinta de amarillo
            // si la letra está más de una vez
            /* if (palabraCorrecta.indexOf(letter.textContent) !== palabraCorrecta.lastIndexOf(letter.textContent)) {                
            }; */
            letter.style.backgroundColor = 'yellow';
            if (tecla && tecla.style.backgroundColor !== 'green') {
                tecla.style.backgroundColor = 'yellow';
            }
        } else {
            letter.style.backgroundColor = 'gray';
            if (tecla) tecla.style.backgroundColor = 'gray';
        }
    });

    if (sum == 5) {
        mensajeFinal = `¡Felicidades! Has descubierto la palabra correcta: ${palabraCorrecta}.`;
        finalDiv.innerHTML = mensajeFinal;
        juegoTerminado = true;
    } else if (filaActual == 5) {
        mensajeFinal = `Has alcanzado el número máximo de intentos. La palabra correcta era: ${palabraCorrecta}`;
        finalDiv.innerHTML = mensajeFinal;
        juegoTerminado = true;
    } else {
        filaActual++;
        letraActual = 0;
    }
};

document.addEventListener('keydown', e => {
    if (juegoTerminado) return;
    const letras = filas[filaActual].querySelectorAll('.letra');
    if (e.key === 'Enter') {
        confirmarPalabra();
    } else if (e.key === 'Backspace' && letraActual > 0) {
        letraActual--;
        letras[letraActual].textContent = '';
        mensajeFinal = '';
        finalDiv.innerHTML = mensajeFinal;
    } else if (e.key.match(/^[a-zñ]$/i) && letraActual < 5) {
        letras[letraActual].textContent = e.key.toUpperCase();
        letraActual++;
    }
});

const teclas = document.querySelectorAll('.key');

teclas.forEach(tecla => {
    tecla.addEventListener('click', () => {
        if (juegoTerminado) return;
        const letras = filas[filaActual].querySelectorAll('.letra');

        if (tecla.dataset.key === 'enter') {
            confirmarPalabra();
        } else if (tecla.dataset.key === 'backspace' && letraActual > 0) {
            letraActual--;
            letras[letraActual].textContent = '';
        } else if (letraActual < 5) {
            letras[letraActual].textContent = tecla.dataset.key.toUpperCase();
            letraActual++;
        }
    });
});
const botonEnter = document.getElementById('enviar');
botonEnter.addEventListener("click", function() {
    confirmarPalabra();
});

const botonBorrar = document.getElementById('borrar');
botonBorrar.addEventListener("click", function() {
    const letras = filas[filaActual].querySelectorAll('.letra');
    if (letraActual > 0) {
        letraActual--;
        letras[letraActual].textContent = '';
    }    
});

/*
const botonReset = document.getElementById('reset');
botonReset.addEventListener("click", function() {
    location.reload();
});
*/
