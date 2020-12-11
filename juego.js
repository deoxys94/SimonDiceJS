"use strict";

const botonAzul = document.getElementById('azul');
const botonMorado = document.getElementById('morado');
const botonNaranja = document.getElementById('naranja');
const botonVerde = document.getElementById('verde');
const botonEmpezar = document.getElementById('botonEmpezar');
let juego;

class Juego 
{
    constructor()
    {
        //#region Inicializar
        // Ocular el botón de inicio
        botonEmpezar.classList.add('hide');
        // Generar datos del juego
        this.nivel = 10;
        this.colores = {azul, morado, naranja, verde};

        // generar secuencia de números
        
        //#endregion
    
        this.generarSecuencia();
        this.siguienteNivel();
    }

    generarSecuencia()
    {
        this.secuencia = new Array(10).fill(0).map(n => Math.floor(Math.random() * 4));
    }

    siguienteNivel()
    {
        this.iluminarSecuencia();
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

    iluminarSecuencia()
    {
        for(let i = 0; i < this.nivel; i++)
        {
            console.log(i);
            let color = this.numeroAColor(this.secuencia[i]);

            setTimeout(() => {
                this.iluminarColor(color); 
            }, 1000 * i);
        }
    }

    iluminarColor(color)
    {
        this.colores[color].classList.add('light');
        setTimeout(() => this.apagarColor(color), 350)
    }

    apagarColor(color)
    {
        this.colores[color].classList.remove('light');
    }
}

function empezarJuego()
{
    juego = new Juego();
}

//#region Event listeners

botonEmpezar.addEventListener("click", empezarJuego);

//#endregion    