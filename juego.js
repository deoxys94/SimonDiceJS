"use strict";

const botonAzul = document.getElementById('azul');
const botonMorado = document.getElementById('morado');
const botonNaranja = document.getElementById('naranja');
const botonVerde = document.getElementById('verde');
const botonEmpezar = document.getElementById('botonEmpezar');
const ultimoNivel = 10;
let juego;

class Juego 
{
    constructor()
    { 
        this.iniciarJuego = this.iniciarJuego.bind(this); // Hace que this apunte al mismo objeto, siempre
        this.iniciarJuego();
        this.generarSecuencia(); // Genera la secuencia de números necesaria para jugar
        setTimeout(() => {
            this.siguienteNivel();
        }, 500); // El juego inicia en el nivel "0". Esta linea "ayuda" a que pase al nivel 1
    }

    iniciarJuego()
    {
        //#region Inicializar

        // Hacer que el puntero this sea lo mismo dentro de toda la clase
        this.elegirColor = this.elegirColor.bind(this);
        this.siguienteNivel = this.siguienteNivel.bind(this);

        // Ocular el botón de inicio
        this.estadoBotonEmpezar();
        
        // Generar datos del juego
        this.nivel = 1;
        this.colores = {azul, morado, naranja, verde};
        
        //#endregion
    }

    // Muestra u oculta el botón de inicio
    estadoBotonEmpezar()
    {
        if(botonEmpezar.classList.contains('hide'))
            botonEmpezar.classList.remove('hide');
        else
            botonEmpezar.classList.add('hide');
    }

    // Generar la secuencia de números necesaria para el juego
    generarSecuencia()
    {
        this.secuencia = new Array(ultimoNivel).fill(0).map(n => Math.floor(Math.random() * 4));
    }

    siguienteNivel()
    {
        this.subNivel = 0; // Variable necesaria para "recordar" el input del usuario
        this.iluminarSecuencia();
        this.inputUsuario();
    }

    numeroAColor(numero)
    {
        switch (numero) {
            case 0:
                return 'azul';
            case 1:
                return 'morado';
            case 2:
                return 'naranja';
            case 3:
                return 'verde';
        }
    }

    colorANumero(color)
    {
        switch (color) 
        {
            case 'azul':
                return 0;
            case 'morado':
                return 1;
            case 'naranja':
                return 2;
            case 'verde':
                return 3;
        }
    }

    iluminarSecuencia()
    {
        for(let i = 0; i < this.nivel; i++)
        {
            let color = this.numeroAColor(this.secuencia[i]);

            setTimeout(() => {
                this.iluminarColor(color); 
            }, 1000 * i);
        }
    }

    iluminarColor(color)
    {
        const archivoAudio = document.getElementById(`audio-${color}`);

        archivoAudio.currentTime = 0;
        archivoAudio.play();

        this.colores[color].classList.add('light');

        archivoAudio.addEventListener('ended', () =>
        {
            this.apagarColor(color);
        });
    }

    apagarColor(color)
    {
        this.colores[color].classList.remove('light');
    }

    // Permite que el navegador registre los clicks del usuario    
    inputUsuario()
    {
        this.colores.azul.addEventListener('click', this.elegirColor);
        this.colores.morado.addEventListener('click', this.elegirColor);
        this.colores.naranja.addEventListener('click', this.elegirColor);
        this.colores.verde.addEventListener('click', this.elegirColor);
    }

    // Elimina los event listeners para pasar al siguiente nivel
    restringirInputUsuario()
    {
        this.colores.azul.removeEventListener('click', this.elegirColor);
        this.colores.morado.removeEventListener('click', this.elegirColor);
        this.colores.naranja.removeEventListener('click', this.elegirColor);
        this.colores.verde.removeEventListener('click', this.elegirColor);
    }

    ganarJuego()
    {
        Swal.fire(
            'Buen trabajo!!',
            'Ganaste!!',
            'success'
        ).then(() => 
        {
            this.iniciarJuego();
        });
    }

    perdioJuego()
    {
        Swal.fire(
            'Oh no!!',
            'Has perdido. Buena suerte para la próxima.',
            'error').then(() =>
            {
                this.restringirInputUsuario();
                this.iniciarJuego();
            });
    }

    /* 
        Aqui es donde la "magia ocurre" 
        1. Obtiene el color que el usuario halla seleccionado (via el dataset designado)
        2. Ilumina el color seleccionado por el usuario
        3. si el color seleccionado NO es el mismo que el juego espera, el juego termina
        4. si el color seleccionado es el juego espera:
            - La variable subnivel (un indice al arreglo de numeros generado al inicio) aumenta 1
            - Si el subnivel es igual al último nivel + 1, el juego termina
            - Si el subnivel es igual al nivel actual: 
                - se eliminan los eventListener.
                - se incrementa el nivel actual.
                - se ejecuta siguiente nivel.
    */

    elegirColor(e)
    {
        let nombreColor = e.target.dataset.color;
        let numeroColor = this.colorANumero(nombreColor);
        this.iluminarColor(nombreColor);

        if(numeroColor === this.secuencia[this.subNivel])
        {
            this.subNivel++;

            if(this.subNivel === this.nivel)
            {
                this.nivel++;
                this.restringirInputUsuario();
                if (this.nivel === (ultimoNivel + 1))
                {
                    this.ganarJuego();
                }
                else
                {
                    setTimeout(() => {
                        this.siguienteNivel()
                    }, 2000);
                }
            }
        }
        else
        {
            this.perdioJuego();
        }
    }
}

function empezarJuego()
{
    juego = new Juego();
}

//#region Event listeners

botonEmpezar.addEventListener("click", empezarJuego);

//#endregion    