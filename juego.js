"use strict";

const botonAzul = document.getElementById('azul');
const botonMorado = document.getElementById('morado');
const botonNaranja = document.getElementById('naranja');
const botonVerde = document.getElementById('verde');
const botonEmpezar = document.getElementById('botonEmpezar');
const puntaje = document.getElementById('mostrarPuntaje');
const contenedorPuntaje = document.getElementById('contenedorPuntaje');
const explicacionNivel = document.getElementById('explicacionNivel');
const selectorFacil = document.getElementById('selectorFacil');
const selectorNormal = document.getElementById('selectorNormal');
const selectorHeroico = document.getElementById('selectorHeroico');
const selectorLegendario = document.getElementById('selectorLegendario');
const botonPreparativos = document.getElementById('botonPreparativos');
const modalSelectorNivel = document.getElementById('modalSelectorNivel');
const botonCancelar = document.getElementById('botonCancelar');
let esInputUsuario;
let ultimoNivel;
let dificultad = "selectorFacil";
let velocidadReproduccion;
let juego;
let stringsExplicacion = 
{
    "explicacionFacil": "El juego contiene 10 niveles. La velocidad a la que cambian los colores es lenta.",
    "explicacionNormal": "El juego contiene 15 niveles. La velocidad a la que cambian los colores es normal",
    "explicacionHeroico": "El juego contiene 30 niveles. La velocidad a la que cambian los colores es rápida",
    "explicacionLegendario": "El juego contiene niveles ilimitados. La velocidad a la que cambian los colores es rápida"
}

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
        puntaje.innerHTML = "";
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
            botonPreparativos.classList.remove('hide');
        else
            botonPreparativos.classList.add('hide');

        if(contenedorPuntaje.classList.contains('hide'))
            contenedorPuntaje.classList.remove('hide');
        else
            contenedorPuntaje.classList.add('hide');
    }

    // Generar la secuencia de números necesaria para el juego
    generarSecuencia()
    {
        this.secuencia = new Array(ultimoNivel).fill(0).map(n => Math.floor(Math.random() * 4));
    }

    siguienteNivel()
    {
        puntaje.innerHTML = this.nivel - 1;
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
        
        if(!esInputUsuario)
            archivoAudio.playbackRate = velocidadReproduccion;
        else
            archivoAudio.playbackRate = 1;

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
        const archivoAudio = document.getElementById("audio-error");

        archivoAudio.currentTime = 0;
        archivoAudio.play();

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
        
        esInputUsuario = true;
        this.iluminarColor(nombreColor);
        esInputUsuario = false;

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

function mostrarModal()
{
    modalSelectorNivel.classList.add('is-active');
    selectorFacil.classList.add('is-active');
    explicacionNivel.innerHTML = stringsExplicacion.explicacionFacil;
}


function mostrarExplicaciones()
{
    dificultad = this.id;

    console.log(dificultad);
    console.log(typeof dificultad);

    switch (this.id) 
    {
        case "selectorFacil":
            if(selectorFacil.classList.contains('is-active'))
                return;

            selectorFacil.classList.add('is-active');
            selectorNormal.classList.remove('is-active');
            selectorHeroico.classList.remove('is-active');
            selectorLegendario.classList.remove('is-active');
            explicacionNivel.innerHTML = stringsExplicacion.explicacionFacil;

            break;
        case "selectorNormal":
            if(selectorNormal.classList.contains('is-active'))
                return;

            selectorFacil.classList.remove('is-active');
            selectorNormal.classList.add('is-active');
            selectorHeroico.classList.remove('is-active');
            selectorLegendario.classList.remove('is-active');
            explicacionNivel.innerHTML = stringsExplicacion.explicacionNormal;

            break;
        case "selectorHeroico":
            if(selectorHeroico.classList.contains('is-active'))
                return;

            selectorFacil.classList.remove('is-active');
            selectorNormal.classList.remove('is-active');
            selectorHeroico.classList.add('is-active');
            selectorLegendario.classList.remove('is-active');
            explicacionNivel.innerHTML = stringsExplicacion.explicacionHeroico;

            break;
        case "selectorLegendario":
            if(selectorLegendario.classList.contains('is-active'))
                return;

            selectorFacil.classList.remove('is-active');
            selectorNormal.classList.remove('is-active');
            selectorHeroico.classList.remove('is-active');
            selectorLegendario.classList.add('is-active');
            explicacionNivel.innerHTML = stringsExplicacion.explicacionLegendario;

            break;
    }
}

function cerrarModal()
{
    modalSelectorNivel.classList.remove('is-active');
    selectorFacil.classList.remove('is-active');
    explicacionNivel.innerHTML = "";
}

function empezarJuego()
{
    switch (dificultad) 
    {
        case "selectorFacil":
            ultimoNivel = 10;
            velocidadReproduccion = 0.5;
            break;
        case "selectorNormal":
            ultimoNivel = 15;
            velocidadReproduccion = 1;
            break;
        case "selectorHeroico":
            ultimoNivel = 30;
            velocidadReproduccion = 1.5;
            break;
        case "selectorLegendario":
            ultimoNivel = 100000;
            velocidadReproduccion = 3;
            break;
    }

    cerrarModal();

    juego = new Juego();
}

//#region Event listeners

botonPreparativos.addEventListener('click', mostrarModal);
selectorFacil.addEventListener('click', mostrarExplicaciones);
selectorNormal.addEventListener('click', mostrarExplicaciones);
selectorHeroico.addEventListener('click', mostrarExplicaciones);
selectorLegendario.addEventListener('click', mostrarExplicaciones);
botonEmpezar.addEventListener("click", empezarJuego);
botonCancelar.addEventListener('click', cerrarModal);

//#endregion    